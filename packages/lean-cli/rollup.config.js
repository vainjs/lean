import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import { fileURLToPath } from 'node:url'
import clear from 'rollup-plugin-clear'
import { globSync } from 'glob'
import path from 'node:path'
import pkg from './package.json' assert { type: 'json' }

const external = Object.keys(pkg.peerDependencies)
const cjsDir = path.parse(pkg.main).dir
const entries = Object.fromEntries(
  globSync('**/*.ts', { ignore: '**/__tests__/**' }).map((file) => [
    path.relative(
      'packages',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url)),
  ])
)

export default [
  {
    input: entries,
    output: [
      {
        format: 'cjs',
        dir: cjsDir,
        entryFileNames: '[name].cjs',
      },
    ],
    plugins: [
      clear({
        targets: [cjsDir],
      }),
      typescript({ compilerOptions: { declaration: false } }),
      process.env.NODE_ENV === 'production' && terser(),
    ],
    external,
  },
]
