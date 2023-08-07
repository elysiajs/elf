import select from '@inquirer/select'
import brush from '@griseo.js/brush'

import auth from './auth'
import route from './route'

import { indent, capitalize } from '../utils/format'

const generators = ['auth', 'route'] as const

export const generateOptions = () =>
    select({
        message: 'generate',
        choices: generators.map((value) => ({ value }))
    })

const generate = async (action: string) => {
    if (!generators.includes(action as any))
        return console.log(
            'Generator for ' + brush.red(action) + ' not found, skip...'
        )

    indent(`Generate ${capitalize(action)}`)

    switch (action) {
        case 'auth':
            await auth()
            break

        case 'route':
            await route()
            break
    }
}

export default generate
