// Used as input
// { preserveReferences: true }
export default ((
  $1 = {},
  $0 = {
    string: 'Hello'
  }
) =>
  ($0['assignment'] = Object.defineProperties($0, {
    ['__proto__']: {
      value: $0,
      configurable: true,
      enumerable: true,
      writable: true
    },
    configurable: {
      value: $0,
      configurable: true
    },
    enumerable: {
      value: $1,
      enumerable: true
    },
    writable: {
      value: $1,
      writable: true
    },
    [Symbol.for('global')]: {
      value: {}
    }
  })))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
// Recursive references are not supported without preserveReferences
