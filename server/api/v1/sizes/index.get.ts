import { useDBClient } from '~/server/db/client'

const db = useDBClient()
export default cachedEventHandler(async () => {
  const sizes = await db.query.sizes.findMany()

  return { sizes }
}, {
  maxAge: 30 * 60, // 30 minutes
})
