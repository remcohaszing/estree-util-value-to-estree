// Used as input
// { preserveReferences: true }
export default Buffer.from([1, 2, 3])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Buffer.from([1, 2, 3])
