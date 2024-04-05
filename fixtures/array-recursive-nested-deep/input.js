// Used as input
// { preserveReferences: true }
export default (() => {
  const $1 = ['variable 1', , ,],
    $0 = ['variable 0', ['variable 2', $1]]
  return ($1[1] = $0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
