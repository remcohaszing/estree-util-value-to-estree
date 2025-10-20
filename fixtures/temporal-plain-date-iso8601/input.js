// Used as input
// { preserveReferences: true }
export default Temporal.PlainDate.from('2025-01-02')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.PlainDate.from('2025-01-02')
