// Used as input
// { preserveReferences: true }
export default (() => {
  const $0 = new Map([['recursive', 'value']])
  return $0.set('key', $0).set($0, 'value')
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
