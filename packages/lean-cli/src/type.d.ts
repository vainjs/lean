import type { Option } from '@clack/prompts'

export type GitHubActionOption = Option<string>

export type ConfigTemplate = {
  pkgConfig?: Record<string, Record<string, unknown> | string>
  options?: Array<GitHubActionOption>
  file?: string[]
}

export type ConfigTemplates = {
  [key: string]: ConfigTemplate
}

export type ConfigFileData = {
  variables: Record<string, Record<string, string>>
  files: string[]
}
