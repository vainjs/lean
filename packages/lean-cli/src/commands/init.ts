import type { ConfigFileData } from '../type'
import * as p from '@clack/prompts'
import merge from 'lodash.merge'
import chalk from 'chalk'
import {
  installDependencies,
  updatePackageJson,
  renderConfigFiles,
  getGithubActions,
  handleCancel,
} from '../utils'
import {
  CONFIG_TEMPLATES,
  PACKAGE_MANAGER,
  INITIAL_VALUES,
  OPTIONS,
} from '../config'

export async function initCommand() {
  console.log()
  p.intro(chalk.cyan('@vainjs/lean-cli'))

  try {
    const configs = handleCancel(
      await p.multiselect({
        message: 'Select tools:',
        initialValues: INITIAL_VALUES,
        options: OPTIONS,
        required: true,
      })
    )

    const configFileData = await getGithubActions(configs)

    const proceed = handleCancel(
      await p.confirm({
        message: 'Apply configurations?',
        initialValue: true,
      })
    )

    if (proceed) {
      await applyconfigs(configs, configFileData)
    } else {
      p.log.warn('Operation Cancelled!')
    }
  } catch (error) {
    p.log.error(chalk.red(error))
    process.exit(0)
  }
}

function getConfig(selectedConfigs: string[], configFileData: ConfigFileData) {
  let configFiles: string[] = [...configFileData.files]
  let packageUpdates = {}

  for (const type of [...selectedConfigs, PACKAGE_MANAGER]) {
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

  return { configFiles, packageUpdates }
}

async function applyconfigs(
  selectedConfigs: string[],
  configFileData: ConfigFileData
) {
  const { configFiles, packageUpdates } = getConfig(
    selectedConfigs,
    configFileData
  )
  const commonVariables = INITIAL_VALUES.reduce(
    (config, option) => ({
      ...config,
      [option]: selectedConfigs.includes(option),
    }),
    {}
  )
  await renderConfigFiles(
    configFiles,
    configFiles.reduce(
      (acc, filePath) => ({
        ...acc,
        [filePath]: {
          ...commonVariables,
          ...configFileData.variables[filePath],
        },
      }),
      {}
    )
  )
  await updatePackageJson(packageUpdates)
  await installDependencies()

  p.note('Run `lean --help` for more commands.', 'Configuration successfully!')
  console.log()
}
