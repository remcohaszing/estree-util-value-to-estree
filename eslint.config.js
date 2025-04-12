import config from '@remcohaszing/eslint'

export default [
  ...config,
  { ignores: ['fixtures/**'] },
  {
    rules: {
      '@typescript-eslint/no-wrapper-object-types': 'off',
      'perfectionist/sort-classes': 'off',
      'unicorn/no-instanceof-builtins': 'off'
    }
  }
]
