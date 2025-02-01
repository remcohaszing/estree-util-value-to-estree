// Used as input
// { preserveReferences: true }
export default ((
  $1 = new Map(),
  $2 = new Map(),
  $0 = new Map([
    ['recursive', 'value'],
    ['key', $1],
    [$2, 'value']
  ])
) => ($1.set('key', $0), $2.set($0, 'value'), $0))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
