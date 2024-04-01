// Used as input
// { preserveReferences: true }
export default new Uint8Array([1, 2, 3])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Uint8Array([1, 2, 3])
