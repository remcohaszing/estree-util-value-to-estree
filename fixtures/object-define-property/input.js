// Used as input
// { preserveReferences: true }
export default Object.defineProperty(
  {
    string: 'Hello',
    ['__proto__']: {}
  },
  Symbol.for('global'),
  {
    value: ''
  }
)

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = Object.defineProperty(
  {
    string: 'Hello',
    ['__proto__']: {}
  },
  Symbol.for('global'),
  {
    value: ''
  }
)
