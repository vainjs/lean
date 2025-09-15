import type { ConfigFileData } from '../type'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import os from 'os'
import { sortPackageJson } from 'sort-package-json'
import * as p from '@clack/prompts'
import merge from 'lodash.merge'
import chalk from 'chalk'
import fs from 'fs-extra'
import ejs from 'ejs'
import {
  GITHUB_ACTIONS_INITIAL_VALUES,
  CONFIG_TEMPLATES,
  PACKAGE_MANAGER,
} from '../config'

const SUFFIX = '.ejs'

export function handleCancel<T>(result: T | symbol): T {
  if (p.isCancel(result)) {
    p.cancel('Operation cancelled!')
    process.exit(0)
  }
  return result as T
}

/**
 * Check if a directory has monorepo configuration files
 */
function hasMonorepoConfig(dir: string): boolean {
  // Check for dedicated monorepo config files
  const configFiles = ['pnpm-workspace.yaml', 'lerna.json', 'rush.json']
  if (
    configFiles.some((configFile) => fs.existsSync(path.join(dir, configFile)))
  ) {
    return true
  }

  // Check for yarn workspaces in package.json
  try {
    const packageJsonPath = path.join(dir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      if (packageJson.workspaces) {
        return true
      }
    }
  } catch {
    return false
  }

  return false
}

/**
 * Check if a directory has lock files (indicating it's likely the project root)
 */
function hasLockFiles(dir: string): boolean {
  return ['pnpm-lock.yaml', 'yarn.lock', 'package-lock.json'].some((lockFile) =>
    fs.existsSync(path.join(dir, lockFile))
  )
}

export function getProjectRoot(): string {
  const homeDir = os.homedir()
  let currentDir = process.cwd()
  let fallbackDir: string | null = null

  while (currentDir !== homeDir && currentDir !== '/') {
    const hasPackageJson = fs.existsSync(path.join(currentDir, 'package.json'))
    const hasNodeModules = fs.existsSync(path.join(currentDir, 'node_modules'))

    if (hasPackageJson) {
      if (hasNodeModules && hasLockFiles(currentDir)) return currentDir
      if (hasMonorepoConfig(currentDir)) return currentDir
      // Remember first package.json directory as fallback
      if (!fallbackDir) {
        fallbackDir = currentDir
      }
    }

    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) break
    currentDir = parentDir
  }

  return fallbackDir || process.cwd()
}

function getOutputPath(templatePath: string): string {
  if (templatePath.endsWith(SUFFIX)) {
    return templatePath.slice(0, -SUFFIX.length)
  }
  return templatePath
}

async function renderSingleFile(filePath: string, variables = {}) {
  const templatePath = path.join(__dirname, 'templates', filePath)

  if (!(await fs.pathExists(templatePath))) {
    p.log.warn(`Template file not found: ${templatePath}`)
    return
  }

  const templateContent = await fs.readFile(templatePath, 'utf-8')
  const outputContent = filePath.endsWith(SUFFIX)
    ? ejs.render(templateContent, variables)
    : templateContent

  const outputPath = path.join(getProjectRoot(), getOutputPath(filePath))
  await fs.ensureDir(path.dirname(outputPath))
  await fs.writeFile(outputPath, outputContent, 'utf-8')
}

export async function renderConfigFiles(
  files: string[],
  variables: ConfigFileData['variables'] = {}
) {
  const spinner = p.spinner()
  spinner.start('Generating files')

  for (const filePath of files) {
    await renderSingleFile(filePath, variables[filePath])
  }

  spinner.stop(`Generated ${files.length} file${files.length > 1 ? 's' : ''}`)
}

export async function updatePackageJson(
  updates: Record<string, unknown>
): Promise<void> {
  const spinner = p.spinner()
  spinner.start('Updating package.json')

  const packageJsonPath = path.join(getProjectRoot(), 'package.json')
  const packageJson = await fs.readJson(packageJsonPath)
  merge(packageJson, updates)
  await fs.writeJson(packageJsonPath, sortPackageJson(packageJson), {
    spaces: 2,
  })

  spinner.stop('Updated package.json')
}

export function detectPackageManager(): 'npm' | 'yarn' | 'pnpm' {
  try {
    let currentDir = process.cwd()
    const homeDir = os.homedir()

    while (currentDir !== homeDir && currentDir !== '/') {
      if (fs.existsSync(path.join(currentDir, 'pnpm-lock.yaml'))) {
        return 'pnpm'
      }

      if (fs.existsSync(path.join(currentDir, 'yarn.lock'))) {
        return 'yarn'
      }

      if (fs.existsSync(path.join(currentDir, 'package-lock.json'))) {
        return 'npm'
      }

      const parentDir = path.dirname(currentDir)
      if (parentDir === currentDir) break
      currentDir = parentDir
    }

    return 'npm'
  } catch {
    return 'npm'
  }
}

export async function installDependencies(): Promise<void> {
  const shouldInstall = handleCancel(
    await p.confirm({
      message: `Install dependencies via ${PACKAGE_MANAGER}?`,
      initialValue: true,
    })
  )

  if (shouldInstall) {
    const spinner = p.spinner()
    try {
      spinner.start('Installing dependencies')
      await promisify(exec)(`${PACKAGE_MANAGER} install`, {
        cwd: getProjectRoot(),
      })
      spinner.stop('Installed dependencies')
    } catch {
      spinner.stop(
        chalk.yellowBright(
          `Failed to install dependencies. Run '${PACKAGE_MANAGER} install' manually`
        ),
        1
      )
    }
  } else {
    p.log.warn(
      chalk.yellowBright(
        `Skipped installation. Run '${PACKAGE_MANAGER} install' manually`
      )
    )
  }
}

export async function getGithubActions(
  configs: string[] = []
): Promise<ConfigFileData> {
  if (!configs.includes('githubActions')) return { files: [], variables: {} }

  const selectedActions = handleCancel(
    await p.multiselect({
      options: CONFIG_TEMPLATES.githubActions.options!,
      initialValues: GITHUB_ACTIONS_INITIAL_VALUES,
      message: 'Select GitHub Actions:',
      required: false,
    })
  )

  const variables: ConfigFileData['variables'] = {}

  for (const filePath of selectedActions) {
    variables[filePath] = {}
    const option = CONFIG_TEMPLATES.githubActions.options!.find(
      (opt) => opt.value === filePath
    )
    if (!option) continue
    p.log.info(`Configuring ${option.label}`)

    for (const configItem of option.config) {
      const value = handleCancel(
        await p.text({
          placeholder: `${configItem.placeholder} (default: ${configItem.value})`,
          defaultValue: configItem.value,
          message: configItem.label,
        })
      )
      variables[filePath][configItem.variable] = value
    }
  }

  return { files: selectedActions, variables }
}
