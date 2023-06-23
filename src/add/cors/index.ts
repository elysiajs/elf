import i from 'inquirer'

import { appendElysiaPlugin } from '../../utils'

const header = `import { cors } from '@elysiajs/cors'`

const code = `.use(cors())`

export const dependencies = ['@elysiajs/cors']

const cors = async () => {
    await appendElysiaPlugin({
        header,
        code
    })
}

export default cors
