// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = new Map(),
    var1 = {}
  var0.set(var1, 42)
  var0.set(42, var1)
  return var0
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Map()
