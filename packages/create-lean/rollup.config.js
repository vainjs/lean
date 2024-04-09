import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import clear from 'rollup-plugin-clear'
import path from 'node:path'
import pkg from './package.json' assert { type: 'json' }

const cjsDir = path.parse(pkg.main).dir

export default [
  {
    input: 'index.ts',
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
  },
]
