// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = ['recursive', , ,]
  return (var0[1] = var0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
