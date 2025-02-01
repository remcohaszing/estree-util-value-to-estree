// Used as input
// { preserveReferences: true }
export default (($0 = new Set(['recursive'])) => $0.add($0))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
