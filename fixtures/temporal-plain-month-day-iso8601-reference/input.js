// Used as input
// { preserveReferences: true }
export default new Temporal.PlainMonthDay(3, 14, 'iso8601', 2000)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.PlainMonthDay(3, 14, 'iso8601', 2000)
