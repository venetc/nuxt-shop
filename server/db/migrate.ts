import 'dotenv/config'
import { generateLocalDB, generateRemoteDB } from './client'

import { migrate } from 'drizzle-orm/libsql/migrator'

import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type * as schema from '@/server/db/schema'

async function main() {
  const env = process.env.MIGRATE_ENV
  let db: LibSQLDatabase<typeof schema> | null = null

  if (env === 'development') {
    db = generateLocalDB()
  }
  else {
    const [authToken, url] = [process.env.NUXT_TURSO_DB_TOKEN, process.env.NUXT_TURSO_DB_URL]
    if (!authToken || !url) throw new Error('Missing NUXT_TURSO_DB_TOKEN or NUXT_TURSO_DB_URL')

    db = generateRemoteDB(url, authToken)
  }

  await migrate(db, { migrationsFolder: 'server/db/migrations' })
}

main()
  .then(() => {
    console.log('Tables migrated!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Error performing migration: ', err)
    process.exit(1)
  })
