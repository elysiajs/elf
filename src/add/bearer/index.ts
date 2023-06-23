import { appendElysiaPlugin } from '../../utils'

const header = `import { bearer } from '@elysiajs/bearer'`

const code = `.use(bearer())`

export const dependencies = ['@elysiajs/bearer']

const bearer = async () => {
    await appendElysiaPlugin({
        header,
        code
    })
}

export default bearer
