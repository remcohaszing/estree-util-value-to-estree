// Used as input
// { preserveReferences: true }
export default Temporal.PlainTime.from('01:02:03.004005006')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.PlainTime.from('01:02:03.004005006')
