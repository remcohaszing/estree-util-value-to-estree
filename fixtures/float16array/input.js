// Used as input
// { preserveReferences: true }
export default new Float16Array([1, 2, 3])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Float16Array([1, 2, 3])
