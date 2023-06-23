import i from 'inquirer'
import select, { Separator } from '@inquirer/select'
import c from 'chalk'
import { $, cd } from 'zx-cjs'

import task from 'tasuku'

import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { DrizzleTemplate } from './template'

import {
    appendElysiaPlugin,
    store,
    install,
    mkdirRecursive,
    format
} from '../../../utils'
import oauth from '../oauth'

const shared = 'drizzle-orm @elysiajs/cookie @elysiajs/lucia-auth'

$.verbose = false

export const drizzle = async () => {
    const { useRedis } = await i.prompt({
        name: 'useRedis',
        type: 'confirm',
        message: 'Use Redis for storing session',
        default: true
    })

    const database = (await select({
        message: 'Database Client',
        choices: [
            {
                name: 'Postgres',
                value: 'postgres'
            },
            {
                name: 'MySQL',
                value: 'mysql'
            },
            {
                name: 'PlanetScale',
                value: 'planetscale'
            }
        ]
    })) as 'postgres' | 'mysql' | 'planetscale'

    const { dependencies, devDependencies, code, env } =
        DrizzleTemplate[database]

    if (useRedis)
        store.deps.push(...['redis', '@lucia-auth/adapter-session-redis'])

    store.deps.push(...dependencies)

    if (devDependencies.length) store.deps.push(...devDependencies)

    await install()

    const hasEnv = existsSync('.env')

    const dotenv = hasEnv
        ? await readFile('.env', {
              encoding: 'utf8'
          })
        : ''

    if (!dotenv.includes('DATABASE_URL=')) {
        const { url } = await i.prompt({
            name: 'url',
            message: 'Provide DATABASE_URL',
            default: env
        })

        if (!hasEnv) await writeFile('.env', `DATABASE_URL=${url}\n`)
        else if (url) {
            await writeFile(
                '.env',
                dotenv.replace(
                    /DATABASE_URL=(.*?)(\n|$)/g,
                    `DATABASE_URL=${url}\n`
                )
            )
        }
    }

    const { prefix } = await i.prompt({
        name: 'prefix',
        message: 'Path prefix',
        default: '/auth'
    })

    const oauthCode = await oauth(prefix)

    const { file } = await i.prompt({
        name: 'file',
        message: 'File location?',
        default: 'src/auth.ts',
        validate(file) {
            if (existsSync(file)) return 'File exists'

            return true
        }
    })

    mkdirRecursive(file)

    await writeFile(
        file,
        await format(
            code(useRedis) +
                '\n' +
                DrizzleTemplate.elysia(prefix).replace(
                    '.use(cookie())',
                    `.use(cookie())${oauthCode}`
                )
        )
    )

    await appendElysiaPlugin(
        {
            header: `import auth from '${file
                .replace(/^src\//, './')
                .replace(/.(j|t)s/, '')}'`,
            code: '.use(auth)'
        },
        {
            mainOnly: true,
            duplicatable: false
        }
    )
}

export default drizzle
