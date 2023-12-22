import { relations } from 'drizzle-orm'
import { int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type Tables = 'brands' | 'colors' | 'models' | 'sizes' | 'colors_of_models' | 'sizes_of_models'

export const brands = sqliteTable('brands', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
})

export const colors = sqliteTable('colors', {
  id: int('id').primaryKey({ autoIncrement: true }),
  hex: text('hex').unique().notNull(),
})

export const models = sqliteTable('models', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  stockAmount: int('stock_amount').notNull().default(0),
  fullPrice: int('full_price').notNull(),
  discountPrice: int('discount_price'),
  image: text('image').notNull(),
  slug: text('slug').unique().notNull(),
  brandId: int('brand_id'),
  rating: int('rating'),
  sortIndex: int('sort_index').notNull().default(0),
})

export const sizes = sqliteTable('sizes', {
  id: int('id').primaryKey({ autoIncrement: true }),
  size: int('size').notNull(),
})

export const colorsOfModels = sqliteTable('colors_of_models', {
  modelId: int('model_id').notNull().references(() => models.id, { onDelete: 'cascade' }),
  colorId: int('color_id').notNull().references(() => colors.id, { onDelete: 'cascade' }),
}, ({ modelId, colorId }) => ({
  pk: primaryKey({ columns: [modelId, colorId] }),
}))

export const sizesOfModels = sqliteTable('sizes_of_models', {
  modelId: int('model_id').notNull().references(() => models.id, { onDelete: 'cascade' }),
  sizeId: int('size_id').notNull().references(() => sizes.id, { onDelete: 'cascade' }),
}, ({ modelId, sizeId }) => ({
  pk: primaryKey({ columns: [modelId, sizeId] }),
}))

export const colorsRelations = relations(colors, ({ many }) => ({
  models: many(colorsOfModels),
}))

export const sizesRelations = relations(sizes, ({ many }) => ({
  models: many(sizesOfModels),
}))

export const brandsRelations = relations(brands, ({ many }) => ({
  models: many(models),
}))

export const modelsRelations = relations(models, ({ one, many }) => ({
  brand: one(brands, {
    fields: [models.brandId],
    references: [brands.id],
  }),
  colors: many(colorsOfModels),
  sizes: many(sizesOfModels),
}))

export const colorsOfModelsRelations = relations(colorsOfModels, ({ one }) => ({
  model: one(models, {
    fields: [colorsOfModels.modelId],
    references: [models.id],
  }),
  color: one(colors, {
    fields: [colorsOfModels.colorId],
    references: [colors.id],
  }),
}))

export const sizesOfModelsRelations = relations(sizesOfModels, ({ one }) => ({
  model: one(models, {
    fields: [sizesOfModels.modelId],
    references: [models.id],
  }),
  size: one(sizes, {
    fields: [sizesOfModels.sizeId],
    references: [sizes.id],
  }),
}))

export type ModelInsert = typeof models.$inferInsert
export type ModelSelect = typeof models.$inferSelect

export type BrandInsert = typeof brands.$inferInsert
export type BrandSelect = typeof brands.$inferSelect

export type ColorInsert = typeof colors.$inferInsert
export type ColorSelect = typeof colors.$inferSelect

export type SizeInsert = typeof sizes.$inferInsert
export type SizeSelect = typeof sizes.$inferSelect

export type SizesOfModelInsert = typeof sizesOfModels.$inferInsert
export type SizesOfModelSelect = typeof sizesOfModels.$inferSelect

export type ColorsOfModelInsert = typeof colorsOfModels.$inferInsert
export type ColorsOfModelSelect = typeof colorsOfModels.$inferSelect
