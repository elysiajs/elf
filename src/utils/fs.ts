import { existsSync, mkdirSync } from 'fs'

export const mkdirRecursive = (path: string) => {
    let paths = path.split('/')

    // Determine file or folder
    // eg: src/controllers/salt.ts
    if (path.lastIndexOf('/') < path.lastIndexOf('.'))
        paths = paths.slice(0, paths.lastIndexOf('/'))

    paths.reduce((directories, directory) => {
        directories += `${directory}/`

        if (!existsSync(directories)) mkdirSync(directories)

        return directories
    }, '')
}
