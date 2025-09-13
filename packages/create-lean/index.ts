#!/usr/bin/env node
/* eslint-disable no-console */

import * as path from 'node:path'
import * as fs from 'node:fs'
import { getPrompts, renderTemplate, PromptsResult } from './utils'

const dirname = path.resolve(__dirname, '../')

async function init() {
  const result = (await getPrompts()) as PromptsResult
  const {
    needsCommitList,
    needsPrettier,
    projectName,
    projectType,
    needsEslint,
  } = result
  const src = path.join(process.cwd(), projectName)

  if (fs.existsSync(src)) {
    //
  } else {
    fs.mkdirSync(src)
  }

  console.log(`\n正在初始化项目 ${src}...`)

  const templateRoot = path.resolve(dirname, 'templates')
  const render = (type: string) => {
    renderTemplate(path.join(templateRoot, type), src, result)
  }
  render(projectType)

  if (needsPrettier) {
    render('prettier')
  }

  if (needsEslint) {
    render('eslint')
  }

  if (needsCommitList) {
    render('commitlint')
  }
}

init().catch((e) => {
  console.error(e)
})
