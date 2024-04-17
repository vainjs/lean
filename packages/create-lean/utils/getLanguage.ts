/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as path from 'node:path'

type LanguageItem = {
  message: string
  hint?: string
}

type Language = {
  needsTypeScript: LanguageItem
  needsCommitList: LanguageItem
  needsPrettier: LanguageItem
  needsEslint: LanguageItem
  projectName: LanguageItem
  projectType: LanguageItem
  errors: {
    operationCancelled: string
  }
  defaultToggleOptions: {
    active: string
    inactive: string
  }
}

function getLocale() {
  const shellLocale =
    process.env.LC_ALL ||
    process.env.LC_MESSAGES ||
    process.env.LANG ||
    Intl.DateTimeFormat().resolvedOptions().locale ||
    'en-US'
  let locale = shellLocale.split('.')[0].replace('_', '-')

  try {
    // @ts-ignore
    locale = Intl.getCanonicalLocales(locale)[0]
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(`${error.toString()}\n`)
  }

  return ['zh-TW', 'zh-HK', 'zh-MO', 'zh-CN', 'zh-SG'].includes(locale)
    ? 'zh-CN'
    : 'en-US'
}

export function getLanguage() {
  const locale = getLocale()
  const filePath = path.resolve(__dirname, '../locales', `${locale}.json`)
  return require(filePath) as Language
}
