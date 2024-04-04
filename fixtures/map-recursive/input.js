// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = new Map([['recursive', 'value']])
  return var0.set('key', var0).set(var0, 'value')
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
