import * as p from '@clack/prompts'
import merge from 'lodash.merge'
import {
  detectPackageManager,
  installDependencies,
  updatePackageJson,
  renderConfigFiles,
  handleCancel,
} from '../utils'
import { CONFIG_TEMPLATES, INITIAL_VALUES } from '../config'

export async function initCommand() {
  try {
    const configs = handleCancel(
      await p.multiselect({
        message: 'Select additional tools.',
        options: [
          {
            label: 'TypeScript',
            value: 'typescript',
          },
          {
            label: 'ESLint + Prettier',
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
        ],
        initialValues: INITIAL_VALUES,
        required: true,
      })
    )

    const proceed = handleCancel(
      await p.confirm({
        message: `Apply selected configurations?`,
        initialValue: true,
      })
    )

    if (proceed) {
      await applyconfigs(configs)
    } else {
      p.log.warn('Operation Cancelled.')
    }
  } catch (error) {
    p.log.error(String(error))
    process.exit(0)
  }
}

async function applyconfigs(selectedConfigs: string[]) {
  const packageManager = detectPackageManager()
  let configFiles: string[] = []
  let packageUpdates = {}

  for (const type of [...selectedConfigs, packageManager]) {
    const config = CONFIG_TEMPLATES[type]
    if (!config) continue
    if (config.file) {
      configFiles = configFiles.concat(config.file || [])
    }
    if (config.pkgConfig) {
      packageUpdates = merge(packageUpdates, config.pkgConfig)
    }
  }

  if (configFiles.some((file) => file.includes('.husky'))) {
    packageUpdates = merge(packageUpdates, CONFIG_TEMPLATES['husky'].pkgConfig)
  }

  if (
    selectedConfigs.includes('typescript') &&
    selectedConfigs.includes('eslint')
  ) {
    packageUpdates = merge(
      packageUpdates,
      CONFIG_TEMPLATES['typescriptEslint'].pkgConfig
    )
  }

  await renderConfigFiles(
    configFiles,
    INITIAL_VALUES.reduce(
      (config, option) => ({
        ...config,
        [option]: selectedConfigs.includes(option),
      }),
      {}
    )
  )
  await updatePackageJson(packageUpdates)
  await installDependencies(packageManager)

  p.note(
    'Run `lean --help` for more commands.',
    'Configuration applied successfully!'
  )
}
