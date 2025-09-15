import { readFileSync } from 'fs'
import { join } from 'path'
import { Command } from 'commander'
import { initCommand } from './commands/init'

const getVersion = () => {
  try {
    const packageJsonPath = join(__dirname, '../package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    return packageJson.version
  } catch {
    return '0.0.0'
  }
}

const program = new Command()

program
  .name('lean')
  .description('A lean development tool for front-end')
  .version(getVersion())

program
  .command('init')
  .description('Initialize development configurations')
  .action(initCommand)

program.parse()
