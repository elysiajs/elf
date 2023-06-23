import i from 'inquirer'
import chalk from 'chalk'

import bearer, { dependencies as bearerDeps } from './bearer'
import cookie, { dependencies as cookieDeps } from './cookie'
import cors, { dependencies as corsDeps } from './cors'
import graphql from './graphql'
import html, { dependencies as htmlDeps } from './html'
import jwt, { dependencies as jwtDeps } from './jwt'
import staticPlugin, { dependencies as staticPluginDeps } from './static'
import swagger, { dependencies as swaggerDeps } from './swagger'

import { indent, capitalize, store } from '../utils'

const plugins = [
    'bearer',
    'cookie',
    'cors',
    'graphql',
    'html',
    'jwt',
    'static',
    'swagger'
] as const

export const depsMap = {
    bearer: bearerDeps,
    cookie: cookieDeps,
    cors: corsDeps,
    html: htmlDeps,
    jwt: jwtDeps,
    static: staticPluginDeps,
    staticPlugin: staticPluginDeps,
    swagger: swaggerDeps
} as const

export const addOptions = async () => {
    const { actions } = await i.prompt({
        name: 'actions',
        message: 'Plugins to install',
        type: 'checkbox',
        choices: plugins.map((name) => ({ name }))
    })

    return actions as string[]
}

const add = async (action: string) => {
    if (!plugins.includes(action as any))
        return console.log(
            'Plugin ' + chalk.red(action) + ' not found, skip...'
        )

    const deps = depsMap[action as keyof typeof depsMap]
    if (deps?.length) store.deps.push(...deps)

    indent(`${action === 'html' ? 'HTML' : capitalize(action)} plugin`)

    switch (action) {
        case 'bearer':
            await bearer()
            break

        case 'cookie':
            await cookie()
            break

        case 'cors':
            await cors()
            break

        case 'graphql':
            await graphql()
            break

        case 'html':
            await html()
            break

        case 'jwt':
            await jwt()
            break

        case 'static':
            await staticPlugin()
            break

        case 'swagger':
            await swagger()
            break
    }
}

export default add
