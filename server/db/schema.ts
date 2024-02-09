import { relations } from 'drizzle-orm'
import { int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const TablesKeys = ['categories', 'products', 'global_colors', 'sizes', 'global_colors_of_products', 'sizes_of_products'] as const
export type TablesTuple = typeof TablesKeys
export type Table = TablesTuple[number]

export const categories = sqliteTable('categories', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
  logo: text('logo').notNull(),
  descriptionEnglish: text('description_en').notNull(),
  descriptionRussian: text('description_ru').notNull(),
})

export const globalColors = sqliteTable('global_colors', {
  id: int('id').primaryKey({ autoIncrement: true }),
  hex: text('hex').unique().notNull(),
})

export const products = sqliteTable('products', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  descriptionEnglish: text('description_en').notNull(),
  descriptionRussian: text('description_ru').notNull(),
  stockAmount: int('stock_amount').notNull().default(0),
  fullPrice: int('full_price').notNull(),
  discountPrice: int('discount_price'),
  image: text('image').notNull(),
  slug: text('slug').unique().notNull(),
  categoryId: int('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  rating: int('rating'),
  sortIndex: int('sort_index').notNull().default(0),
  productColors: text('product_colors', { mode: 'json' }).notNull(),
})

export const sizes = sqliteTable('sizes', {
  id: int('id').primaryKey({ autoIncrement: true }),
  size: int('size').notNull(),
})

export const globalColorsOfProducts = sqliteTable('global_colors_of_products', {
  productId: int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  globalColorId: int('global_color_id').notNull().references(() => globalColors.id, { onDelete: 'cascade' }),
}, ({ productId, globalColorId }) => ({
  pk: primaryKey({ columns: [productId, globalColorId] }),
}))

export const sizesOfProducts = sqliteTable('sizes_of_products', {
  productId: int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sizeId: int('size_id').notNull().references(() => sizes.id, { onDelete: 'cascade' }),
  stockAmount: int('stock_amount').notNull().default(0),
}, ({ productId, sizeId }) => ({
  pk: primaryKey({ columns: [productId, sizeId] }),
}))

export const globalColorsRelations = relations(globalColors, ({ many }) => ({
  products: many(globalColorsOfProducts),
}))

export const sizesRelations = relations(sizes, ({ many }) => ({
  products: many(sizesOfProducts),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  globalColors: many(globalColorsOfProducts),
  sizes: many(sizesOfProducts),
}))

export const colorsOfProductsRelations = relations(globalColorsOfProducts, ({ one }) => ({
  product: one(products, {
    fields: [globalColorsOfProducts.productId],
    references: [products.id],
  }),
  globalColor: one(globalColors, {
    fields: [globalColorsOfProducts.globalColorId],
    references: [globalColors.id],
  }),
}))

export const sizesOfProductsRelations = relations(sizesOfProducts, ({ one }) => ({
  product: one(products, {
    fields: [sizesOfProducts.productId],
    references: [products.id],
  }),
  size: one(sizes, {
    fields: [sizesOfProducts.sizeId],
    references: [sizes.id],
  }),
}))

export type ProductsInsert = typeof products.$inferInsert
export type ProductsSelect = typeof products.$inferSelect

export type CategoriesInsert = typeof categories.$inferInsert
export type CategoriesSelect = typeof categories.$inferSelect

export type GlobalColorInsert = typeof globalColors.$inferInsert
export type GlobalColorSelect = typeof globalColors.$inferSelect

export type SizeInsert = typeof sizes.$inferInsert
export type SizeSelect = typeof sizes.$inferSelect

export type SizesOfModelInsert = typeof sizesOfProducts.$inferInsert
export type SizesOfModelSelect = typeof sizesOfProducts.$inferSelect

export type ColorsOfProductsInsert = typeof globalColorsOfProducts.$inferInsert
export type ColorsOfProductsSelect = typeof globalColorsOfProducts.$inferSelect
