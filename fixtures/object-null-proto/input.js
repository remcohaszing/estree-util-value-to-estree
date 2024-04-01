// Used as input
// { preserveReferences: true }
export default {
  __proto__: null,
  number: 1,
  string: 'Hello',
  nothing: null,
  [Symbol.for('key')]: 'value'
}

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = {
  __proto__: null,
  number: 1,
  string: 'Hello',
  nothing: null,
  [Symbol.for('key')]: 'value'
}
