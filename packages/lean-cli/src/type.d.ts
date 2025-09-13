export type ConfigTemplate = {
  pkgConfig?: Record<string, Record<string, any>>
  file?: string[]
}

export type ConfigTemplates = {
  [key: string]: ConfigTemplate
}

export type DataItem = Record<string, any>
