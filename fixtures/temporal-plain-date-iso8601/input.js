// Used as input
// { preserveReferences: true }
export default new Temporal.PlainDate(2025, 1, 2)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.PlainDate(2025, 1, 2)
