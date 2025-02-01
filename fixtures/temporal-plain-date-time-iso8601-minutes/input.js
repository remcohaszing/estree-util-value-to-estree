// Used as input
// { preserveReferences: true }
export default new Temporal.PlainDateTime(2009, 8, 7, 6, 5)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.PlainDateTime(2009, 8, 7, 6, 5)
