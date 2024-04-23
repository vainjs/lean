import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import { fileURLToPath } from 'url'
import path from 'path'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  // mimic ESLintRC-style extends
  ...compat.extends('@vainjs/eslint-config/typescript'),
]
