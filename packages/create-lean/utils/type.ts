export type DataSource = Record<string, any>

export type PromptsResult = {
  needsTypeScript?: boolean
  needsCommitList?: boolean
  needsPrettier?: boolean
  needsEslint?: boolean
  projectName: string
  projectType: string
}
