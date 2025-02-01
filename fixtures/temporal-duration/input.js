// Used as input
// { preserveReferences: true }
export default new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
