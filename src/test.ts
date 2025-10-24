import 'temporal-polyfill/global'

import assert from 'node:assert/strict'
import { test } from 'node:test'

import { Float16Array } from '@petamoriken/float16'
import { generate } from 'astring'
import { valueToEstree } from 'estree-util-value-to-estree'
import { testFixturesDirectory } from 'snapshot-fixtures'

globalThis.Float16Array ??= Float16Array

testFixturesDirectory({
  directory: new URL('../fixtures', import.meta.url),
  prettier: true,
  tests: {
    async 'input.js'(input) {
      const { default: value } = await import(input.path)
      const withPreserveReferences = generate(valueToEstree(value, { preserveReferences: true }))
      let withoutPreserveReferences: string
      try {
        withoutPreserveReferences = `const withoutPreserveReferences = ${generate(valueToEstree(value))}`
      } catch {
        withoutPreserveReferences =
          '// Recursive references are not supported without preserveReferences'
      }
      return `
        // Used as input
        // { preserveReferences: true }
        export default ${withPreserveReferences}

        // -------------------------------------------------------------------------------------------------

        // Default output
        // { preserveReferences: false }
        ${withoutPreserveReferences}
      `
    }
  }
})

test('throw for local symbols', () => {
  const symbol = Symbol('local')
  assert.throws(
    () => valueToEstree(symbol),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Only global symbols are supported, got: Symbol(local)')
      assert.equal(error.cause, symbol)
      return true
    }
  )
})

test('throw for unsupported values', () => {
  const fn = (): null => null
  assert.throws(
    () => valueToEstree(fn),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Unsupported value: () => null')
      assert.equal(error.cause, fn)
      return true
    }
  )

  class A {
    a = ''
  }

  const a = new A()
  assert.throws(
    () => valueToEstree(a),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Unsupported value: [object Object]')
      assert.equal(error.cause, a)
      return true
    }
  )
})

test('throw for cyclic references', () => {
  const object: Record<string, unknown> = {}
  object.reference = object
  assert.throws(
    () => valueToEstree(object),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'Found circular reference: [object Object]')
      assert.equal(error.cause, object)
      return true
    }
  )
})

test('transform to json on unsupported values with `instanceAsObject`', () => {
  class Point {
    line: number

    column: number

    constructor(line: number, column: number) {
      this.line = line
      this.column = column
    }
  }

  const point = new Point(2, 3)

  assert.throws(
    () => valueToEstree(point),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Unsupported value: [object Object]')
      assert.equal(error.cause, point)
      return true
    }
  )

  assert.deepEqual(valueToEstree(point, { instanceAsObject: true }), {
    type: 'ObjectExpression',
    properties: [
      {
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        kind: 'init',
        key: { type: 'Literal', value: 'line' },
        value: { type: 'Literal', value: 2 }
      },
      {
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        kind: 'init',
        key: { type: 'Literal', value: 'column' },
        value: { type: 'Literal', value: 3 }
      }
    ]
  })
})

test('transform an unsupported value with replacer', () => {
  class Point {
    line: number

    column: number

    constructor(line: number, column: number) {
      this.line = line
      this.column = column
    }
  }

  const point = new Point(2, 3)

  assert.deepEqual(
    generate(
      valueToEstree([point, point], {
        preserveReferences: true,
        replacer(value) {
          if (value instanceof Point) {
            return {
              type: 'NewExpression',
              callee: { type: 'Identifier', name: 'Point' },
              arguments: [
                { type: 'Literal', value: value.line },
                { type: 'Literal', value: value.column }
              ]
            }
          }
        }
      })
    ),
    '(($0 = new Point(2, 3)) => ([$0, $0]))()'
  )
})

test('transform a function with replacer', () => {
  assert.deepEqual(
    generate(
      valueToEstree(
        { setTimeout },
        {
          preserveReferences: true,
          replacer(value) {
            if (value === setTimeout) {
              return { type: 'Identifier', name: 'setTimeout' }
            }
          }
        }
      )
    ),
    '{\n  "setTimeout": setTimeout\n}'
  )
})
