import type { Tables } from '~/server/db/schema'

import { useDBClient } from '~/server/db/client'
import {
  seedColors,
  seedColorsOfProducts,
  seedProducts,
  seedSizes,
  seedSizesOfProducts,
  seedСategories,
} from '~/server/db/mock/seed'

interface SeedBody { table: Tables }

export default defineEventHandler(async (event) => {
  const { table } = await readBody<SeedBody>(event)

  if (!table) return createError({ statusCode: 400, statusMessage: 'Empty body' })

  const db = useDBClient()

  if (table === 'categories') return { data: (await seedСategories(db)).length }
  if (table === 'colors') return { data: (await seedColors(db)).length }
  if (table === 'sizes') return { data: (await seedSizes(db)).length }
  if (table === 'products') return { data: (await seedProducts(db)).length }

  if (table === 'colors_of_products') return { data: (await seedColorsOfProducts(db)) }
  if (table === 'sizes_of_products') return { data: (await seedSizesOfProducts(db)) }

  return createError({ statusCode: 422, statusMessage: 'Invalid table' })
})
