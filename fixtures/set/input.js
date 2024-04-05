// Used as input
// { preserveReferences: true }
export default new Set([42, 'not 42', new Set()])

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new Set([42, 'not 42', new Set()])
