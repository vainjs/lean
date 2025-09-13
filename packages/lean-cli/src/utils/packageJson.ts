import sortPackageJson from 'sort-package-json'
import { execSync } from 'child_process'
import merge from 'lodash.merge'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import { print, printError } from './util'

export async function updatePackageJson(updates: Record<string, any>): Promise<void> {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  if (!(await fs.pathExists(packageJsonPath))) {
    printError('package.json not found in current directory')
  }

  const packageJson = await fs.readJson(packageJsonPath)
  merge(packageJson, updates)
  await fs.writeJson(packageJsonPath, sortPackageJson(packageJson), { spaces: 2 })
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

export async function installDependencies(packageManager: 'npm' | 'yarn' | 'pnpm'): Promise<void> {
  try {
    print(`Installing dependencies using ${packageManager}...`)
    const installCommand = `${packageManager} install`
    execSync(installCommand, { stdio: 'inherit' })
  } catch (error) {
    printError(`Failed to install dependencies using ${packageManager}`, error)
  }
}
