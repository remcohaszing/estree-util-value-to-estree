// Used as input
// { preserveReferences: true }
export default Object.defineProperties(
  {
    string: 'Hello'
  },
  {
    configurable: {
      value: 'Only configurable',
      configurable: true
    },
    enumerable: {
      value: 'Only enumerable',
      enumerable: true
    },
    writable: {
      value: 'Only writable',
      writable: true
    }
  }
)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Object.defineProperties(
  {
    string: 'Hello'
  },
  {
    configurable: {
      value: 'Only configurable',
      configurable: true
    },
    enumerable: {
      value: 'Only enumerable',
      enumerable: true
    },
    writable: {
      value: 'Only writable',
      writable: true
    }
  }
)
