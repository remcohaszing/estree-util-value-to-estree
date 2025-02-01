// Used as input
// { preserveReferences: true }
export default new Temporal.Instant(1234567890123456789n)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.Instant(1234567890123456789n)
