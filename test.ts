import { generate } from 'astring';
import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { valueToEstree } from './index.js';

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
  "nothing": null,
  [Symbol.for("key")]: "value"
}`,
  'new BigInt64Array([1n, 2n, 3n])',
  'new BigUint64Array([1n, 2n, 3n])',
  'new Boolean(false)',
  'new Boolean(true)',
  'new Date(1234567890123)',
  'new Float32Array([1, 2, 3])',
  'new Float64Array([1, 2, 3])',
  'new Int16Array([1, 2, 3])',
  'new Int32Array([1, 2, 3])',
  'new Int8Array([1, 2, 3])',
  'new Map([[{}, 42], [42, {}]])',
  'new Number(-456)',
  'new Number(456)',
  'new Set([42, "not 42"])',
  'new String("This is a string instance")',
  'new Uint16Array([1, 2, 3])',
  'new Uint32Array([1, 2, 3])',
  'new Uint8Array([1, 2, 3])',
  'new Uint8ClampedArray([1, 2, 3])',
  'new URL("https://example.com/")',
  'new URLSearchParams("everything=awesome")',
  'Buffer.from([1, 2, 3])',
  'Symbol.for("global")',
];

for (const fixture of tests) {
  test(fixture, () => {
    // eslint-disable-next-line no-new-func
    const value = new Function(`return ${fixture}`)();
    const ast = valueToEstree(value);
    const result = generate(ast);
    assert.is(result, fixture);
  });
}

test('throw for local symbols', () => {
  assert.throws(
    () => valueToEstree(Symbol('local')),
    new TypeError('Only global symbols are supported, got: Symbol(local)'),
  );
});

test('throw for unsupported values', () => {
  assert.throws(() => valueToEstree(() => null), new TypeError('Unsupported value: () => null'));
  class A {
    a = '';
  }
  assert.throws(() => valueToEstree(new A()), new TypeError('Unsupported value: [object Object]'));
});

test('transform to json on unsupported values w/ `instanceAsObject`', () => {
  class Point {
    line: number;
    column: number;
    constructor(line: number, column: number) {
      this.line = line;
      this.column = column;
    }
  }

  const point = new Point(2, 3);

  assert.throws(() => valueToEstree(point), new TypeError('Unsupported value: [object Object]'));

  assert.equal(valueToEstree(point, { instanceAsObject: true }), {
    type: 'ObjectExpression',
    properties: [
      {
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        kind: 'init',
        key: { type: 'Literal', value: 'line' },
        value: { type: 'Literal', value: 2 },
      },
      {
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        kind: 'init',
        key: { type: 'Literal', value: 'column' },
        value: { type: 'Literal', value: 3 },
      },
    ],
  });
});

test.run();
