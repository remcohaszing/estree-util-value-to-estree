// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = {
      name: 'var0'
    },
    var1 = {
      name: 'var1'
    }
  var1['var0'] = var0
  var0['var1'] = var1
  return var0
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
