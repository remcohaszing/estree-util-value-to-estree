// Used as input
// { preserveReferences: true }
export default new Temporal.PlainTime(1, 2, 3)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.PlainTime(1, 2, 3)
