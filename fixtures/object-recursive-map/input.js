// Used as input
// { preserveReferences: true }
export default ((
  $2 = {
    name: '$2'
  },
  $3 = {
    name: '$3'
  },
  $0 = {
    name: '$0'
  },
  $1 = new Map()
) => (
  ($0['map'] = $3['map'] = $2['map'] = $1.set($1, $1).set($2, $2).set($3, $3).set($0, $0)),
  ($0['recursive'] = $0)
))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
