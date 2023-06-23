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

    code: (useRedis: boolean) =>
        readFileSync(__dirname + (useRedis ? '/code-redis.txt' : '/code.txt'), {
            encoding: 'utf8'
        }),

    elysia: (prefix: string) =>
        readFileSync(__dirname + '/elysia.txt', {
            encoding: 'utf8'
        }).replace('/auth', prefix)
}
