// Used as input
// { preserveReferences: true }
export default Temporal.PlainYearMonth.from('1234-05')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.PlainYearMonth.from('1234-05')
