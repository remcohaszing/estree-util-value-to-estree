// Used as input
// { preserveReferences: true }
export default Temporal.Instant.from('2009-02-13T23:31:30.123456789Z')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.Instant.from('2009-02-13T23:31:30.123456789Z')
