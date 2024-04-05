// Used as input
// { preserveReferences: true }
export default new BigUint64Array([1n, 2n, 3n])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new BigUint64Array([1n, 2n, 3n])
