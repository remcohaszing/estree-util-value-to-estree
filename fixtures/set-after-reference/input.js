// Used as input
// { preserveReferences: true }
export default (() => {
  const $0 = new Set(['before reference'])
  return $0.add($0).add('after reference')
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
