import chalk from 'chalk'

export function print(message: string): void {
  console.log()
  console.log(message)
  console.log()
}

export function printError(message: string, error?: unknown): void {
  console.log()
  if (error) {
    console.error(chalk.red(message), error)
  } else {
    console.error(chalk.red(message))
  }
  process.exit(1)
}
