// Used as input
// { preserveReferences: true }
export default (() => {
  const var1 = new Map(),
    var2 = new Map(),
    var0 = new Map([
      ['recursive', 'value'],
      ['key', var1],
      [var2, 'value']
    ])
  return var1.set('key', var0), var2.set(var0, 'value'), var0
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
