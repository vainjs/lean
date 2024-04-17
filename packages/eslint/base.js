module.exports = {
  extends: ['eslint-config-airbnb-base'],
  rules: {
    'prefer-destructuring': [
      'error',
      {
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    'import/extensions': 'off',
    'no-return-await': 'off',
  },
}
