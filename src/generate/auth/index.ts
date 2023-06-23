import select, { Separator } from '@inquirer/select'

import { prisma } from './prisma'
import { drizzle } from './drizzle'

const auth = async () => {
    const orm = await select({
        message: 'Database Client',
        choices: [
            {
                name: 'Prisma',
                value: 'prisma'
            },
            {
                name: 'Drizzle',
                value: 'drizzle'
            },
            {
                name: 'Kysely',
                value: 'kysely',
                disabled: true
            }
        ]
    })

    switch (orm) {
        case 'prisma':
            await prisma()
            break

        case 'drizzle':
            await drizzle()
            break
    }
}

export default auth
