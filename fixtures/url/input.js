// Used as input
// { preserveReferences: true }
export default new URL('https://example.com/')

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = new URL('https://example.com/')
