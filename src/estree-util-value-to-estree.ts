import {
  type ArrayExpression,
  type Expression,
  type Identifier,
  type Property,
  type Statement,
  type VariableDeclarator
} from 'estree'
import isPlainObject from 'is-plain-obj'

type Define = (value: unknown, init: Expression) => Expression

type Refer = (value: unknown) => Identifier | undefined

type AddStatement = (statement: Statement) => undefined

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

/**
 * Turn a value into an estree expression.
 *
 * @param value
 *   The value to process
 * @param addStatement
 *   A callback to register a statement to be invoked later.
 * @param define
 *   A callback to define a value as a variable.
 * @param refer
 *   A callback to refer to a value.
 * @param options
 *   The options passed to `valueToEstree`.
 * @returns
 *   An estree expression to represent the value.
 */
function processValue(
  value: unknown,
  addStatement: AddStatement,
  define: Define,
  refer: Refer,
  options: Options
): Expression {
  if (value === undefined) {
    return identifier(String(value))
  }

  if (value == null || typeof value === 'string' || typeof value === 'boolean') {
    return { type: 'Literal', value }
  }

  if (typeof value === 'bigint' || typeof value === 'number') {
    return processNumber(value)
  }

  if (typeof value === 'symbol') {
    if (value.description && value === Symbol.for(value.description)) {
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
        arguments: [processValue(value.description, addStatement, define, refer, options)]
      }
    }

    throw new TypeError(`Only global symbols are supported, got: ${String(value)}`)
  }

  const reference = refer(value)
  if (reference) {
    return reference
  }

  if (Array.isArray(value)) {
    const elements: ArrayExpression['elements'] = Array.from(value, () => null)
    const definition = define(value, {
      type: 'ArrayExpression',
      elements
    })

    for (let index = 0; index < value.length; index += 1) {
      if (!(index in value)) {
        continue
      }

      const expression = processValue(value[index], addStatement, define, refer, options)
      if (isIdentifier(definition) && isIdentifier(expression)) {
        addStatement({
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'MemberExpression',
              computed: true,
              optional: false,
              object: identifier(definition.name),
              property: processValue(index, addStatement, define, refer, options)
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
    value instanceof Boolean ||
    value instanceof Date ||
    value instanceof Number ||
    value instanceof String
  ) {
    return define(value, {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [processValue(value.valueOf(), addStatement, define, refer, options)]
    })
  }

  if (value instanceof RegExp) {
    return define(value, {
      type: 'Literal',
      value,
      regex: { pattern: value.source, flags: value.flags }
    })
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    return define(value, {
      type: 'CallExpression',
      optional: false,
      callee: {
        type: 'MemberExpression',
        computed: false,
        optional: false,
        object: identifier('Buffer'),
        property: identifier('from')
      },
      arguments: [processNumberArray(value)]
    })
  }

  if (
    value instanceof BigInt64Array ||
    value instanceof BigUint64Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof Int8Array ||
    value instanceof Int16Array ||
    value instanceof Int32Array ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Uint16Array ||
    value instanceof Uint32Array
  ) {
    return define(value, {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [processNumberArray(value)]
    })
  }

  if (value instanceof Set) {
    const args: Expression[] = []
    const definition = define(value, {
      type: 'NewExpression',
      callee: identifier('Set'),
      arguments: args
    })

    if (isIdentifier(definition)) {
      for (const val of value) {
        addStatement({
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
            arguments: [processValue(val, addStatement, define, refer, options)]
          }
        })
      }
    } else {
      args.push(processValue([...value], addStatement, define, refer, options))
    }

    return definition
  }

  if (value instanceof Map) {
    const args: Expression[] = []
    const definition = define(value, {
      type: 'NewExpression',
      callee: identifier('Map'),
      arguments: []
    })

    if (isIdentifier(definition)) {
      for (const [key, val] of value) {
        addStatement({
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
            arguments: [
              processValue(key, addStatement, define, refer, options),
              processValue(val, addStatement, define, refer, options)
            ]
          }
        })
      }
    } else {
      args.push(processValue([...value], addStatement, define, refer, options))
    }

    return definition
  }

  if (value instanceof URL || value instanceof URLSearchParams) {
    return define(value, {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [processValue(String(value), addStatement, define, refer, options)]
    })
  }

  if (options.instanceAsObject || isPlainObject(value)) {
    const properties: Property[] = []
    if (Object.getPrototypeOf(value) == null) {
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

    const definition = define(value, {
      type: 'ObjectExpression',
      properties
    })

    for (const key of Reflect.ownKeys(value)) {
      const keyExpression = processValue(key, addStatement, define, refer, options)
      const valueExpression = processValue(
        (value as Record<string | symbol, unknown>)[key],
        addStatement,
        define,
        refer,
        options
      )
      if (isIdentifier(definition) && isIdentifier(valueExpression)) {
        addStatement({
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

  throw new TypeError(`Unsupported value: ${value}`)
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

  const refer: Refer = (val) => {
    if (!options.preserveReferences) {
      return
    }

    const name = identifierNames.get(val)
    if (name) {
      return identifier(name)
    }
  }

  const define: Define = (val, init) => {
    if (!options.preserveReferences) {
      return init
    }

    let name = identifierNames.get(val)
    if (!name) {
      name = `var${identifierNames.size}`
      identifierNames.set(val, name)
      declarations.push({
        type: 'VariableDeclarator',
        id: identifier(name),
        init
      })
    }

    return refer(val)!
  }

  const result = processValue(
    value,
    (statement) => {
      statements.push(statement)
    },
    define,
    refer,
    options
  )

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
