import { useDBClient } from '~/server/db/client'

const db = useDBClient()
export default cachedEventHandler(async () => {
  return await db.query.categories.findMany({
    columns: { id: true, name: true, logo: true },
  })
}, {
  maxAge: 30 * 60, // 30 minutes
})
