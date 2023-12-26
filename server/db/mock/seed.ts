import { useGeneratedData } from './generate'

import * as schema from '../schema'

import type { DBClient } from '../client'

const generatedData = useGeneratedData()

export async function seedСategories(db: DBClient) {
  await db.delete(schema.categories).execute()

  return await db.insert(schema.categories).values(generatedData.categories).returning().all()
}

export async function seedColors(db: DBClient) {
  await db.delete(schema.colors).execute()

  return await db.insert(schema.colors).values(generatedData.colors).returning().all()
}

export async function seedProducts(db: DBClient) {
  await db.delete(schema.products).execute()

  const categories = await db.select({ id: schema.categories.id }).from(schema.categories).all()

  const mappedProductsToCategories = generatedData.mapProductsToCategories(categories)

  return await db.insert(schema.products).values(mappedProductsToCategories).returning().all()
}

export async function seedSizes(db: DBClient) {
  await db.delete(schema.sizes).execute()

  return await db.insert(schema.sizes).values(generatedData.sizes).returning().all()
}

export async function seedColorsOfProducts(db: DBClient) {
  await db.delete(schema.colorsOfProducts).execute()

  const products = await db.select({ id: schema.products.id, image: schema.products.image }).from(schema.products).all()
  const colors = await db.select().from(schema.colors).all()

  const mappedColorsToProducts = generatedData.mapColorsToProducts(products, colors)

  return await db.insert(schema.colorsOfProducts).values(mappedColorsToProducts).execute()
}
export async function seedSizesOfProducts(db: DBClient) {
  await db.delete(schema.sizesOfProducts).execute()

  const products = await db.select({ id: schema.products.id }).from(schema.products).all()
  const sizes = await db.select({ id: schema.sizes.id }).from(schema.sizes).all()

  const mappedSizesToProducts = generatedData.mapSizesToProducts(products, sizes)

  return await db.insert(schema.sizesOfProducts).values(mappedSizesToProducts).execute()
}
