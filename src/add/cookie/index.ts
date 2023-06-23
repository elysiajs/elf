import { appendElysiaPlugin } from '../../utils'

const header = `import { cookie } from '@elysiajs/cookie'`

const code = `.use(cookie())`

export const dependencies = ['@elysiajs/cookie']

const cookie = async () => {
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

export default cookie
