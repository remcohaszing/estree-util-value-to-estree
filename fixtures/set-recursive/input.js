// Used as input
// { preserveReferences: true }
export default (() => {
  const $0 = new Set(['recursive'])
  return $0.add($0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
