import { valueToEstree } from '.';

describe('valueToEstree', () => {
  it('should handle undefined', () => {
    expect(valueToEstree()).toStrictEqual({ type: 'Identifier', name: 'undefined' });
  });

  it('should handle null', () => {
    expect(valueToEstree(null)).toStrictEqual({ type: 'Literal', value: null, raw: 'null' });
  });

  it('should handle Infinity', () => {
    expect(valueToEstree(Number.POSITIVE_INFINITY)).toStrictEqual({
      type: 'Identifier',
      name: 'Infinity',
    });
  });

  it('should handle -Infinity', () => {
    expect(valueToEstree(Number.NEGATIVE_INFINITY)).toStrictEqual({
      type: 'UnaryExpression',
      operator: '-',
      prefix: true,
      argument: { type: 'Identifier', name: 'Infinity' },
    });
  });

  it('should handle true', () => {
    expect(valueToEstree(true)).toStrictEqual({ type: 'Literal', value: true, raw: 'true' });
  });

  it('should handle false', () => {
    expect(valueToEstree(false)).toStrictEqual({ type: 'Literal', value: false, raw: 'false' });
  });

  it('should handle 0', () => {
    expect(valueToEstree(0)).toStrictEqual({ type: 'Literal', value: 0, raw: '0' });
  });

  it('should handle positive numbers', () => {
    expect(valueToEstree(42)).toStrictEqual({ type: 'Literal', value: 42, raw: '42' });
  });

  it('should handle negative numbers', () => {
    expect(valueToEstree(-666)).toStrictEqual({
      type: 'UnaryExpression',
      operator: '-',
      prefix: true,
      argument: { type: 'Literal', value: 666, raw: '666' },
    });
  });

  it('should handle positive bigints', () => {
    expect(valueToEstree(1337n)).toStrictEqual({
      type: 'Literal',
      value: 1337n,
      raw: '1337n',
      bigint: '1337',
    });
  });

  it('should handle negative bigints', () => {
    expect(valueToEstree(-1337n)).toStrictEqual({
      type: 'UnaryExpression',
      operator: '-',
      prefix: true,
      argument: {
        type: 'Literal',
        value: 1337n,
        raw: '1337n',
        bigint: '1337',
      },
    });
  });

  it('should handle strings', () => {
    expect(valueToEstree('Hello')).toStrictEqual({
      type: 'Literal',
      value: 'Hello',
      raw: '"Hello"',
    });
  });

  it('should handle NaN', () => {
    expect(valueToEstree(Number.NaN)).toStrictEqual({ type: 'Identifier', name: 'NaN' });
  });

  it('should handle regular expressions', () => {
    expect(valueToEstree(/\s+/i)).toStrictEqual({
      type: 'Literal',
      value: /\s+/i,
      raw: '/\\s+/i',
      regex: { pattern: '\\s+', flags: 'i' },
    });
  });

  it('should handle dates', () => {
    expect(valueToEstree(new Date(1_234_567_890_123))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'Date' },
      arguments: [
        {
          type: 'Literal',
          value: 1_234_567_890_123,
          raw: '1234567890123',
        },
      ],
    });
  });

  it('should handle arrays', () => {
    expect(valueToEstree([1, '2', , undefined])).toStrictEqual({
      type: 'ArrayExpression',
      elements: [
        { type: 'Literal', value: 1, raw: '1' },
        { type: 'Literal', value: '2', raw: '"2"' },
        null,
        { type: 'Identifier', name: 'undefined' },
      ],
    });
  });

  it('should handle Float32Array', () => {
    expect(valueToEstree(new Float32Array([1, 2, 3]))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'Float32Array' },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Literal', value: 1, raw: '1' },
            { type: 'Literal', value: 2, raw: '2' },
            { type: 'Literal', value: 3, raw: '3' },
          ],
        },
      ],
    });
  });

  it('should handle Float64Array', () => {
    expect(valueToEstree(new Float64Array([1, 2, 3]))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'Float64Array' },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Literal', value: 1, raw: '1' },
            { type: 'Literal', value: 2, raw: '2' },
            { type: 'Literal', value: 3, raw: '3' },
          ],
        },
      ],
    });
  });

  it('should handle Uint8Arrays', () => {
    expect(valueToEstree(new Uint8Array([1, 2, 3]))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'Uint8Array' },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Literal', value: 1, raw: '1' },
            { type: 'Literal', value: 2, raw: '2' },
            { type: 'Literal', value: 3, raw: '3' },
          ],
        },
      ],
    });
  });

  it('should handle Uint8ClampedArray', () => {
    expect(valueToEstree(new Uint8ClampedArray([1, 2, 3]))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'Uint8ClampedArray' },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Literal', value: 1, raw: '1' },
            { type: 'Literal', value: 2, raw: '2' },
            { type: 'Literal', value: 3, raw: '3' },
          ],
        },
      ],
    });
  });

  it('should handle Uint16Array', () => {
    expect(valueToEstree(new Uint16Array([1, 2, 3]))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'Uint16Array' },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Literal', value: 1, raw: '1' },
            { type: 'Literal', value: 2, raw: '2' },
            { type: 'Literal', value: 3, raw: '3' },
          ],
        },
      ],
    });
  });

  it('should handle Uint32Array', () => {
    expect(valueToEstree(new Uint32Array([1, 2, 3]))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'Uint32Array' },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Literal', value: 1, raw: '1' },
            { type: 'Literal', value: 2, raw: '2' },
            { type: 'Literal', value: 3, raw: '3' },
          ],
        },
      ],
    });
  });

  it('should handle global symbols', () => {
    expect(valueToEstree(Symbol.for('global'))).toStrictEqual({
      type: 'CallExpression',
      optional: false,
      callee: {
        type: 'MemberExpression',
        computed: false,
        optional: false,
        object: { type: 'Identifier', name: 'Symbol' },
        property: { type: 'Identifier', name: 'for' },
      },
      arguments: [{ type: 'Literal', value: 'global', raw: '"global"' }],
    });
  });

  it('should throw for local symbols', () => {
    expect(() => valueToEstree(Symbol('local'))).toThrow(
      new TypeError('Only global symbols are supported, got: Symbol(local)'),
    );
  });

  it('should handle URL', () => {
    expect(valueToEstree(new URL('https://example.com'))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'URL' },
      arguments: [
        {
          type: 'Literal',
          value: 'https://example.com/',
          raw: '"https://example.com/"',
        },
      ],
    });
  });

  it('should handle URLSearchParams', () => {
    expect(valueToEstree(new URLSearchParams('everything=awesome'))).toStrictEqual({
      type: 'NewExpression',
      callee: { type: 'Identifier', name: 'URLSearchParams' },
      arguments: [
        {
          type: 'Literal',
          value: 'everything=awesome',
          raw: '"everything=awesome"',
        },
      ],
    });
  });

  it('should handle object literals', () => {
    expect(valueToEstree({ number: 1, string: 'Hello', nothing: null })).toStrictEqual({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          method: false,
          shorthand: false,
          computed: false,
          kind: 'init',
          key: { type: 'Literal', value: 'number', raw: '"number"' },
          value: { type: 'Literal', value: 1, raw: '1' },
        },
        {
          type: 'Property',
          method: false,
          shorthand: false,
          computed: false,
          kind: 'init',
          key: { type: 'Literal', value: 'string', raw: '"string"' },
          value: { type: 'Literal', value: 'Hello', raw: '"Hello"' },
        },
        {
          type: 'Property',
          method: false,
          shorthand: false,
          computed: false,
          kind: 'init',
          key: { type: 'Literal', value: 'nothing', raw: '"nothing"' },
          value: { type: 'Literal', value: null, raw: 'null' },
        },
      ],
    });
  });

  it('should throw for unsupported values', () => {
    // @ts-expect-error This tests an unsupported value.
    expect(() => valueToEstree(() => null)).toThrow(new TypeError('Unsupported value: () => null'));
    class A {
      a = '';
    }
    // @ts-expect-error This tests an unsupported value.
    expect(() => valueToEstree(new A())).toThrow(
      new TypeError('Unsupported value: [object Object]'),
    );
  });
});
