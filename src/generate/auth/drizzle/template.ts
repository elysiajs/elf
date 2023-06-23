import { readFileSync } from 'fs'

export const DrizzleTemplate = {
    postgres: {
        dependencies: ['@lucia-auth/adapter-postgresql'],
        devDependencies: ['@types/pg'],
        env: 'postgresql://postgres:12345678@localhost:5432/mydb',
        code: (useRedis: boolean) =>
            readFileSync(
                __dirname +
                    (useRedis ? '/postgres-redis.txt' : '/postgres.txt'),
                {
                    encoding: 'utf8'
                }
            )
    },
    mysql: {
        dependencies: ['better-sqlite3', '@lucia-auth/adapter-mysql'],
        devDependencies: ['@types/better-sqlite3'],
        env: 'mysql://user:pass@localhost:3306/mydb',
        code: (useRedis: boolean) =>
            readFileSync(
                __dirname + (useRedis ? '/mysql-redis.txt' : '/mysql.txt'),
                {
                    encoding: 'utf8'
                }
            )
    },
    planetscale: {
        dependencies: ['@planetscale/database', '@lucia-auth/adapter-mysql'],
        devDependencies: [],
        env: 'mysql://user:pass@localhost:3306/mydb',
        code: (useRedis: boolean) =>
            readFileSync(
                __dirname +
                    (useRedis ? '/planetscale-redis.txt' : '/planetscale.txt'),
                {
                    encoding: 'utf8'
                }
            )
    },
    elysia: (prefix: string) =>
        readFileSync(__dirname + '/elysia.txt', {
            encoding: 'utf8'
        }).replace('/auth', prefix)
}
