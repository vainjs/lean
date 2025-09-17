import type { ConfigTemplates } from '../type'

export const CONFIG_TEMPLATES: ConfigTemplates = {
  pnpm: {
    pkgConfig: {
      scripts: {
        preinstall: 'npx only-allow pnpm',
      },
    },
  },
  typescript: {
    pkgConfig: {
      devDependencies: {
        typescript: '^5.3.3',
      },
    },
  },
  eslint: {
    pkgConfig: {
      devDependencies: {
        eslint: '^9.32.0',
        'eslint-config-prettier': '^10.1.8',
        'eslint-plugin-prettier': '^5.5.3',
        'lint-staged': '^16.1.4',
        prettier: '^3.6.2',
      },
      'lint-staged': {
        '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
      },
    },
    file: ['.husky/pre-commit', 'eslint.config.js.ejs', '.prettierrc.ejs'],
  },
  typescriptEslint: {
    pkgConfig: {
      devDependencies: {
        'typescript-eslint': '^8.39.0',
      },
    },
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
  changelog: {
    pkgConfig: {
      devDependencies: {
        'conventional-changelog-cli': '^5.0.0',
      },
      scripts: {
        changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s',
      },
    },
  },
  githubActions: {
    file: ['.github/workflows/npm-publish.yml.ejs'],
  },
}

export const INITIAL_VALUES = [
  'eslint',
  'typescript',
  'commitlint',
  'changelog',
  'githubActions',
]
