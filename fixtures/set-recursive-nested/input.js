// Used as input
// { preserveReferences: true }
export default (($1 = new Set(['variable 1']), $0 = new Set(['variable 0', $1])) => (
  $1.add($0),
  $0
))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
