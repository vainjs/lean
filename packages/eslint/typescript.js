module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['./index'].map(require.resolve),
}
