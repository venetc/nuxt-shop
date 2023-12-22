import type { Tables } from '~/server/db/schema'

import { useDBClient } from '~/server/db/client'
import {
  seedBrands,
  seedColors,
  seedColorsOfModels,
  seedModels,
  seedSizes,
  seedSizesOfModels,
} from '~/server/db/mock/seed'

interface SeedBody { table: Tables }

export default defineEventHandler(async (event) => {
  const { table } = await readBody<SeedBody>(event)

  if (!table) return createError({ statusCode: 400, statusMessage: 'Empty body' })

  const db = useDBClient()

  if (table === 'brands') return { data: (await seedBrands(db)).length }
  if (table === 'colors') return { data: (await seedColors(db)).length }
  if (table === 'sizes') return { data: (await seedSizes(db)).length }
  if (table === 'models') return { data: (await seedModels(db)).length }

  if (table === 'colors_of_models') return { data: (await seedColorsOfModels(db)) }
  if (table === 'sizes_of_models') return { data: (await seedSizesOfModels(db)) }

  return createError({ statusCode: 422, statusMessage: 'Invalid table' })
})
