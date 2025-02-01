// Used as input
// { preserveReferences: true }
export default new Temporal.ZonedDateTime(1234567890n, 'Europe/Amsterdam', 'gregory')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.ZonedDateTime(
  1234567890n,
  'Europe/Amsterdam',
  'gregory'
)
