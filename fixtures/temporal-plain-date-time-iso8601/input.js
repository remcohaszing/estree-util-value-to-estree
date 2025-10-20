// Used as input
// { preserveReferences: true }
export default Temporal.PlainDateTime.from('2009-08-07T06:05:04.003002001')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.PlainDateTime.from('2009-08-07T06:05:04.003002001')
