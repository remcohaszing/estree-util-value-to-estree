// Used as input
// { preserveReferences: true }
export default new Int16Array([1, 2, 3])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Int16Array([1, 2, 3])
