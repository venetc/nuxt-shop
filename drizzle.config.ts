import type { Config } from 'drizzle-kit'

const env = process.env.MIGRATE_ENV
const [authToken = '', url = ''] = [process.env.NUXT_TURSO_DB_TOKEN, process.env.NUXT_TURSO_DB_URL]

export default {
  out: 'server/db/migrations',
  schema: 'server/db/schema.ts',
  driver: env === 'development' ? 'libsql' : 'turso',
  dbCredentials: env === 'development' ? { url: 'file:server/db/local.db' } : { url, authToken },
} satisfies Config
