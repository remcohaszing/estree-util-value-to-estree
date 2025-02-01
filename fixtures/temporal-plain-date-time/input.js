// Used as input
// { preserveReferences: true }
export default new Temporal.PlainDateTime(2008, 7, 6, 5, 4, 3, 2, 1, 0, 'japanese')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Temporal.PlainDateTime(
  2008,
  7,
  6,
  5,
  4,
  3,
  2,
  1,
  0,
  'japanese'
)
