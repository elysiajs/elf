import i from 'inquirer'

import { appendElysiaPlugin } from '../../utils'

const header = `import { swagger } from '@elysiajs/swagger'`

const code = (title: string) => `.use(
    swagger({
        documentation: {
            info: {
                title: '${title}',
                version: '0.1.0'
            }
        }
    })
)`

export const dependencies = ['@elysiajs/swagger']

const swagger = async () => {
    const { title } = await i.prompt({
        name: 'title',
        default: 'Elysia documentation'
    })

    await appendElysiaPlugin(
        {
            header,
            code: code(title)
        },
        {
            mainOnly: true,
            duplicatable: false
        }
    )
}

export default swagger
