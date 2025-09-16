import type { DataItem } from '../type'
import sortPackageJson from 'sort-package-json'
import { execSync } from 'child_process'
import merge from 'lodash.merge'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'
import os from 'os'
import * as p from '@clack/prompts'

const SUFFIX = '.ejs'

/**
 * Check if a directory has monorepo configuration files
 */
function hasMonorepoConfig(dir: string): boolean {
  // Check for dedicated monorepo config files
  const configFiles = ['pnpm-workspace.yaml', 'lerna.json', 'rush.json']
  if (configFiles.some((configFile) => fs.existsSync(path.join(dir, configFile)))) {
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
  } catch (error) {}

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

async function renderSingleFile(filePath: string, data: DataItem) {
  const templatePath = path.join(__dirname, 'templates', filePath)

  if (!(await fs.pathExists(templatePath))) {
    p.note(`Template file not found: ${templatePath}`)
    return
  }

  const templateContent = await fs.readFile(templatePath, 'utf-8')
  const outputContent = filePath.endsWith(SUFFIX) ? ejs.render(templateContent, data) : templateContent

  const outputPath = path.join(getProjectRoot(), getOutputPath(filePath))
  await fs.ensureDir(path.dirname(outputPath))
  await fs.writeFile(outputPath, outputContent, 'utf-8')
}

export async function renderConfigFiles(files: string[], data: DataItem = {}) {
  const spinner = p.spinner()
  spinner.start('Generating configuration files')

  for (const filePath of files) {
    await renderSingleFile(filePath, data)
  }

  spinner.stop(`Generated ${files.length} configuration file${files.length > 1 ? 's' : ''}`)
}

export async function updatePackageJson(updates: Record<string, any>): Promise<void> {
  const spinner = p.spinner()
  spinner.start('Updating package.json')

  const packageJsonPath = path.join(getProjectRoot(), 'package.json')
  const packageJson = await fs.readJson(packageJsonPath)
  merge(packageJson, updates)
  await fs.writeJson(packageJsonPath, sortPackageJson(packageJson), { spaces: 2 })

  spinner.stop('Updated package.json')
}

function detectPackageManager(): 'npm' | 'yarn' | 'pnpm' {
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
  const spinner = p.spinner()
  const packageManager = detectPackageManager()
  spinner.start(`Installing dependencies via ${packageManager}`)
  execSync(`${packageManager} install`, { stdio: 'ignore', cwd: getProjectRoot() })
  spinner.stop(`Installed dependencies via ${packageManager}`)
}
