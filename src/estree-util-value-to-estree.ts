import { type Expression, type Identifier, type Property } from 'estree'
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
  return { type: 'ArrayExpression', elements: Array.from(numbers, processNumber) }
}

export interface Options {
  /**
   * If true, treat objects that have a prototype as plain objects.
   */
  instanceAsObject?: boolean
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
        arguments: [valueToEstree(value.description, options)]
      }
    }

    throw new TypeError(`Only global symbols are supported, got: ${String(value)}`)
  }

  if (Array.isArray(value)) {
    const elements: (Expression | null)[] = []
    for (let i = 0; i < value.length; i += 1) {
      elements.push(i in value ? valueToEstree(value[i], options) : null)
    }
    return { type: 'ArrayExpression', elements }
  }

  if (
    value instanceof Boolean ||
    value instanceof Date ||
    value instanceof Number ||
    value instanceof String
  ) {
    return {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [valueToEstree(value.valueOf(), options)]
    }
  }

  if (value instanceof RegExp) {
    return {
      type: 'Literal',
      value,
      regex: { pattern: value.source, flags: value.flags }
    }
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    return {
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
    }
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
    return {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [processNumberArray(value)]
    }
  }

  if (value instanceof Map || value instanceof Set) {
    return {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [valueToEstree([...value], options)]
    }
  }

  if (value instanceof URL || value instanceof URLSearchParams) {
    return {
      type: 'NewExpression',
      callee: identifier(value.constructor.name),
      arguments: [valueToEstree(String(value), options)]
    }
  }

  if (options.instanceAsObject || isPlainObject(value)) {
    const properties = Reflect.ownKeys(value).map<Property>((key) => ({
      type: 'Property',
      method: false,
      shorthand: false,
      computed: typeof key !== 'string',
      kind: 'init',
      key: valueToEstree(key, options),
      value: valueToEstree((value as Record<string | symbol, unknown>)[key], options)
    }))

    if (Object.getPrototypeOf(value) == null) {
      properties.unshift({
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        kind: 'init',
        key: identifier('__proto__'),
        value: { type: 'Literal', value: null }
      })
    }

    return {
      type: 'ObjectExpression',
      properties
    }
  }

  throw new TypeError(`Unsupported value: ${String(value)}`)
}
