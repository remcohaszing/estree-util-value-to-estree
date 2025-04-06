// Used as input
// { preserveReferences: true }
export default Object.defineProperties(
  {
    string: 'Hello'
  },
  {
    ['__proto__']: {
      value: {},
      configurable: true
    },
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
    },
    [Symbol.for('global')]: {
      value: {}
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
    ['__proto__']: {
      value: {},
      configurable: true
    },
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
    },
    [Symbol.for('global')]: {
      value: {}
    }
  }
)
