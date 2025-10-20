// Used as input
// { preserveReferences: true }
export default Temporal.PlainDateTime.from('2008-07-06T05:04:03.002001[u-ca=japanese]')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.PlainDateTime.from(
  '2008-07-06T05:04:03.002001[u-ca=japanese]'
)
