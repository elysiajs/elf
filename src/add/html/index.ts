import { appendElysiaPlugin } from '../../utils'

const header = `import { html } from '@elysiajs/html'`

const code = `.use(html())`

export const dependencies = ['@elysiajs/html']

const html = async () => {
    await appendElysiaPlugin({
        header,
        code
    }, {
        mainOnly: true
    })
}

export default html
