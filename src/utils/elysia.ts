import i from 'inquirer'

import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { format, resolveConfig } from 'prettier'

import { store } from './store'
import { prettier } from './format'

const mainFile = [
    'src/index.ts',
    'index.ts',
    'src/main.ts',
    'main.ts',
    'src/index.js',
    'index.js',
    'src/main.js',
    'main.js'
]

const insert = (word: string, text: string, index: number) =>
    text.slice(0, index) + word + text.slice(index)

export const appendElysiaPlugin = async (
    word:
        | string
        | {
              header?: string
              code?: string
          },
    {
        duplicatable,
        mainOnly,
        file: requestedFile
    }: {
        file?: string
        duplicatable?: boolean
        mainOnly?: boolean
    } = {
        file: '',
        duplicatable: false,
        mainOnly: false
    }
) => {
    const { header = '', code = '' } =
        typeof word === 'object'
            ? word
            : {
                  header: '',
                  code: word
              }

    let file =
        requestedFile || store.file || mainFile.find((file) => existsSync(file))

    if (!store.file && (!mainOnly || !file)) {
        const { file: prompted } = await i.prompt({
            name: 'file',
            message: 'Append to',
            type: 'input',
            default: file,
            validate(answer) {
                return existsSync(answer) ? true : 'File not found'
            }
        })

        file = prompted
    }

    file = file as string

    let content = await readFile(file, {
        encoding: 'utf8'
    })

    let instance = store.file ? '' : content.match(/new Elysia(<(.*)>)?\(/g)
    let codeStart = content.indexOf(')', content.indexOf('new Elysia')) + 1

    if (!instance)
        (() => {
            const arrowReturn = content.match(
                /(var|let|const) (\w)+ = (\()?(\w)+(: (\w)+)?(\)?) =>(\ |\t|\n)+(\w)+/g
            )

            if (arrowReturn?.[0])
                return (codeStart =
                    content.indexOf(arrowReturn[0]) + arrowReturn[0].length)

            const [, params] =
                content.match(
                    /(var|let|const|function) \w( )?(=)?( )?(\()?(\w)+(: (\w)+)?(\)?)/g
                ) ?? []

            if (!params) {
                console.log(
                    `Unable to find main Elysia instance or plugin, make sure you have either 'const app = new Elysia()' or 'const plugin = (app) => app' initialized in ${file}`
                )

                process.exit(1)
            }

            codeStart = content.indexOf(params) + params.length
        })()

    if (instance && instance.length > 1) {
        console.log(
            `Unable to find main Elysia instance, make sure you have only one 'new Elysia()' initialized in ${file}`
        )
        process.exit(1)
    }

    if (code) content = insert(code, content, codeStart)

    if (header && !content.includes(header)) {
        const lastImport = content.lastIndexOf('import')

        const startIndex = !lastImport
            ? 0
            : content.indexOf('\n', lastImport) + 1

        content = insert(header + '\n', content, startIndex)
    }

    await prettier(file, content)
}
