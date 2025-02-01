// Used as input
// { preserveReferences: true }
export default (($1 = ['variable 1'], $0 = ['variable 0', $1]) => ($1[1] = $0))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
