/* eslint-disable no-console */
import { red } from 'kolorist'
import prompts from 'prompts'

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
