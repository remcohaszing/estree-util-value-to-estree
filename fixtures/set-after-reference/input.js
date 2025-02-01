// Used as input
// { preserveReferences: true }
export default (($0 = new Set(['before reference'])) => $0.add($0).add('after reference'))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
