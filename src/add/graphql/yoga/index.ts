import { appendElysiaPlugin } from '../../../utils'

const header = `import { yoga } from '@elysiajs/graphql-yoga'`

const code = `.use(
    yoga({
        typeDefs: /* GraphQL */\`
            type Query {
                hi: String
            }
        \`,
        resolvers: {
            Query: {
                hi: () => 'Hello from Elysia'
            }
        }
    })
)`

export const dependencies = [
    '@elysiajs/graphql-yoga',
    'graphql',
    'graphql-yoga'
]

const yoga = async () => {
    await appendElysiaPlugin(
        {
            header,
            code
        },
        {
            duplicatable: false
        }
    )
}

export default yoga
