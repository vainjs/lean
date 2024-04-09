#!/usr/bin/env node
/* eslint-disable no-console */

import { red } from 'kolorist'
import * as path from 'node:path'
import * as fs from 'node:fs'
// import ejs from 'ejs'
import { getPrompts } from './utils'

type PromptsResult = {
  needsTypeScript?: boolean
  needsPrettier?: boolean
  needsEslint?: boolean
  projectName: string
}

async function init() {
  const result = (await getPrompts()) as PromptsResult
  const { projectName, needsTypeScript, needsEslint, needsPrettier } = result
  const src = path.join(process.cwd(), projectName)

  if (fs.existsSync(src)) {
    //
  } else {
    fs.mkdirSync(src)
  }

  console.log(`\n正在初始化项目 ${src}...`)

  const pkg = { name: projectName, version: '0.0.0' }
  fs.writeFileSync(
    path.resolve(src, 'package.json'),
    JSON.stringify(pkg, null, 2)
  )
}

init().catch((e) => {
  console.error(e)
})
