// Used as input
// { preserveReferences: true }
export default (() => {
  const $0 = new Date(3)
  return [1, 'Hello', null, new Date(1), new Date(2), $0, $0]
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = [
  1,
  'Hello',
  null,
  new Date(1),
  new Date(2),
  new Date(3),
  new Date(3)
]
