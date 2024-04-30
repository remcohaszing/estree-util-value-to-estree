// Used as input
// { preserveReferences: true }
export default (() => {
  const $0 = {
    name: 'recursive'
  }
  return ($0['recursive'] = $0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
