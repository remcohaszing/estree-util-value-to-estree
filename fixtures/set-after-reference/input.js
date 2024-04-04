// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = new Set(['before reference'])
  return var0.add(var0).add('after reference')
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
