import { define } from '@remcohaszing/eslint'

export default define([
  { ignores: ['fixtures/**'] },
  {
    rules: {
      '@typescript-eslint/no-wrapper-object-types': 'off',
      'unicorn/no-instanceof-builtins': 'off'
    }
  }
])
