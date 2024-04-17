import { red } from 'kolorist'
import prompts from 'prompts'
import { getLanguage } from './getLanguage'

function throwError(message: string) {
  throw new Error(`${red('✖')} ${message}`)
}

export async function getPrompts(defaultProjectName = 'lean-project') {
  const language = getLanguage()

  try {
    return await prompts(
      [
        {
          name: 'projectName',
          type: 'text',
          initial: defaultProjectName,
          message: language.projectName.message,
          onState: (state) => String(state.value).trim() || defaultProjectName,
        },
        {
          name: 'projectType',
          type: 'select',
          initial: 0,
          message: language.projectType.message,
          // hint: language.projectType.hint,
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
          initial: true,
          message: language.needsTypeScript.message,
          active: language.defaultToggleOptions.active,
          inactive: language.defaultToggleOptions.inactive,
        },
        {
          name: 'needsEslint',
          type: () => 'toggle',
          initial: true,
          message: language.needsEslint.message,
          active: language.defaultToggleOptions.active,
          inactive: language.defaultToggleOptions.inactive,
        },
        {
          name: 'needsPrettier',
          type: 'toggle',
          initial: true,
          message: language.needsPrettier.message,
          active: language.defaultToggleOptions.active,
          inactive: language.defaultToggleOptions.inactive,
        },
        {
          name: 'needsCommitList',
          type: 'toggle',
          initial: true,
          message: language.needsCommitList.message,
          active: language.defaultToggleOptions.active,
          inactive: language.defaultToggleOptions.inactive,
        },
      ],
      {
        onCancel: () => {
          throwError(language.errors.operationCancelled)
        },
      }
    )
  } catch (cancelled: any) {
    // eslint-disable-next-line no-console
    console.log(cancelled.message)
    process.exit(1)
  }
}
