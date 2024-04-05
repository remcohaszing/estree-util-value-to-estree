// Used as input
// { preserveReferences: true }
export default (() => {
  const $1 = {
      name: 'variable 1'
    },
    $0 = {
      name: 'variable 0',
      $2: {
        name: 'variable 2',
        $1: $1
      }
    }
  return ($1['variable 0'] = $0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
