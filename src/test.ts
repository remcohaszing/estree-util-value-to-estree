import * as assert from 'node:assert/strict'
import { test } from 'node:test'

import { generate } from 'astring'
import { valueToEstree } from 'estree-util-value-to-estree'
import { testFixturesDirectory } from 'snapshot-fixtures'

testFixturesDirectory<{ recursive?: boolean }>({
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
          '// Recursive references are not supported witout preserveReferences'
      }
      return `
        // Used as input
        // { preserveReferences: true }
        export default ${withPreserveReferences}

        // -------------------------------------------------------------------------------------------------

        // Default output
        // { preserveReferences: false }
        ${withoutPreserveReferences}`
    }
  }
})

test('throw for local symbols', () => {
  assert.throws(
    () => valueToEstree(Symbol('local')),
    new TypeError('Only global symbols are supported, got: Symbol(local)')
  )
})

test('throw for unsupported values', () => {
  assert.throws(() => valueToEstree(() => null), new TypeError('Unsupported value: () => null'))
  class A {
    a = ''
  }
  assert.throws(() => valueToEstree(new A()), new TypeError('Unsupported value: [object Object]'))
})

test('transform to json on unsupported values w/ `instanceAsObject`', () => {
  class Point {
    line: number

    column: number

    constructor(line: number, column: number) {
      this.line = line
      this.column = column
    }
  }

  const point = new Point(2, 3)

  assert.throws(() => valueToEstree(point), new TypeError('Unsupported value: [object Object]'))

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
