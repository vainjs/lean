import { defineConfig } from 'rolldown'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    banner: '#!/usr/bin/env node',
    file: 'dist/index.js',
    format: 'cjs',
  },
  platform: 'node',
  external: (id) => {
    return !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0')
  },
  plugins: [
    copy({
      targets: [{ src: 'src/templates', dest: 'dist' }],
    }),
  ],
})
