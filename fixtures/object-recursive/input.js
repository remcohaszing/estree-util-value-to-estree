// Used as input
// { preserveReferences: true }
export default ((
  $0 = {
    name: 'recursive'
  }
) => ($0['recursive'] = $0))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
