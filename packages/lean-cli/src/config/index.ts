import type { ConfigTemplates } from '../type'
import { detectPackageManager } from '../utils'

export const PACKAGE_MANAGER = detectPackageManager()

export const CONFIG_TEMPLATES: ConfigTemplates = {
  pnpm: {
    pkgConfig: {
      scripts: {
        preinstall: 'npx only-allow pnpm',
      },
      packageManager: 'pnpm@10.0.0',
    },
  },
  eslint: {
    pkgConfig: {
      devDependencies: {
        '@vainjs/eslint-config': 'latest',
        eslint: '^9.32.0',
        'lint-staged': '^16.1.4',
        typescript: '^5.3.3',
        prettier: '^3.6.2',
      },
      'lint-staged': {
        '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
      },
    },
    file: ['.husky/pre-commit', 'eslint.config.mjs.ejs', '.prettierrc.ejs'],
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
    options: [
      {
        label: 'NPM Publish',
        value: '.github/workflows/npm-publish.yml.ejs',
        config: [
          {
            placeholder: 'The command to build your project',
            variable: 'buildCommand',
            label: 'Build Command',
            value: 'build',
          },
        ],
      },
      {
        label: 'Deploy Docs',
        value: '.github/workflows/deploy-docs.yml.ejs',
        config: [
          {
            placeholder: 'The command to build your project',
            variable: 'buildCommand',
            label: 'Build Command',
            value: 'docs:build',
          },
          {
            placeholder: 'Output path for built documentation assets',
            variable: 'assetsPath',
            label: 'Assets Path',
            value: 'docs/.vitepress/dist',
          },
        ],
      },
    ],
  },
}

export const OPTIONS = [
  {
    label: 'ESLint(Prettier)',
    value: 'eslint',
  },
  {
    label: 'CommitLint',
    value: 'commitlint',
  },
  {
    label: 'Changelog',
    value: 'changelog',
  },
  {
    label: 'GitHub Actions',
    value: 'githubActions',
  },
]

export const INITIAL_VALUES = OPTIONS.map((option) => option.value)

export const GITHUB_ACTIONS_INITIAL_VALUES = [
  CONFIG_TEMPLATES.githubActions.options![0].value,
]
