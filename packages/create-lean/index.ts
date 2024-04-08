#!/usr/bin/env node
/* eslint-disable no-console */

import { red } from 'kolorist'
// import * as path from 'node:path'
// import * as fs from 'node:fs'
import prompts from 'prompts'
// import ejs from 'ejs'

type PromptsResult = {
  needsTypeScript?: boolean
  needsPrettier?: boolean
  needsEslint?: boolean
  projectName?: string
}

async function init() {
  // const cwd = process.cwd()
  const defaultProjectName = 'lean-project'
  // let targetDir = ''
  let result: PromptsResult = {}
  try {
    result = await prompts(
      [
        {
          name: 'projectName',
          type: 'text',
          message: '请输入项目名称：',
          initial: defaultProjectName,
          onState: (state) => {
            const v = String(state.value).trim() || defaultProjectName
            // targetDir = v
            return v
          },
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
      ],
      {
        onCancel: () => {
          throw new Error(`${red('✖')} 操作取消`)
        },
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    process.exit(1)
  }

  console.log('=======', result)
  // const { projectName, needsTypeScript, needsEslint, needsPrettier } = result

  // const root = path.join(cwd, targetDir)

  // if (fs.existsSync(root) && shouldOverwrite) {
  //   emptyDir(root)
  // } else if (!fs.existsSync(root)) {
  //   fs.mkdirSync(root)
  // }

  // console.log(`\n${language.infos.scaffolding} ${root}...`)

  // const pkg = { name: packageName, version: '0.0.0' }
  // fs.writeFileSync(
  //   path.resolve(root, 'package.json'),
  //   JSON.stringify(pkg, null, 2)
  // )

  // todo:
  // work around the esbuild issue that `import.meta.url` cannot be correctly transpiled
  // when bundling for node and the format is cjs
  // const templateRoot = new URL('./template', import.meta.url).pathname
  //   const templateRoot = path.resolve(__dirname, 'template')
  //   const callbacks = []
  //   const render = function render(templateName) {
  //     const templateDir = path.resolve(templateRoot, templateName)
  //     renderTemplate(templateDir, root, callbacks)
  //   }
  //   // Render base template
  //   render('base')

  //   // Add configs.
  //   if (needsJsx) {
  //     render('config/jsx')
  //   }
  //   if (needsRouter) {
  //     render('config/router')
  //   }
  //   if (needsPinia) {
  //     render('config/pinia')
  //   }
  //   if (needsVitest) {
  //     render('config/vitest')
  //   }
  //   if (needsCypress) {
  //     render('config/cypress')
  //   }
  //   if (needsCypressCT) {
  //     render('config/cypress-ct')
  //   }
  //   if (needsNightwatch) {
  //     render('config/nightwatch')
  //   }
  //   if (needsNightwatchCT) {
  //     render('config/nightwatch-ct')
  //   }
  //   if (needsPlaywright) {
  //     render('config/playwright')
  //   }
  //   if (needsTypeScript) {
  //     render('config/typescript')

  //     // Render tsconfigs
  //     render('tsconfig/base')
  //     // The content of the root `tsconfig.json` is a bit complicated,
  //     // So here we are programmatically generating it.
  //     const rootTsConfig = {
  //       // It doesn't target any specific files because they are all configured in the referenced ones.
  //       files: [],
  //       // All templates contain at least a `.node` and a `.app` tsconfig.
  //       references: [
  //         {
  //           path: './tsconfig.node.json',
  //         },
  //         {
  //           path: './tsconfig.app.json',
  //         },
  //       ],
  //     }
  //     if (needsCypress) {
  //       render('tsconfig/cypress')
  //       // Cypress uses `ts-node` internally, which doesn't support solution-style tsconfig.
  //       // So we have to set a dummy `compilerOptions` in the root tsconfig to make it work.
  //       // I use `NodeNext` here instead of `ES2015` because that's what the actual environment is.
  //       // (Cypress uses the ts-node/esm loader when `type: module` is specified in package.json.)
  //       // @ts-ignore
  //       rootTsConfig.compilerOptions = {
  //         module: 'NodeNext',
  //       }
  //     }
  //     if (needsCypressCT) {
  //       render('tsconfig/cypress-ct')
  //       // Cypress Component Testing needs a standalone tsconfig.
  //       rootTsConfig.references.push({
  //         path: './tsconfig.cypress-ct.json',
  //       })
  //     }
  //     if (needsPlaywright) {
  //       render('tsconfig/playwright')
  //     }
  //     if (needsVitest) {
  //       render('tsconfig/vitest')
  //       // Vitest needs a standalone tsconfig.
  //       rootTsConfig.references.push({
  //         path: './tsconfig.vitest.json',
  //       })
  //     }
  //     if (needsNightwatch) {
  //       render('tsconfig/nightwatch')
  //       // Nightwatch needs a standalone tsconfig, but in a different folder.
  //       rootTsConfig.references.push({
  //         path: './nightwatch/tsconfig.json',
  //       })
  //     }
  //     if (needsNightwatchCT) {
  //       render('tsconfig/nightwatch-ct')
  //     }
  //     fs.writeFileSync(
  //       path.resolve(root, 'tsconfig.json'),
  //       `${JSON.stringify(rootTsConfig, null, 2)}\n`,
  //       'utf-8'
  //     )
  //   }

  //   // Render ESLint config
  //   if (needsEslint) {
  //     renderEslint(root, {
  //       needsTypeScript,
  //       needsCypress,
  //       needsCypressCT,
  //       needsPrettier,
  //       needsPlaywright,
  //     })
  //     render('config/eslint')
  //   }

  //   if (needsPrettier) {
  //     render('config/prettier')
  //   }

  //   if (needsDevTools) {
  //     render('config/devtools')
  //   }
  //   // Render code template.
  //   // prettier-ignore
  //   const codeTemplate =
  //     (needsTypeScript ? 'typescript-' : '') +
  //     (needsRouter ? 'router' : 'default')
  //   render(`code/${codeTemplate}`)

  //   // Render entry file (main.js/ts).
  //   if (needsPinia && needsRouter) {
  //     render('entry/router-and-pinia')
  //   } else if (needsPinia) {
  //     render('entry/pinia')
  //   } else if (needsRouter) {
  //     render('entry/router')
  //   } else {
  //     render('entry/default')
  //   }

  //   // An external data store for callbacks to share data
  //   const dataStore = {}
  //   // Process callbacks
  //   for (const cb of callbacks) {
  //     await cb(dataStore)
  //   }

  //   // EJS template rendering
  //   preOrderDirectoryTraverse(
  //     root,
  //     () => {},
  //     (filepath) => {
  //       if (filepath.endsWith('.ejs')) {
  //         const template = fs.readFileSync(filepath, 'utf-8')
  //         const dest = filepath.replace(/\.ejs$/, '')
  //         const content = ejs.render(template, dataStore[dest])

  //         fs.writeFileSync(dest, content)
  //         fs.unlinkSync(filepath)
  //       }
  //     }
  //   )

  //   // Cleanup.

  //   // We try to share as many files between TypeScript and JavaScript as possible.
  //   // If that's not possible, we put `.ts` version alongside the `.js` one in the templates.
  //   // So after all the templates are rendered, we need to clean up the redundant files.
  //   // (Currently it's only `cypress/plugin/index.ts`, but we might add more in the future.)
  //   // (Or, we might completely get rid of the plugins folder as Cypress 10 supports `cypress.config.ts`)

  //   if (needsTypeScript) {
  //     // Convert the JavaScript template to the TypeScript
  //     // Check all the remaining `.js` files:
  //     //   - If the corresponding TypeScript version already exists, remove the `.js` version.
  //     //   - Otherwise, rename the `.js` file to `.ts`
  //     // Remove `jsconfig.json`, because we already have tsconfig.json
  //     // `jsconfig.json` is not reused, because we use solution-style `tsconfig`s, which are much more complicated.
  //     preOrderDirectoryTraverse(
  //       root,
  //       () => {},
  //       (filepath) => {
  //         if (filepath.endsWith('.js')) {
  //           const tsFilePath = filepath.replace(/\.js$/, '.ts')
  //           if (fs.existsSync(tsFilePath)) {
  //             fs.unlinkSync(filepath)
  //           } else {
  //             fs.renameSync(filepath, tsFilePath)
  //           }
  //         } else if (path.basename(filepath) === 'jsconfig.json') {
  //           fs.unlinkSync(filepath)
  //         }
  //       }
  //     )

  //     // Rename entry in `index.html`
  //     const indexHtmlPath = path.resolve(root, 'index.html')
  //     const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8')
  //     fs.writeFileSync(
  //       indexHtmlPath,
  //       indexHtmlContent.replace('src/main.js', 'src/main.ts')
  //     )
  //   } else {
  //     // Remove all the remaining `.ts` files
  //     preOrderDirectoryTraverse(
  //       root,
  //       () => {},
  //       (filepath) => {
  //         if (filepath.endsWith('.ts')) {
  //           fs.unlinkSync(filepath)
  //         }
  //       }
  //     )
  //   }

  //   // Instructions:
  //   // Supported package managers: pnpm > yarn > bun > npm
  //   const userAgent = process.env.npm_config_user_agent ?? ''
  //   const packageManager = /pnpm/.test(userAgent)
  //     ? 'pnpm'
  //     : /yarn/.test(userAgent)
  //     ? 'yarn'
  //     : /bun/.test(userAgent)
  //     ? 'bun'
  //     : 'npm'

  //   // README generation
  //   fs.writeFileSync(
  //     path.resolve(root, 'README.md'),
  //     generateReadme({
  //       projectName:
  //         result.projectName ?? result.packageName ?? defaultProjectName,
  //       packageManager,
  //       needsTypeScript,
  //       needsVitest,
  //       needsCypress,
  //       needsNightwatch,
  //       needsPlaywright,
  //       needsNightwatchCT,
  //       needsCypressCT,
  //       needsEslint,
  //     })
  //   )

  //   console.log(`\n${language.infos.done}\n`)
  //   if (root !== cwd) {
  //     const cdProjectName = path.relative(cwd, root)
  //     console.log(
  //       `  ${bold(
  //         green(
  //           `cd ${
  //             cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
  //           }`
  //         )
  //       )}`
  //     )
  //   }
  //   console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
  //   if (needsPrettier) {
  //     console.log(`  ${bold(green(getCommand(packageManager, 'format')))}`)
  //   }
  //   console.log(`  ${bold(green(getCommand(packageManager, 'dev')))}`)
  //   console.log()
}

init().catch((e) => {
  console.error(e)
})
