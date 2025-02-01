// Used as input
// { preserveReferences: true }
export default new Temporal.PlainTime(1, 2, 3, 4, 5, 6)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.PlainTime(1, 2, 3, 4, 5, 6)
