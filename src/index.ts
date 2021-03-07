import { Expression } from 'estree';

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34960#issuecomment-576906058
declare const URL: typeof globalThis extends { URL: infer URLCtor }
  ? URLCtor
  : typeof import('url').URL;
declare const URLSearchParams: typeof globalThis extends { URL: infer URLSearchParamsCtor }
  ? URLSearchParamsCtor
  : typeof import('url').URLSearchParams;

/**
 * A value that can be serialized by `estree-util-from-value`.
 */
export type Value =
  | Date
  | Float32Array
  | Float64Array
  | RegExp
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | URL
  | URLSearchParams
  | Value[]
  | boolean
  | number
  | string
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  | { [key: string]: Value }
  | null
  | undefined;

/**
 * Convert a value to an ESTree node
 *
 * @param value - The value to convert
 * @returns The ESTree node.
 */
export function valueToEstree(value?: Value): Expression {
  if (value === undefined) {
    return { type: 'Identifier', name: 'undefined' };
  }
  if (value == null) {
    return { type: 'Literal', value: null, raw: 'null' };
  }
  if (value === Number.POSITIVE_INFINITY) {
    return { type: 'Identifier', name: 'Infinity' };
  }
  if (Number.isNaN(value)) {
    return { type: 'Identifier', name: 'NaN' };
  }
  if (typeof value === 'boolean') {
    return { type: 'Literal', value, raw: String(value) };
  }
  if (typeof value === 'number') {
    return value >= 0
      ? { type: 'Literal', value, raw: String(value) }
      : { type: 'UnaryExpression', operator: '-', prefix: true, argument: valueToEstree(-value) };
  }
  if (typeof value === 'string') {
    return { type: 'Literal', value, raw: JSON.stringify(value) };
  }
  if (Array.isArray(value)) {
    return { type: 'ArrayExpression', elements: value.map(valueToEstree) };
  }
  if (value instanceof RegExp) {
    return {
      type: 'Literal',
      value,
      raw: String(value),
      regex: { pattern: value.source, flags: value.flags },
    };
  }
  if (value instanceof Date) {
    return {
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'Date' },
      arguments: [valueToEstree(value.getTime())],
    };
  }
  if (
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Uint16Array ||
    value instanceof Uint32Array
  ) {
    return {
      type: 'NewExpression',
      callee: { type: 'Identifier', name: value.constructor.name },
      arguments: [valueToEstree([...value])],
    };
  }
  if (value instanceof URL || value instanceof URLSearchParams) {
    return {
      type: 'NewExpression',
      callee: { type: 'Identifier', name: value.constructor.name },
      arguments: [valueToEstree(String(value))],
    };
  }
  return {
    type: 'ObjectExpression',
    properties: Object.entries(value).map(([name, val]) => ({
      type: 'Property',
      method: false,
      shorthand: false,
      computed: false,
      kind: 'init',
      key: valueToEstree(name),
      value: valueToEstree(val),
    })),
  };
}
