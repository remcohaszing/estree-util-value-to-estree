// Used as input
// { preserveReferences: true }
export default (() => {
  const $0 = ['recursive', , ,]
  return ($0[1] = $0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
