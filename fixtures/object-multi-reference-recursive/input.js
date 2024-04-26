// Used as input
// { preserveReferences: true }
export default (() => {
  const $1 = {
      name: '$1'
    },
    $2 = {
      name: '$2',
      '$1.1': $1,
      '$1.2': $1
    },
    $0 = {
      name: '$0',
      '$1.1': $1,
      '$1.2': $1,
      '$2.1': $2,
      '$2.2': $2
    }
  return (
    ($1['$1.2'] = $1['$1.1'] = $1),
    ($2['$2.2'] = $2['$2.1'] = $1['$2.2'] = $1['$2.1'] = $2),
    ($0['$0.2'] = $0['$0.1'] = $2['$0.2'] = $2['$0.1'] = $1['$0.2'] = $1['$0.1'] = $0)
  )
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported witout preserveReferences
