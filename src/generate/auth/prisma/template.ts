import { readFileSync } from 'fs'

export const PrismaTemplate = {
    schema: `
model AuthUser {
  id           String    @id @unique
  auth_session AuthSession[]
  auth_key     AuthKey[]

  username    String    @unique

  // Change table name here
  @@map("auth_user")
}

model AuthSession {
  id             String	@id @unique
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  auth_user      AuthUser   @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
  @@map("auth_session")
}

model AuthKey {
  id              String  @id @unique
  hashed_password String?
  user_id         String
  primary_key     Boolean
  expires         BigInt?
  auth_user       AuthUser    @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
  @@map("auth_key")
}
`,

    schemaMongo: `
model AuthUser {
  id           String   @id @map("_id")
  auth_session AuthSession[]
  auth_key     AuthKey[]

  username    String    @unique

  // Change table name here
  @@map("auth_user")
}

model AuthSession {
  id             String     @id @map("_id")
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  auth_user      AuthUser   @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
  @@map("auth_session")
}

model AuthKey {
  id              String      @id @map("_id")
  hashed_password String?
  user_id         String
  primary_key     Boolean
  expires         BigInt?
  auth_user       AuthUser    @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
  @@map("auth_key")
}
`,

  connection: {
    'postgres': 'postgresql://postgres:12345678@localhost:5432/mydb?schema=public',
    'mysql': 'mysql://mysql:12345678@localhost:3306/mydb?schema=public',
    'planetscale': 'mysql://platnetscale:3306@localhost:5432/mydb?schema=public',
    'cockroachdb': 'postgresql://cockroach:26257@localhost:5432/mydb?schema=public',
    'mongodb': 'mongodb://mongo:12345678@localhost:27017/mydb?ssl=true&connectTimeoutMS=5000&maxPoolSize=50',
    'sqlite': 'file:./dev.db',
    'sqlserver': 'sqlserver://localhost:1433;database=mydb;user=sqlserver;password=12345678;encrypt=true',
  },
    code: (useRedis: boolean) =>
        readFileSync(__dirname + (useRedis ? '/code-redis.txt' : '/code.txt'), {
            encoding: 'utf8'
        }),

    elysia: (prefix: string) =>
        readFileSync(__dirname + '/elysia.txt', {
            encoding: 'utf8'
        }).replace('/auth', prefix)
}
