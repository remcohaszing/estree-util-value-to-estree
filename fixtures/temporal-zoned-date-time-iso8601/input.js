// Used as input
// { preserveReferences: true }
export default Temporal.ZonedDateTime.from('1970-01-01T01:00:01.23456789+01:00[Europe/Amsterdam]')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Temporal.ZonedDateTime.from(
  '1970-01-01T01:00:01.23456789+01:00[Europe/Amsterdam]'
)
