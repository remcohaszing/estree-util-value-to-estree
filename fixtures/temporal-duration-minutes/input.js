// Used as input
// { preserveReferences: true }
export default Temporal.Duration.from('P1Y2M3W4DT5H6M')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.Duration.from('P1Y2M3W4DT5H6M')
