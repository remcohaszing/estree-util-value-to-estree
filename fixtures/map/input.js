// Used as input
// { preserveReferences: true }
export default new Map([
  [{}, 42],
  [42, {}]
])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Map([
  [{}, 42],
  [42, {}]
])
