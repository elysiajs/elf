import i from 'inquirer'
import select, { Separator } from '@inquirer/select'
import brush from '@griseo.js/brush'

import { readFile, writeFile } from 'fs/promises'

import { capitalize } from '../../../utils'

const oauthOptions = [
    'discord',
    'facebook',
    'github',
    'google',
    'linkedin',
    'patreon',
    'reddit',
    'twitch'
] as const

const ask = (message: string) =>
    i
        .prompt({
            name: 'value',
            message
        })
        .then(({ value }) => value)

const createOauthEnv = async (name: string) => `
${name.toUpperCase()}_CLIENT_ID=${await ask(`${capitalize(name)} Client ID`)}
${name.toUpperCase()}_CLIENT_SECRET=${await ask(`${capitalize(name)} Secret`)}`

const createOauthCode = (name: string, prefix = '/auth') => `.use(
    lucia.oauth.${name}({
        config: {
            clientId: process.env.${name.toUpperCase()}_CLIENT_ID!,
            clientSecret: process.env.${name.toUpperCase()}_CLIENT_SECRET!,
            redirectUri: 'http://localhost:3000${prefix}/${name}/callback'
        }
    })
)`

const appendOAuth = async (name: string) => {
    const dotenv = await readFile('.env', {
        encoding: 'utf8'
    })

    if (!dotenv.includes(`${name.toUpperCase()}_CLIENT_ID=`))
        await writeFile(
            '.env',
            dotenv +
                (dotenv.endsWith('\n') ? '' : '\n') +
                (await createOauthEnv(name))
        )
}

const oauth = async (prefix = '/auth') => {
    const { oauth } = await i.prompt({
        name: 'oauth',
        message: 'Select OAuth Provider (optional)',
        type: 'checkbox',
        choices: oauthOptions.map((value) => ({ value }))
    })

    let code = ''

    for (const auth of oauth) {
        await appendOAuth(auth)

        code += createOauthCode(auth)
    }

    return code
}

export default oauth
