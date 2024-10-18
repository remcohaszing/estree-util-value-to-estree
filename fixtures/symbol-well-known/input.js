// Used as input
// { preserveReferences: true }
export default [
  Symbol.asyncDispose,
  Symbol.asyncIterator,
  Symbol.dispose,
  Symbol.hasInstance,
  Symbol.isConcatSpreadable,
  Symbol.iterator,
  Symbol.match,
  Symbol.matchAll,
  Symbol.replace,
  Symbol.search,
  Symbol.species,
  Symbol.split,
  Symbol.toPrimitive,
  Symbol.toStringTag,
  Symbol.unscopables
]

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = [
  Symbol.asyncDispose,
  Symbol.asyncIterator,
  Symbol.dispose,
  Symbol.hasInstance,
  Symbol.isConcatSpreadable,
  Symbol.iterator,
  Symbol.match,
  Symbol.matchAll,
  Symbol.replace,
  Symbol.search,
  Symbol.species,
  Symbol.split,
  Symbol.toPrimitive,
  Symbol.toStringTag,
  Symbol.unscopables
]
