// Used as input
// { preserveReferences: true }
export default Temporal.PlainMonthDay.from('03-14')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.PlainMonthDay.from('03-14')
