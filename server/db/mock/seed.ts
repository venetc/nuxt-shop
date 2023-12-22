import { useGeneratedData } from './generate'

import * as schema from '../schema'

import type { DBClient } from '../client'

export async function seedBrands(db: DBClient) {
  await db.delete(schema.brands).execute()

  const generatedData = await useGeneratedData()

  return await db.insert(schema.brands).values(generatedData.brands).returning().all()
}

export async function seedColors(db: DBClient) {
  await db.delete(schema.colors).execute()

  const generatedData = await useGeneratedData()

  return await db.insert(schema.colors).values(generatedData.colors).returning().all()
}

export async function seedModels(db: DBClient) {
  await db.delete(schema.models).execute()

  const generatedData = await useGeneratedData()

  const brands = await db.select({ id: schema.brands.id }).from(schema.brands).all()

  const mappedModelsToBrands = generatedData.mapModelsToBrands(brands)

  return await db.insert(schema.models).values(mappedModelsToBrands).returning().all()
}

export async function seedSizes(db: DBClient) {
  await db.delete(schema.sizes).execute()

  const generatedData = await useGeneratedData()

  return await db.insert(schema.sizes).values(generatedData.sizes).returning().all()
}

export async function seedColorsOfModels(db: DBClient) {
  await db.delete(schema.colorsOfModels).execute()

  const generatedData = await useGeneratedData()

  const models = await db.select({ id: schema.models.id, image: schema.models.image }).from(schema.models).all()
  const colors = await db.select().from(schema.colors).all()

  const mappedColorsToModels = generatedData.mapColorsToModels(models, colors)

  return await db.insert(schema.colorsOfModels).values(mappedColorsToModels).execute()
}
export async function seedSizesOfModels(db: DBClient) {
  await db.delete(schema.sizesOfModels).execute()

  const generatedData = await useGeneratedData()

  const models = await db.select({ id: schema.models.id }).from(schema.models).all()
  const sizes = await db.select({ id: schema.sizes.id }).from(schema.sizes).all()

  const mappedSizesToModels = generatedData.mapSizesToModels(models, sizes)

  return await db.insert(schema.sizesOfModels).values(mappedSizesToModels).execute()
}
