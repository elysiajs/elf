import select, { Separator } from '@inquirer/select'

import apollo, { dependencies as apolloDeps } from './apollo'
import yoga, { dependencies as YogaDeps } from './yoga'

import { install, store } from '../../utils'

const graphql = async () => {
    const orm = await select({
        message: 'GraphQL Library',
        choices: [
            {
                name: 'Yoga',
                value: 'yoga'
            },
            {
                name: 'Apollo',
                value: 'apollo'
            }
        ]
    })

    switch (orm) {
        case 'apollo':
            store.deps.push(...apolloDeps)
            await apollo()
            break

        case 'yoga':
            store.deps.push(...YogaDeps)
            await yoga()
            break
    }
}

export default graphql
