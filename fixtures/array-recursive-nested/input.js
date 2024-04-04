// Used as input
// { preserveReferences: true }
export default (() => {
  const var1 = ['var1', ,],
    var0 = ['var0', var1]
  return (var1[1] = var0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
