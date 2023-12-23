import { createClient as createLocalClient } from '@libsql/client'
import { createClient as createLibSQLClient } from '@libsql/client/http'
import { drizzle } from 'drizzle-orm/libsql'

import type { LibSQLDatabase } from 'drizzle-orm/libsql'

import * as schema from '@/server/db/schema'

let _db: LibSQLDatabase<typeof schema> | null = null

export function useDBClient() {
  const tursoDbUrl = useRuntimeConfig().tursoDbUrl
  const tursoDbToken = useRuntimeConfig().tursoDbToken

  if (!import.meta.dev && !tursoDbToken || !tursoDbUrl) throw new Error('Missing tursoDbToken or tursoDbUrl')

  if (!_db) _db = import.meta.dev ? generateLocalDB() : generateRemoteDB(tursoDbUrl, tursoDbToken)

  return _db
}

export type DBClient = ReturnType<typeof useDBClient>

export function generateLocalDB() {
  const sqlite = createLocalClient({ url: 'file:server/db/local.sqlite' })
  return drizzle(sqlite, { logger: true, schema })
}

export function generateRemoteDB(url: string, authToken: string) {
  const turso = createLibSQLClient({ url, authToken })
  return drizzle(turso, { schema })
}
