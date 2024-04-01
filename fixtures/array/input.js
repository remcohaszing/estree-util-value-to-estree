// Used as input
// { preserveReferences: true }
export default (() => {
  const var0 = [1, '2', , , ,],
    var1 = {}
  var0[3] = var1
  return var0
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = [1, '2', , {}, ,]
