// Used as input
// { preserveReferences: true }
export default Symbol.for('global')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Symbol.for('global')
