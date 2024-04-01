// Used as input
// { preserveReferences: true }
export default new Uint8ClampedArray([1, 2, 3])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Uint8ClampedArray([1, 2, 3])
