import i from 'inquirer'

import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'

import add, { addOptions } from '../../add'

import {
    appendElysiaPlugin,
    mkdirRecursive,
    prettier,
    store
} from '../../utils'

const route = async () => {
    let code = `import type { Elysia } from 'elysia'\n\n`

    const { name } = await i.prompt({
        name: 'name',
        message: 'Route name?',
        validate(name) {
            if (!name) return "Route name can't be empty"

            return true
        }
    })

    code += `const ${name} = (app: Elysia) => app`

    const { prefix } = await i.prompt({
        name: 'prefix',
        message: 'Path prefix?'
    })

    if (prefix) code += `.group('${prefix}', (app) => app`

    code += `.get('/', () => 'hello ${name}')`

    // May something be here

    if (prefix) code += ')'

    code += `\n\nexport default ${name}\n`

    const { file } = await i.prompt({
        name: 'file',
        message: 'File location?',
        default: existsSync('src')
            ? `src/${name}/index.ts`
            : `${name}/index.ts`,
        validate(file) {
            if (existsSync(file)) return 'File exists'

            return true
        }
    })

    mkdirRecursive(file)
    await writeFile(file, code)

    store.file = file

    const options = await addOptions()

    if (options.length) for (const option of options) await add(option)
    else await prettier(file)
}

export default route
