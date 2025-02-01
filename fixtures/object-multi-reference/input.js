// Used as input
// { preserveReferences: true }
export default (($0 = new Date(3)) => ({
  number: 1,
  string: 'Hello',
  nothing: null,
  'new Date(1)': new Date(1),
  'new Date(2)': new Date(2),
  'new Date(3)': $0,
  'also new Date(3)': $0,
  [Symbol.for('key')]: 'value'
}))()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = {
  number: 1,
  string: 'Hello',
  nothing: null,
  'new Date(1)': new Date(1),
  'new Date(2)': new Date(2),
  'new Date(3)': new Date(3),
  'also new Date(3)': new Date(3),
  [Symbol.for('key')]: 'value'
}
