#!/usr/bin/env node
import select from '@inquirer/select'
import i from 'inquirer'

import add, { addOptions } from './add'
import generate, { generateOptions } from './generate'

import { install } from './utils'

import type { ParsedArgs } from 'minimist'

import info from '../package.json'
import chalk from 'chalk'

const argv: ParsedArgs = require('minimist')(process.argv.slice(2))
let {
    _: [action, ...subs]
} = argv

const main = async () => {
    if (!action)
        action = await select({
            message: 'command',
            choices: [
                {
                    value: 'add',
                    description: 'Add plugins to server'
                },
                {
                    value: 'generate',
                    description: 'Generate starting files for development'
                }
            ]
        })

    if (!subs.length)
        switch (action) {
            case 'a':
            case 'add':
                subs = await addOptions()
                break

            case 'g':
            case 'gen':
            case 'generate':
                subs = [await generateOptions()]
                break

            case 'v':
            case 'version':
                subs = ['']
        }

    let cmdNotFound = false

    for (const sub of subs) {
        switch (action) {
            case 'a':
            case 'add':
                await add(sub)
                break

            case 'g':
            case 'gen':
            case 'generate':
                await generate(sub)
                break

            case 'v':
            case 'version':
                console.log(
                    chalk.cyanBright.bold('Elf Elysia') + ' - ' + info.description
                )
                console.log('version: ' + info.version)

                cmdNotFound = true

                break

            default:
                cmdNotFound = true
                console.log(`${chalk.bold(action)} command not found`)
        }
    }

    if (!cmdNotFound) {
        await install()

        console.log('\n✅ All Set')
    }
}

main()
