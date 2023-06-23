import { appendElysiaPlugin } from '../../../utils'

const header = `import { apollo, gql } from '@elysiajs/apollo'`

const code = `.use(
    apollo({
        typeDefs: gql\`
            type Book {
                title: String
                author: String
            }

            type Query {
                books: [Book]
            }
        \`,
        resolvers: {
            Query: {
                books: () => {
                    return [
                        {
                            title: 'Elysia',
                            author: 'saltyAom'
                        }
                    ]
                }
            }
        }
    })
)`

export const dependencies = ['@elysiajs/apollo', 'graphql', '@apollo/server']

const apollo = async () => {
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

export default apollo
