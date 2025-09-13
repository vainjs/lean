import merge from 'lodash.merge'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import {
  detectPackageManager,
  installDependencies,
  updatePackageJson,
  renderConfigFiles,
  printError,
  print,
} from '../utils'
import { CONFIG_TEMPLATES } from '../config'

type ConfigChoice = {
  checked: boolean
  value: string
  name: string
}

export async function initCommand() {
  print(chalk.bold('Welcome to Lean CLI! 👋'))
  try {
    const choices: ConfigChoice[] = [
      {
        name: 'ESLint',
        value: 'eslint',
        checked: true,
      },
      {
        name: 'Commitlint',
        value: 'commitlint',
        checked: true,
      },
    ]

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'configs',
        message: 'Select the configs:',
        choices,
        validate: (input: string[]) => {
          if (input.length === 0) {
            return chalk.red('Please select at least one config.')
          }
          return true
        },
      },
    ])

    const size = answers.configs.length
    if (size <= 0) return

    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `Apply ${size} config${size > 1 ? 's' : ''}?`,
        default: true,
      },
    ])

    if (confirm.proceed) {
      await applyconfigs(answers.configs)
    } else {
      print(chalk.yellow('config cancelled.'))
    }
  } catch (error) {
    printError('Error during config', error)
  }
}

async function applyconfigs(selectedConfigs: string[]) {
  const spinner = ora('Applying configs...').start()

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
      spinner.text = `Applying ${type} config...`
    }

    // spinner.text = 'Updating package.json...'
    // await updatePackageJson(packageUpdates)

    // spinner.text = 'Installing dependencies...'
    // const packageManager = detectPackageManager()
    // await installDependencies(packageManager)

    spinner.text = 'Generate config files...'
    await renderConfigFiles(configFiles)

    spinner.succeed(chalk.green('config completed successfully!'))
  } catch (error) {
    printError('Apply config failed', error)
  }
}
