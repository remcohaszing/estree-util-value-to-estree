// Used as input
// { preserveReferences: true }
export default Temporal.Duration.from('P1Y2M3W4DT5H6M7.00800901S')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.Duration.from('P1Y2M3W4DT5H6M7.00800901S')
