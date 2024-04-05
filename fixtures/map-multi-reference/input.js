// Used as input
// { preserveReferences: true }
export default (() => {
  const $0 = {},
    $1 = {}
  return new Map([
    ['key', {}],
    [{}, 'value'],
    [$0, 42],
    [42, $0],
    [$1, $1]
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
