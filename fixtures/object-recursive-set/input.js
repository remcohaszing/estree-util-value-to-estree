// Used as input
// { preserveReferences: true }
export default (() => {
  const $2 = {
      name: '$2'
    },
    $3 = {
      name: '$3'
    },
    $0 = {
      name: '$0'
    },
    $1 = new Set()
  return (
    ($0['set'] = $3['set'] = $2['set'] = $1.add($1).add($2).add($3).add($0)), ($0['recursive'] = $0)
  )
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
