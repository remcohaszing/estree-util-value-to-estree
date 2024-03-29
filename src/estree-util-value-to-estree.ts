import { type Expression, type Property } from 'estree'
import isPlainObject from 'is-plain-obj'

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
  if (value === undefined || value === Number.POSITIVE_INFINITY || Number.isNaN(value)) {
    return { type: 'Identifier', name: String(value) }
  }

  if (value == null || typeof value === 'string' || typeof value === 'boolean') {
    return { type: 'Literal', value }
  }

  if (typeof value === 'bigint') {
    return value >= 0
      ? { type: 'Literal', value, bigint: String(value) }
      : {
          type: 'UnaryExpression',
          operator: '-',
          prefix: true,
          argument: valueToEstree(-value, options)
        }
  }

  if (typeof value === 'number') {
    return value >= 0 && !Object.is(value, -0)
      ? { type: 'Literal', value }
      : {
          type: 'UnaryExpression',
          operator: '-',
          prefix: true,
          argument: valueToEstree(-value, options)
        }
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
          object: { type: 'Identifier', name: 'Symbol' },
          property: { type: 'Identifier', name: 'for' }
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
      callee: { type: 'Identifier', name: value.constructor.name },
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
        object: { type: 'Identifier', name: 'Buffer' },
        property: { type: 'Identifier', name: 'from' }
      },
      arguments: [valueToEstree([...value])]
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
    value instanceof Map ||
    value instanceof Set ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Uint16Array ||
    value instanceof Uint32Array
  ) {
    return {
      type: 'NewExpression',
      callee: { type: 'Identifier', name: value.constructor.name },
      arguments: [valueToEstree([...value], options)]
    }
  }

  if (value instanceof URL || value instanceof URLSearchParams) {
    return {
      type: 'NewExpression',
      callee: { type: 'Identifier', name: value.constructor.name },
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
        key: { type: 'Identifier', name: '__proto__' },
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
