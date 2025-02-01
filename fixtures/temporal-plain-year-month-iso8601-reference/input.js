// Used as input
// { preserveReferences: true }
export default new Temporal.PlainYearMonth(1234, 5, 'iso8601', 6)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.PlainYearMonth(1234, 5, 'iso8601', 6)
