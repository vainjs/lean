module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  plugins: ['import'],
  rules: {
    'import/order': [
      'error',
      { groups: [['builtin', 'external', 'internal']] },
    ],
    'import/no-anonymous-default-export': [
      'error',
      {
        allowLiteral: true,
        allowObject: true,
        allowArray: true,
      },
    ],
    'no-empty-function': [
      'error',
      {
        allow: ['arrowFunctions'],
      },
    ],
    'import/no-cycle': ['error', { maxDepth: '∞' }],
    'import/no-relative-packages': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-named-default': 'error',
    'import/no-self-import': 'error',
    'import/first': 'error',
    'no-console': 'warn',
  },
}
