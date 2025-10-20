// Used as input
// { preserveReferences: true }
export default Temporal.PlainYearMonth.from('1234-04-09[u-ca=islamic-civil]')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.PlainYearMonth.from('1234-04-09[u-ca=islamic-civil]')
