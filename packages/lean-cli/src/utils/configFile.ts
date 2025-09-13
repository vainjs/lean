import type { DataItem } from '../type'
import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'
import os from 'os'
import { printError } from './util'

const SUFFIX = '.ejs'

export async function renderConfigFiles(files: string[], data: DataItem = {}) {
  try {
    for (const filePath of files) {
      await renderSingleFile(filePath, data)
    }
  } catch (error) {
    printError('Failed to render config files', error)
  }
}

async function renderSingleFile(filePath: string, data: DataItem) {
  const templatePath = path.join(__dirname, 'templates', filePath)

  if (!(await fs.pathExists(templatePath))) {
    printError(`Template file not found: ${templatePath}`)
    return
  }

  const templateContent = await fs.readFile(templatePath, 'utf-8')
  const outputContent = filePath.endsWith(SUFFIX) ? ejs.render(templateContent, data) : templateContent

  const outputPath = path.join(findProjectRoot(), getOutputPath(filePath))
  await fs.ensureDir(path.dirname(outputPath))
  await fs.writeFile(outputPath, outputContent, 'utf-8')
}

function getOutputPath(templatePath: string): string {
  if (templatePath.endsWith(SUFFIX)) {
    return templatePath.slice(0, -SUFFIX.length)
  }
  return templatePath
}

function findProjectRoot(): string {
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
