import { getValidatedRouterParams } from 'h3'
import { z } from 'zod'

import { useDBClient } from '~/server/db/client'
import { normalizeProductDetails } from '~/server/utils/productDTO'

const slugSchema = z.object({ slug: z.string() })
const db = useDBClient()

export default cachedEventHandler(async (event) => {
  const validateResult = await getValidatedRouterParams(event, slugSchema.safeParse)

  if (!validateResult.success) {
    throw createError({ statusCode: 404, statusMessage: 'Incorrect product slug' })
  }

  const data = await db.query.products.findFirst({
    where: (entity, { eq }) => eq(entity.slug, validateResult.data.slug),
    with: {
      category: {
        columns: { name: true, id: true },
      },
      globalColors: {
        columns: {},
        with: { globalColor: true },
      },
      sizes: {
        columns: { stockAmount: true },
        with: { size: true },
      },
    },
  })

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return normalizeProductDetails(data)
}, {
  maxAge: 30, // 30 seconds
})
