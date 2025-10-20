// Used as input
// { preserveReferences: true }
export default Temporal.PlainMonthDay.from('1972-03-14[u-ca=japanese]')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.PlainMonthDay.from('1972-03-14[u-ca=japanese]')
