// Used as input
// { preserveReferences: true }
export default (() => {
  const $0 = {
      name: 'variable 0'
    },
    $2 = {
      name: 'variable 2'
    },
    $1 = {
      name: 'variable 1',
      $0: $0,
      $2: $2
    }
  return {
    name: 'variable 2',
    $0: $0,
    $1: $1,
    var1: $1,
    variable1: $1,
    $2: $2
  }
})()

// -------------------------------------------------------------------------------------------------

// Default output
// { preserveReferences: false }
const withoutPreserveReferences = {
  name: 'variable 2',
  $0: {
    name: 'variable 0'
  },
  $1: {
    name: 'variable 1',
    $0: {
      name: 'variable 0'
    },
    $2: {
      name: 'variable 2'
    }
  },
  var1: {
    name: 'variable 1',
    $0: {
      name: 'variable 0'
    },
    $2: {
      name: 'variable 2'
    }
  },
  variable1: {
    name: 'variable 1',
    $0: {
      name: 'variable 0'
    },
    $2: {
      name: 'variable 2'
    }
  },
  $2: {
    name: 'variable 2'
  }
}
