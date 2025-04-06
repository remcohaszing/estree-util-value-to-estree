// Used as input
// { preserveReferences: true }
export default ((
  $1 = {
    name: '$1'
  },
  $0 = {
    ['__proto__']: $1,
    name: '$0'
  }
) => (
  Object.defineProperty($1, '__proto__', {
    value: $0,
    configurable: true,
    enumerable: true,
    writable: true
  }),
  $0
))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
