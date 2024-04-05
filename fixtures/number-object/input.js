// Used as input
// { preserveReferences: true }
export default new Number(123)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Number(123)
