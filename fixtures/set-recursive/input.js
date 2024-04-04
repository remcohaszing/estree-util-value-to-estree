// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = new Set(['recursive'])
  return var0.add(var0)
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
