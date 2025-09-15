import * as p from '@clack/prompts'
import merge from 'lodash.merge'
import chalk from 'chalk'
import { detectPackageManager, installDependencies, updatePackageJson, renderConfigFiles } from '../utils'
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
      p.outro(chalk.yellow('Config cancelled.'))
    }
  } catch (error) {
    p.cancel(chalk.red(error))
  }
}

async function applyconfigs(selectedConfigs: string[]) {
  const spinner = p.spinner()
  spinner.start('Applying configurations...')

  try {
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

    // spinner.message('Updating package.json...')
    // await updatePackageJson(packageUpdates)

    // spinner.message('Installing dependencies...')
    // const packageManager = detectPackageManager()
    // await installDependencies(packageManager)

    spinner.stop('Configurations completed successfully!')
    p.outro(chalk.green('✓ All configurations have been applied!'))
  } catch (error) {
    p.cancel(chalk.red(error))
  }
}
