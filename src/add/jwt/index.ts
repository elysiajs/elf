import i from 'inquirer'

import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { appendElysiaPlugin } from '../../utils'

const header = `import { jwt } from '@elysiajs/jwt'`

const code = (name: string, secret: string) => `.use(
    jwt({
        name: '${name}',
        secret: process.env.JWT_SECRET!
    })
)`

export const dependencies = ['@elysiajs/jwt']

const jwt = async () => {
    const { name } = await i.prompt({
        name: 'name',
        message: 'Register JWT function as',
        default: 'jwt'
    })

    let secret = ''
    let dotenv = ''

    if (existsSync('.env')) {
        dotenv = await readFile('.env', {
            encoding: 'utf8'
        })

        const jwtSecret = dotenv.match(/JWT_SECRET=(.*?)(\n|$)/g)

        if (jwtSecret) secret = jwtSecret[0]
    }

    if (!secret) {
        const { secret: input } = await i.prompt({
            name: 'secret',
            message: 'Secrets for encryption?',
            validate(secret) {
                if (!secret) return "Secret can't be empty"

                return true
            }
        })

        secret = input

        const env = dotenv.includes('JWT_SECRET')
            ? dotenv.replace(
                  /JWT_SECRET=(.*?)(\n|$)/g,
                  `JWT_SECRET=${secret}\n`
              )
            : dotenv + '\n' + `JWT_SECRET=${secret}`

        await writeFile('.env', env)
    }

    await appendElysiaPlugin({
        header,
        code: code(name, secret)
    })
}

export default jwt
