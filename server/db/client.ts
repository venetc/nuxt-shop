import { createClient as createLocalClient } from '@libsql/client'
import { createClient as createLibSQLClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'

import type { LibSQLDatabase } from 'drizzle-orm/libsql'

import * as schema from '@/server/db/schema'

let _db: LibSQLDatabase<typeof schema> | null = null

export function useDBClient() {
  const { tursoDbToken, tursoDbUrl } = useRuntimeConfig()

  if (!import.meta.dev && !tursoDbToken || !tursoDbUrl) throw new Error('Missing tursoDbToken or tursoDbUrl')

  if (!_db) _db = import.meta.dev ? generateLocalDB() : generateRemoteDB(tursoDbToken, tursoDbUrl)

  return _db
}

export type DBClient = ReturnType<typeof useDBClient>

export function generateLocalDB() {
  const sqlite = createLocalClient({ url: 'file:server/db/local.db' })
  return drizzle(sqlite, { logger: false, schema })
}

export function generateRemoteDB(url: string, authToken: string) {
  const turso = createLibSQLClient({ url, authToken })
  return drizzle(turso, { schema })
}
