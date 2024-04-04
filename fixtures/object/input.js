// Used as input
// { preserveReferences: true }
export default {
  number: 1,
  string: 'Hello',
  nothing: null,
  'new Date(1)': new Date(1),
  'new Date(2)': new Date(2),
  [Symbol.for('key')]: 'value'
}

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = {
  number: 1,
  string: 'Hello',
  nothing: null,
  'new Date(1)': new Date(1),
  'new Date(2)': new Date(2),
  [Symbol.for('key')]: 'value'
}
