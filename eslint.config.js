import antfu from '@antfu/eslint-config'

export default antfu({
  jsonc: false,
  rules: {
    'antfu/if-newline': 'off',
    'curly': ['off', 'multi', 'consistent'],
    'no-console': 'off',
    'node/prefer-global/process': 'off',
    'ts/prefer-ts-expect-error': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/max-attributes-per-line': ['warn', {
      singleline: 1,
      multiline: 1,
    }],
    'vue/first-attribute-linebreak': ['warn', {
      singleline: 'ignore',
      multiline: 'beside',
    }],
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
