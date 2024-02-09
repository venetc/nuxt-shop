import { z } from 'zod'

import { TablesKeys } from '~/server/db/schema'
import { useDBClient } from '~/server/db/client'
import {
  seedGlobalColors,
  seedGlobalColorsOfProducts,
  seedProducts,
  seedSizes,
  seedSizesOfProducts,
  seedСategories,
} from '~/server/db/mock/seed'

const _tableParseSchema = z.object({
  table: z.enum(TablesKeys),
})

export default defineEventHandler(async (event) => {
  const response = await readValidatedBody(event, _tableParseSchema.safeParse)

  if (!response.success) {
    const errors = response.error.flatten().fieldErrors

    throw createError({
      statusCode: 422,
      message: parseZodError(response.error),
      data: { errors },
    })
  }

  const dbClient = useDBClient()

  switch (response.data.table) {
    case 'categories': { await seedСategories(dbClient); break }
    case 'global_colors': { await seedGlobalColors(dbClient); break }
    case 'sizes': { await seedSizes(dbClient); break }
    case 'products': { await seedProducts(dbClient); break }
    case 'global_colors_of_products': { await seedGlobalColorsOfProducts(dbClient); break }
    case 'sizes_of_products': { await seedSizesOfProducts(dbClient); break }
  }

  return { data: `Table "${response.data.table}" successfully seeded` }
})
