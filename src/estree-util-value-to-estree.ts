import {
  type ArrayExpression,
  type Expression,
  type Identifier,
  type Property,
  type Statement,
  type VariableDeclarator
} from 'estree'
import isPlainObject from 'is-plain-obj'

/**
 * Create an estree identifier node for a given name.
 *
 * @param name
 *   The name of the identifier.
 * @returns
 *   The identifier node.
 */
function identifier(name: string): Identifier {
  return { type: 'Identifier', name }
}

/**
 * Check whether an expression is a variable identifier.
 *
 * @param expression
 *   The expression to check
 * @returns
 *   True if the expression identifies a variable, false otherwise.
 */
function isIdentifier(expression: Expression): expression is Identifier {
  return (
    expression.type === 'Identifier' &&
    expression.name !== 'undefined' &&
    expression.name !== 'Infinity' &&
    expression.name !== 'NaN'
  )
}

/**
 * Turn a number or bigint into an estree expression. This handles positive and negative numbers and
 * bigints as well as special numbers.
 *
 * @param number
 *   The value to turn into an estree expression.
 * @returns
 *   An expression that represents the given value.
 */
function processNumber(number: bigint | number): Expression {
  if (number < 0 || Object.is(number, -0)) {
    return {
      type: 'UnaryExpression',
      operator: '-',
      prefix: true,
      argument: processNumber(-number)
    }
  }

  if (typeof number === 'bigint') {
    return { type: 'Literal', value: number, bigint: String(number) }
  }

  if (number === Number.POSITIVE_INFINITY || Number.isNaN(number)) {
    return identifier(String(number))
  }

  return { type: 'Literal', value: number }
}

/**
 * Process an array of numbers. This is a shortcut for iterables whose constructor takes an array of
 * numbers as input.
 *
 * @param numbers
 *   The numbers to add to the array expression.
 * @returns
 *   An estree array expression whose elements match the input numbers.
 */
function processNumberArray(numbers: Iterable<bigint | number>): Expression {
  const elements: Expression[] = []

  for (const value of numbers) {
    elements.push(processNumber(value))
  }

  return { type: 'ArrayExpression', elements }
}

export interface Options {
  /**
   * If true, treat objects that have a prototype as plain objects.
   *
   * @default false
   */
  instanceAsObject?: boolean

  /**
   * If true, preserve references to the same object found within the input. This also allows to
   * serialize recursive structures. If needed, the resulting expression will be an iife.
   *
   * @default false
   */
  preserveReferences?: boolean
}

/**
 * Convert a value to an ESTree node.
 *
 * @param value
 *   The value to convert.
 * @param options
 *   Additional options to configure the output.
 * @returns
 *   The ESTree node.
 */
export function valueToEstree(value: unknown, options: Options = {}): Expression {
  const statements: Statement[] = []
  const declarations: VariableDeclarator[] = []
  const identifierNames = new Map<unknown, string>()

  /**
   * Define a value as a variable in the current scope.
   *
   * @param val
   *   The value to define.
   * @param init
   *   The estree expression used to initialize the value.
   * @returns
   *   An expression that can be used to refer to the value.
   */
  function define(val: unknown, init: Expression): Expression {
    if (!options.preserveReferences) {
      return init
    }

    const name = `var${identifierNames.size}`
    identifierNames.set(val, name)
    declarations.push({
      type: 'VariableDeclarator',
      id: identifier(name),
      init
    })

    return identifier(name)
  }

  /**
   * Turn a value into an estree expression.
   *
   * @param val
   *   The value to process
   * @returns
   *   An estree expression to represent the value.
   */
  function processValue(val: unknown): Expression {
    if (val === undefined) {
      return identifier(String(val))
    }

    if (val == null || typeof val === 'string' || typeof val === 'boolean') {
      return { type: 'Literal', value: val }
    }

    if (typeof val === 'bigint' || typeof val === 'number') {
      return processNumber(val)
    }

    if (typeof val === 'symbol') {
      if (val.description && val === Symbol.for(val.description)) {
        return {
          type: 'CallExpression',
          optional: false,
          callee: {
            type: 'MemberExpression',
            computed: false,
            optional: false,
            object: identifier('Symbol'),
            property: identifier('for')
          },
          arguments: [processValue(val.description)]
        }
      }

      throw new TypeError(`Only global symbols are supported, got: ${String(val)}`)
    }

    const name = identifierNames.get(val)
    if (name) {
      return identifier(name)
    }

    if (Array.isArray(val)) {
      const elements: ArrayExpression['elements'] = Array.from(val, () => null)
      const definition = define(val, {
        type: 'ArrayExpression',
        elements
      })

      for (let index = 0; index < val.length; index += 1) {
        if (!(index in val)) {
          continue
        }

        const expression = processValue(val[index])
        if (isIdentifier(definition) && isIdentifier(expression)) {
          statements.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'MemberExpression',
                computed: true,
                optional: false,
                object: identifier(definition.name),
                property: processValue(index)
              },
              right: expression
            }
          })
        } else {
          elements[index] = expression
        }
      }

      return definition
    }

    if (
      val instanceof Boolean ||
      val instanceof Date ||
      val instanceof Number ||
      val instanceof String
    ) {
      return define(val, {
        type: 'NewExpression',
        callee: identifier(val.constructor.name),
        arguments: [processValue(val.valueOf())]
      })
    }

    if (val instanceof RegExp) {
      return define(val, {
        type: 'Literal',
        value: val,
        regex: { pattern: val.source, flags: val.flags }
      })
    }

    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(val)) {
      return define(val, {
        type: 'CallExpression',
        optional: false,
        callee: {
          type: 'MemberExpression',
          computed: false,
          optional: false,
          object: identifier('Buffer'),
          property: identifier('from')
        },
        arguments: [processNumberArray(val)]
      })
    }

    if (
      val instanceof BigInt64Array ||
      val instanceof BigUint64Array ||
      val instanceof Float32Array ||
      val instanceof Float64Array ||
      val instanceof Int8Array ||
      val instanceof Int16Array ||
      val instanceof Int32Array ||
      val instanceof Uint8Array ||
      val instanceof Uint8ClampedArray ||
      val instanceof Uint16Array ||
      val instanceof Uint32Array
    ) {
      return define(val, {
        type: 'NewExpression',
        callee: identifier(val.constructor.name),
        arguments: [processNumberArray(val)]
      })
    }

    if (val instanceof Set) {
      const args: Expression[] = []
      const definition = define(val, {
        type: 'NewExpression',
        callee: identifier('Set'),
        arguments: args
      })

      if (isIdentifier(definition)) {
        for (const entry of val) {
          statements.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              optional: false,
              callee: {
                type: 'MemberExpression',
                computed: false,
                optional: false,
                object: identifier(definition.name),
                property: identifier('add')
              },
              arguments: [processValue(entry)]
            }
          })
        }
      } else {
        args.push(processValue([...val]))
      }

      return definition
    }

    if (val instanceof Map) {
      const args: Expression[] = []
      const definition = define(val, {
        type: 'NewExpression',
        callee: identifier('Map'),
        arguments: args
      })

      if (isIdentifier(definition)) {
        for (const pair of val) {
          statements.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              optional: false,
              callee: {
                type: 'MemberExpression',
                computed: false,
                optional: false,
                object: identifier(definition.name),
                property: identifier('set')
              },
              arguments: [processValue(pair[0]), processValue(pair[1])]
            }
          })
        }
      } else {
        args.push(processValue([...val]))
      }

      return definition
    }

    if (val instanceof URL || val instanceof URLSearchParams) {
      return define(val, {
        type: 'NewExpression',
        callee: identifier(val.constructor.name),
        arguments: [processValue(String(val))]
      })
    }

    if (options.instanceAsObject || isPlainObject(val)) {
      const properties: Property[] = []
      if (Object.getPrototypeOf(val) == null) {
        properties.push({
          type: 'Property',
          method: false,
          shorthand: false,
          computed: false,
          kind: 'init',
          key: identifier('__proto__'),
          value: { type: 'Literal', value: null }
        })
      }

      const definition = define(val, {
        type: 'ObjectExpression',
        properties
      })

      for (const key of Reflect.ownKeys(val)) {
        const keyExpression = processValue(key)
        const valueExpression = processValue((val as Record<string | symbol, unknown>)[key])
        if (isIdentifier(definition) && isIdentifier(valueExpression)) {
          statements.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'MemberExpression',
                computed: true,
                optional: false,
                object: identifier(definition.name),
                property: keyExpression
              },
              right: valueExpression
            }
          })
        } else {
          properties.push({
            type: 'Property',
            method: false,
            shorthand: false,
            computed: typeof key !== 'string',
            kind: 'init',
            key: keyExpression,
            value: valueExpression
          })
        }
      }

      return definition
    }

    throw new TypeError(`Unsupported value: ${val}`)
  }

  const result = processValue(value)

  if (statements.length === 0) {
    return declarations[0]?.init ?? result
  }

  statements.unshift({
    type: 'VariableDeclaration',
    kind: 'const',
    declarations
  })

  statements.push({
    type: 'ReturnStatement',
    argument: result
  })

  return {
    type: 'CallExpression',
    optional: false,
    arguments: [],
    callee: {
      type: 'ArrowFunctionExpression',
      expression: false,
      params: [],
      body: {
        type: 'BlockStatement',
        body: statements
      }
    }
  }
}
