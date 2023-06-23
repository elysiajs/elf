import i from 'inquirer'

import { existsSync } from 'fs'
import { readFile, writeFile, mkdir } from 'fs/promises'

import { appendElysiaPlugin, mkdirRecursive } from '../../utils'

const header = `import { staticPlugin } from '@elysiajs/static'`

const code = (assets: string, prefix: string) =>
    assets === 'public' && prefix === '/public'
        ? `.use(staticPlugin())`
        : `.use(
    staticPlugin({
        ${assets === 'public' ? '' : `assets: ${assets},\n`}${
              prefix === '/public' ? '' : `prefix: ${prefix}`
          }
    })
)`

export const dependencies = ['@elysiajs/static']

const staticPlugin = async () => {
    const { assets } = await i.prompt({
        name: 'assets',
        message: 'Folder to expose as public',
        default: 'public'
    })

    mkdirRecursive(assets)

    const { prefix } = await i.prompt({
        name: 'prefix',
        message: 'Prefix for exposed folder',
        default: '/public'
    })

    await appendElysiaPlugin(
        {
            header,
            code: code(assets, prefix)
        },
        {
            mainOnly: true
        }
    )
}

export default staticPlugin
