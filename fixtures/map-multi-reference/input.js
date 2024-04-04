// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = {},
    var1 = {}
  return new Map([
    ['key', {}],
    [{}, 'value'],
    [var0, 42],
    [42, var0],
    [var1, var1]
  ])
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Map([
  ['key', {}],
  [{}, 'value'],
  [{}, 42],
  [42, {}],
  [{}, {}]
])
