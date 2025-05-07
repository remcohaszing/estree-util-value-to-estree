import assert from 'node:assert/strict'
import { test } from 'node:test'

import { Temporal as LocalTemporal } from '@js-temporal/polyfill'
import { Float16Array } from '@petamoriken/float16'
import { generate } from 'astring'
import { valueToEstree } from 'estree-util-value-to-estree'
import { testFixturesDirectory } from 'snapshot-fixtures'

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention
  var Temporal: typeof LocalTemporal
}

globalThis.Float16Array ??= Float16Array
globalThis.Temporal = LocalTemporal

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

test('throw for Temporal.PlainDate custom calendar', () => {
  const calendar = new Temporal.Calendar('gregory')
  const plainDate = new Temporal.PlainDate(2000, 1, 1, calendar)
  assert.throws(
    () => valueToEstree(plainDate),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'Unsupported calendar: gregory')
      assert.equal(error.cause, calendar)
      return true
    }
  )
})

test('throw for Temporal.PlainDateTime custom calendar', () => {
  const calendar = new Temporal.Calendar('gregory')
  const plainDate = new Temporal.PlainDateTime(2000, 1, 1, 0, 0, 0, 0, 0, 0, calendar)
  assert.throws(
    () => valueToEstree(plainDate),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'Unsupported calendar: gregory')
      assert.equal(error.cause, calendar)
      return true
    }
  )
})

test('throw for Temporal.PlainMonthDay custom calendar', () => {
  const calendar = new Temporal.Calendar('gregory')
  const plainDate = new Temporal.PlainMonthDay(12, 1, calendar)
  assert.throws(
    () => valueToEstree(plainDate),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'Unsupported calendar: gregory')
      assert.equal(error.cause, calendar)
      return true
    }
  )
})

test('throw for Temporal.PlainYearMonth custom calendar', () => {
  const calendar = new Temporal.Calendar('gregory')
  const plainDate = new Temporal.PlainYearMonth(2000, 1, calendar)
  assert.throws(
    () => valueToEstree(plainDate),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'Unsupported calendar: gregory')
      assert.equal(error.cause, calendar)
      return true
    }
  )
})

test('throw for Temporal.ZonedDateTime custom calendar', () => {
  const calendar = new Temporal.Calendar('gregory')
  const plainDate = new Temporal.ZonedDateTime(0n, 'UTC', calendar)
  assert.throws(
    () => valueToEstree(plainDate),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'Unsupported calendar: gregory')
      assert.equal(error.cause, calendar)
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
