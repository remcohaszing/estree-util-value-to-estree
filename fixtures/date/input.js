// Used as input
// { preserveReferences: true }
export default new Date(1234567890123)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Date(1234567890123)
