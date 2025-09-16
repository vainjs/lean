import * as p from '@clack/prompts'
import merge from 'lodash.merge'
import { installDependencies, updatePackageJson, renderConfigFiles } from '../utils'
import { CONFIG_TEMPLATES } from '../config'

function handleCancel<T>(result: T | symbol): T {
  if (p.isCancel(result)) {
    p.cancel('Operation cancelled.')
    process.exit(0)
  }
  return result as T
}

export async function initCommand() {
  try {
    const configs = handleCancel(
      await p.multiselect({
        message: 'Which configurations would you like to set up for your project?',
        options: [
          {
            label: 'ESLint',
            value: 'eslint',
          },
          {
            label: 'Commitlint',
            value: 'commitlint',
          },
        ],
        initialValues: ['eslint', 'commitlint'],
        required: true,
      })
    )

    const proceed = handleCancel(
      await p.confirm({
        message: `Ready to apply the configurations selected above? This will modify your project files.`,
        initialValue: true,
      })
    )

    if (proceed) {
      await applyconfigs(configs)
    } else {
      p.log.warn('Config cancelled.')
    }
  } catch (error) {
    p.log.error(String(error))
  }
}

async function applyconfigs(selectedConfigs: string[]) {
  let configFiles: string[] = []
  let packageUpdates = {}

  for (const type of selectedConfigs) {
    const config = CONFIG_TEMPLATES[type]
    if (!config) continue
    if (config.file) {
      configFiles = configFiles.concat(config.file || [])
    }
    if (config.pkgConfig) {
      packageUpdates = merge(packageUpdates, config.pkgConfig)
    }
  }

  await renderConfigFiles(configFiles)
  await updatePackageJson(packageUpdates)
  await installDependencies()

  p.log.success('All configurations have been applied')
  p.outro('Run `lean help` to get started.')
}
