// Used as input
// { preserveReferences: true }
export default new URLSearchParams('everything=awesome')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new URLSearchParams('everything=awesome')
