// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = {
    name: 'recursive'
  }
  return (var0['resursive'] = var0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
