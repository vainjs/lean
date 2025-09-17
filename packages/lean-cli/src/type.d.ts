export type ConfigTemplate = {
  pkgConfig?: Record<string, Record<string, any> | string>
  file?: string[]
}

export type ConfigTemplates = {
  [key: string]: ConfigTemplate
}

export type DataItem = Record<string, any>
