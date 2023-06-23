import i from 'inquirer'
import select, { Separator } from '@inquirer/select'
import c from 'chalk'
import { $, cd } from 'zx-cjs'

import task from 'tasuku'

import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { PrismaTemplate } from './template'

import {
    format,
    appendElysiaPlugin,
    store,
    install,
    mkdirRecursive
} from '../../../utils'
import oauth from '../oauth'

$.verbose = false

export const prisma = async () => {
    const { useRedis } = await i.prompt({
        name: 'useRedis',
        type: 'confirm',
        message: 'Use Redis for storing session',
        default: true
    })

    if (useRedis)
        store.deps.push(...['redis', '@lucia-auth/adapter-session-redis'])

    store.deps.push(
        ...[
            '@prisma/client',
            '@lucia-auth/adapter-prisma',
            '@elysiajs/cookie',
            '@elysiajs/lucia-auth'
        ]
    )

    store.devs.push('prisma')

    await install()

    try {
        await $`bunx prisma init`
    } catch {}

    // ? Prisma init already generate .env with johndoe:randompassword

    const dotenv = await readFile('.env', {
        encoding: 'utf8'
    })

    if (dotenv.includes('://johndoe:randompassword')) {
        const { url } = await i.prompt({
            name: 'url',
            message: 'Provide DATABASE_URL',
            default:
                'postgresql://postgres:12345678@localhost:5432/mydb?schema=public'
        })

        await writeFile(
            '.env',
            dotenv.replace(/DATABASE_URL=(.*?)(\n|$)/g, `DATABASE_URL=${url}\n`)
        )
    }

    const schema = await readFile('prisma/schema.prisma', {
        encoding: 'utf8'
    })

    if (!schema.includes('model AuthUser')) {
        await writeFile('prisma/schema.prisma', schema + PrismaTemplate.schema)

        const { shouldMigrate } = await i.prompt({
            name: 'shouldMigrate',
            type: 'confirm',
            message: 'Migrate database?',
            default: true
        })

        if (shouldMigrate) {
            $.verbose = true
            try {
                await $`bunx prisma migrate dev --name init`
            } catch {}
            $.verbose = false
        }
    }

    await $`bunx prisma generate`

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
            PrismaTemplate.code(useRedis) +
                '\n' +
                PrismaTemplate.elysia(prefix).replace(
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

export default prisma
