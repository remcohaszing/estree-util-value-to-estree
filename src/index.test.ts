import { generate } from 'astring';

import { valueToEstree } from '.';

const tests = [
  'undefined',
  'null',
  'Infinity',
  '-Infinity',
  'true',
  'false',
  '0',
  '42',
  '-666',
  '1337n',
  '-1337n',
  '"Hello"',
  'NaN',
  '/\\s+/i',
  '[1, "2", , undefined]',
  `{
  "number": 1,
  "string": "Hello",
  "nothing": null
}`,
  'new BigInt64Array([1n, 2n, 3n])',
  'new BigUint64Array([1n, 2n, 3n])',
  'new Date(1234567890123)',
  'new Float32Array([1, 2, 3])',
  'new Float64Array([1, 2, 3])',
  'new Int16Array([1, 2, 3])',
  'new Int32Array([1, 2, 3])',
  'new Int8Array([1, 2, 3])',
  'new Map([[{}, 42], [42, {}]])',
  'new Set([42, "not 42"])',
  'new Uint16Array([1, 2, 3])',
  'new Uint32Array([1, 2, 3])',
  'new Uint8Array([1, 2, 3])',
  'new Uint8ClampedArray([1, 2, 3])',
  'new URL("https://example.com/")',
  'new URLSearchParams("everything=awesome")',
  'Buffer.from([1, 2, 3])',
  'Symbol.for("global")',
];

describe('valueToEstree', () => {
  it.each(tests)('%s', (code) => {
    // eslint-disable-next-line no-new-func
    const value = new Function(`return ${code}`)();
    const ast = valueToEstree(value);
    const result = generate(ast);
    expect(result).toBe(code);
  });

  it('should throw for local symbols', () => {
    expect(() => valueToEstree(Symbol('local'))).toThrow(
      new TypeError('Only global symbols are supported, got: Symbol(local)'),
    );
  });

  it('should throw for unsupported values', () => {
    expect(() => valueToEstree(() => null)).toThrow(new TypeError('Unsupported value: () => null'));
    class A {
      a = '';
    }
    expect(() => valueToEstree(new A())).toThrow(
      new TypeError('Unsupported value: [object Object]'),
    );
  });

  it('should transform to json on unsupported values w/ `instanceAsObject`', () => {
    class Point {
      line: number;
      column: number;
      constructor(line: number, column: number) {
        this.line = line;
        this.column = column;
      }
    }

    const point = new Point(2, 3);

    expect(() => valueToEstree(point)).toThrow(new TypeError('Unsupported value: [object Object]'));

    expect(valueToEstree(point, { instanceAsObject: true })).toStrictEqual({
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          method: false,
          shorthand: false,
          computed: false,
          kind: 'init',
          key: { type: 'Literal', value: 'line', raw: '"line"' },
          value: { type: 'Literal', value: 2, raw: '2' },
        },
        {
          type: 'Property',
          method: false,
          shorthand: false,
          computed: false,
          kind: 'init',
          key: { type: 'Literal', value: 'column', raw: '"column"' },
          value: { type: 'Literal', value: 3, raw: '3' },
        },
      ],
    });
  });
});
