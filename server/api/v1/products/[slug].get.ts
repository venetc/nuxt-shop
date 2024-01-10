import { getValidatedRouterParams } from 'h3'
import { z } from 'zod'

import { useDBClient } from '~/server/db/client'

const slugSchema = z.object({ slug: z.string() })
const db = useDBClient()

export default cachedEventHandler(async (event) => {
  const validateResult = await getValidatedRouterParams(event, slugSchema.safeParse)

  if (!validateResult.success) {
    throw createError({ statusCode: 404, statusMessage: 'Incorrect product slug' })
  }

  const result = await db.query.products.findFirst({
    where: (entity, { eq }) => eq(entity.slug, validateResult.data.slug),
    with: {
      colors: {
        columns: {},
        with: { color: true },
      },
      sizes: {
        columns: { stockAmount: true },
        with: { size: true },
      },
    },
  })

  if (!result) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return { data: result }
}, {
  maxAge: 30, // 30 seconds
})
