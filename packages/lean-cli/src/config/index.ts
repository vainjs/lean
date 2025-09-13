import type { ConfigTemplates } from '../type'

export const CONFIG_TEMPLATES: ConfigTemplates = {
  eslint: {
    pkgConfig: {
      devDependencies: {
        eslint: '^8.57.0',
        'lint-staged': '^16.1.4',
      },
      'lint-staged': {
        '*.{ts,tsx,js}': ['eslint --fix'],
      },
    },
    file: ['.husky/pre-commit', 'eslint.config.js.ejs'],
  },
  commitlint: {
    pkgConfig: {
      devDependencies: {
        '@commitlint/cli': '^19.8.1',
        '@commitlint/config-conventional': '^19.8.1',
      },
      commitlint: {
        extends: ['@commitlint/config-conventional'],
      },
    },
    file: ['.husky/commit-msg'],
  },
  husky: {
    pkgConfig: {
      devDependencies: {
        husky: '^9.1.7',
      },
      scripts: {
        prepare: 'husky',
      },
    },
  },
}
