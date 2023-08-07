import brush from '@griseo.js/brush'

import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { format as formatCode, resolveConfig } from 'prettier'

export const indent = (word: string) => console.log(brush.bold(`\n> ${word}`))

export const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1)

export const format = async (code: string) =>
    formatCode(code, {
        parser: 'typescript',
        ...(await resolveConfig(process.cwd()))
    })

export const prettier = async (
    file: string,
    content: string | Promise<string> = readFile(file, {
        encoding: 'utf8'
    })
) => writeFile(file, await format(await content))
