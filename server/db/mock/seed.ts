import { useGeneratedData } from './generate'

import * as schema from '../schema'

import type { DBClient } from '../client'

const generatedData = useGeneratedData()

export async function seedСategories(db: DBClient) {
  await db.delete(schema.categories).execute()

  return await db.insert(schema.categories).values(generatedData.categories).returning().all()
}

export async function seedGlobalColors(db: DBClient) {
  await db.delete(schema.globalColors).execute()

  return await db.insert(schema.globalColors).values(generatedData.globalColors).returning().all()
}

export async function seedProducts(db: DBClient) {
  await db.delete(schema.products).execute()

  const categories = await db.select({ id: schema.categories.id }).from(schema.categories).all()

  const products = generatedData.createProducts(categories)

  return await db.insert(schema.products).values(products).returning().all()
}

export async function seedSizes(db: DBClient) {
  await db.delete(schema.sizes).execute()

  return await db.insert(schema.sizes).values(generatedData.sizes).returning().all()
}

export async function seedGlobalColorsOfProducts(db: DBClient) {
  await db.delete(schema.globalColorsOfProducts).execute()

  const products = await db.select({ id: schema.products.id, image: schema.products.image }).from(schema.products).all()
  const globalColors = await db.select().from(schema.globalColors).all()

  const globalColorsOfProducts = generatedData.createColorsToProductsRelations(products, globalColors)

  return await db.insert(schema.globalColorsOfProducts).values(globalColorsOfProducts).execute()
}
export async function seedSizesOfProducts(db: DBClient) {
  await db.delete(schema.sizesOfProducts).execute()

  const products = await db.select({ id: schema.products.id, stockAmount: schema.products.stockAmount }).from(schema.products).all()
  const sizes = await db.select({ id: schema.sizes.id }).from(schema.sizes).all()

  const sizesToProducts = generatedData.createSizesToProductsRelations(products, sizes)

  return await db.insert(schema.sizesOfProducts).values(sizesToProducts).execute()
}
