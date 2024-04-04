import {
  type ArrayExpression,
  type Expression,
  type Identifier,
  type Property,
  type Statement,
  type VariableDeclarator
} from 'estree'
import isPlainObject from 'is-plain-obj'

interface Context extends Options {
  /**
   * Add a statement to the context to be invoked later.
   */
  addStatement: (statement: Statement) => undefined

  /**
   * Define a value as a variable.
   */
  define: (value: unknown, init: Expression) => Expression

  /**
   * Get a reference to a value.
   */
  refer: (value: unknown) => Identifier | undefined
}

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
 * @param context
 *   The current context.
 * @returns
 *   An estree expression to represent the value.
 */
function processValue(value: unknown, context: Context): Expression {
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
        arguments: [processValue(value.description, context)]
      }
    }

    throw new TypeError(`Only global symbols are supported, got: ${String(value)}`)
  }

  const reference = context.refer(value)
  if (reference) {
    return reference
  }

  if (Array.isArray(value)) {
    const elements: ArrayExpression['elements'] = Array.from(value, () => null)
    const definition = context.define(value, {
      type: 'ArrayExpression',
      elements
    })

    for (let index = 0; index < value.length; index += 1) {
      if (!(index in value)) {
        continue
      }

      const expression = processValue(value[index], context)
      if (isIdentifier(definition) && isIdentifier(expression)) {
        context.addStatement({
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'MemberExpression',
              computed: true,
              optional: false,
              object: identifier(definition.name),
              property: processValue(index, context)
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
    return context.define(value, {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [processValue(value.valueOf(), context)]
    })
  }

  if (value instanceof RegExp) {
    return context.define(value, {
      type: 'Literal',
      value,
      regex: { pattern: value.source, flags: value.flags }
    })
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    return context.define(value, {
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
    return context.define(value, {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [processNumberArray(value)]
    })
  }

  if (value instanceof Set) {
    const args: Expression[] = []
    const definition = context.define(value, {
      type: 'NewExpression',
      callee: identifier('Set'),
      arguments: args
    })

    if (isIdentifier(definition)) {
      for (const val of value) {
        context.addStatement({
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
            arguments: [processValue(val, context)]
          }
        })
      }
    } else {
      args.push(processValue([...value], context))
    }

    return definition
  }

  if (value instanceof Map) {
    const args: Expression[] = []
    const definition = context.define(value, {
      type: 'NewExpression',
      callee: identifier('Map'),
      arguments: args
    })

    if (isIdentifier(definition)) {
      for (const [key, val] of value) {
        context.addStatement({
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
            arguments: [processValue(key, context), processValue(val, context)]
          }
        })
      }
    } else {
      args.push(processValue([...value], context))
    }

    return definition
  }

  if (value instanceof URL || value instanceof URLSearchParams) {
    return context.define(value, {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [processValue(String(value), context)]
    })
  }

  if (context.instanceAsObject || isPlainObject(value)) {
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

    const definition = context.define(value, {
      type: 'ObjectExpression',
      properties
    })

    for (const key of Reflect.ownKeys(value)) {
      const keyExpression = processValue(key, context)
      const valueExpression = processValue(
        (value as Record<string | symbol, unknown>)[key],
        context
      )
      if (isIdentifier(definition) && isIdentifier(valueExpression)) {
        context.addStatement({
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

  const result = processValue(value, {
    ...options,
    addStatement(statement) {
      statements.push(statement)
    },
    refer(val) {
      const name = identifierNames.get(val)
      if (name) {
        return identifier(name)
      }
    },
    define(val, init) {
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
  })

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
