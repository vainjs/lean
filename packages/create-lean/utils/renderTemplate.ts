import { merge, mergeWith } from 'lodash-es'
import * as path from 'node:path'
import * as fs from 'node:fs'
import ejs from 'ejs'
import type { DataSource, PromptsResult } from './type'

function sortObject(obj: DataSource) {
  return Object.keys(obj)
    .sort()
    .reduce((prevObj, key) => ({ ...prevObj, [key]: obj[key] }), {})
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
      const sortedDeps = sortObject(dependencies)
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
    const filePath = dest.replace(/\.tpl$/, '')
    fs.writeFileSync(filePath, template)
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

  if (filename.endsWith('.json') && fs.existsSync(dest)) {
    const pkg = sortObject(
      mergeWith(
        JSON.parse(fs.readFileSync(dest, 'utf8')),
        JSON.parse(fs.readFileSync(src, 'utf8')),
        (objValue, srcValue) => {
          if (Array.isArray(objValue)) {
            return objValue.concat(srcValue)
          }
        }
      )
    )
    fs.writeFileSync(dest, `${JSON.stringify(pkg, null, 2)}\n`)
    return
  }

  fs.copyFileSync(src, dest)
}
