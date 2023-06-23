import task from 'tasuku'
import { $ } from 'zx-cjs'

import { readFileSync, existsSync } from 'fs'
import { store } from './store'

const packages = existsSync('package.json')
    ? (JSON.parse(
          readFileSync('package.json', {
              encoding: 'utf8'
          })
      ) as {
          dependencies: Record<string, string>
          devDependencies: Record<string, string>
      })
    : null

const _deps = packages?.dependencies ? Object.keys(packages.dependencies) : []
const _devs = packages?.devDependencies
    ? Object.keys(packages.devDependencies)
    : []

export const install = async () => {
    const deps = [
        ...new Set(store.deps.filter((name) => !_deps.includes(name)))
    ].join(' ')

    const devs = [
        ...new Set(store.devs.filter((name) => !_devs.includes(name)))
    ].join(' ')

    if (_deps || _devs) {
        console.log('')
        await task('Installing dependencies', async () => {
            try {
                if (deps) {
                    $.verbose = false
                    await new Function('$', `return $\`bun add ${deps}\``)($)
                    store.deps = []
                }

                if (devs) {
                    $.verbose = false
                    await new Function('$', `return $\`bun add -d ${devs}\``)($)
                    store.devs = []
                }
            } catch (error) {
                console.log(
                    'Failed to install dependencies. Please install dependency yourself\n'
                )

                console.log(`dependencies: ${deps}`)
                console.log(`devDependencies: ${devs}`)
            }
        }).then((x) => x.clear())
    }
}
