// Used as input
// { preserveReferences: true }
export default new String('Hello string')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new String('Hello string')
