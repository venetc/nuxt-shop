import antfu from '@antfu/eslint-config'

export default antfu({
  jsonc: false,
  rules: {
    'antfu/if-newline': 'off',
    'curly': ['off', 'multi', 'consistent'],
    'no-console': 'off',
    'node/prefer-global/process': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        'groups': [
          'index',
          'sibling',
          'parent',
          'internal',
          'external',
          'builtin',
          'object',
          'type',
        ],
      },
    ],
  },
})
