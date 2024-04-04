// Used as input
// { preserveReferences: true }
export default (() => {
  const var1 = new Set(['var1']),
    var0 = new Set(['var0', var1])
  return var1.add(var0), var0
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
