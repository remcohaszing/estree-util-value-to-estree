// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = {
    name: 'recursive'
  }
  var0['resursive'] = var0
  return var0
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
