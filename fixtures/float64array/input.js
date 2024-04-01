// Used as input
// { preserveReferences: true }
export default new Float64Array([1, 2, 3])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Float64Array([1, 2, 3])
