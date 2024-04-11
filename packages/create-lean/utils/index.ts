/* eslint-disable no-console */
import { red } from 'kolorist'
import prompts from 'prompts'
import * as path from 'node:path'
import * as fs from 'node:fs'
import ejs from 'ejs'
import { merge } from 'lodash-es'

type DataSource = Record<string, any>

export type PromptsResult = {
  needsTypeScript?: boolean
  needsCommitList?: boolean
  needsPrettier?: boolean
  needsEslint?: boolean
  projectName: string
  projectType: string
}

function throwError(message: string) {
  throw new Error(`${red('✖')} ${message}`)
}

export async function getPrompts() {
  const defaultProjectName = 'lean-project'
  try {
    return await prompts(
      [
        {
          name: 'projectName',
          type: 'text',
          message: '请输入项目名称：',
          initial: defaultProjectName,
          onState: (state) => String(state.value).trim() || defaultProjectName,
        },
        {
          name: 'projectType',
          type: 'select',
          message: '请选择项目类型',
          initial: 0,
          choices: () => [
            {
              title: 'React',
              value: 'react',
            },
            {
              title: 'NPM',
              value: 'npm',
            },
          ],
        },
        {
          name: 'needsTypeScript',
          type: 'toggle',
          message: '是否使用 TypeScript 语法？',
          initial: true,
        },
        {
          name: 'needsEslint',
          type: () => 'toggle',
          message: '是否引入 ESLint 用于代码质量检测？',
          initial: true,
        },
        {
          name: 'needsPrettier',
          type: 'toggle',
          message: '是否引入 Prettier 用于代码格式化？',
          initial: true,
        },
        {
          name: 'needsCommitList',
          type: 'toggle',
          message: '是否引入 CommitList 用于规范 commit 信息？',
          initial: true,
        },
      ],
      {
        onCancel: () => {
          throwError('操作取消')
        },
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    process.exit(1)
  }
}

function sortDependencies(packageJson: DataSource) {
  const sorted = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ].reduce((prev, type) => {
    const dependencies = packageJson[type]
    if (dependencies) {
      const sortedDeps = Object.keys(dependencies)
        .sort()
        .reduce((deps, name) => ({ ...deps, [name]: dependencies[name] }), {})
      return { ...prev, [type]: sortedDeps }
    }
    return prev
  }, {} as DataSource)

  return {
    ...packageJson,
    ...sorted,
  }
}

export async function renderTemplate(
  src: string,
  dest: string,
  dataSource: PromptsResult
) {
  const stats = fs.statSync(src)
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
      renderTemplate(
        path.resolve(src, file),
        path.resolve(dest, file),
        dataSource
      )
    }
    return
  }

  const filename = path.basename(src)

  if (filename.endsWith('.ejs')) {
    const template = fs.readFileSync(src, 'utf-8')
    const content = ejs.render(template, dataSource)
    const filePath = dest.replace(/\.ejs$/, '')
    fs.writeFileSync(filePath, content)
    return
  }

  if (filename.endsWith('.tpl')) {
    const template = fs.readFileSync(src, 'utf-8')
    fs.writeFileSync(dest.replace(/\.tpl$/, ''), template)
    return
  }

  if (filename === 'package.json' && fs.existsSync(dest)) {
    const pkg = sortDependencies(
      merge(
        JSON.parse(fs.readFileSync(dest, 'utf8')),
        JSON.parse(fs.readFileSync(src, 'utf8'))
      )
    )
    fs.writeFileSync(dest, `${JSON.stringify(pkg, null, 2)}\n`)
    return
  }

  fs.copyFileSync(src, dest)
}
