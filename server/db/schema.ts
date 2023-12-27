import { relations } from 'drizzle-orm'
import { int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const TablesKeys = ['categories', 'products', 'colors', 'sizes', 'colors_of_products', 'sizes_of_products'] as const
export type TablesTuple = typeof TablesKeys
export type Table = TablesTuple[number]

export const categories = sqliteTable('categories', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
})

export const colors = sqliteTable('colors', {
  id: int('id').primaryKey({ autoIncrement: true }),
  hex: text('hex').unique().notNull(),
})

export const products = sqliteTable('products', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  stockAmount: int('stock_amount').notNull().default(0),
  fullPrice: int('full_price').notNull(),
  discountPrice: int('discount_price'),
  image: text('image').notNull(),
  slug: text('slug').unique().notNull(),
  categoryId: int('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  rating: int('rating'),
  sortIndex: int('sort_index').notNull().default(0),
})

export const sizes = sqliteTable('sizes', {
  id: int('id').primaryKey({ autoIncrement: true }),
  size: int('size').notNull(),
})

export const colorsOfProducts = sqliteTable('colors_of_products', {
  productId: int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  colorId: int('color_id').notNull().references(() => colors.id, { onDelete: 'cascade' }),
}, ({ productId, colorId }) => ({
  pk: primaryKey({ columns: [productId, colorId] }),
}))

export const sizesOfProducts = sqliteTable('sizes_of_products', {
  productId: int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sizeId: int('size_id').notNull().references(() => sizes.id, { onDelete: 'cascade' }),
}, ({ productId, sizeId }) => ({
  pk: primaryKey({ columns: [productId, sizeId] }),
}))

export const colorsRelations = relations(colors, ({ many }) => ({
  products: many(colorsOfProducts),
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
  colors: many(colorsOfProducts),
  sizes: many(sizesOfProducts),
}))

export const colorsOfProductsRelations = relations(colorsOfProducts, ({ one }) => ({
  product: one(products, {
    fields: [colorsOfProducts.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [colorsOfProducts.colorId],
    references: [colors.id],
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

export type ColorInsert = typeof colors.$inferInsert
export type ColorSelect = typeof colors.$inferSelect

export type SizeInsert = typeof sizes.$inferInsert
export type SizeSelect = typeof sizes.$inferSelect

export type SizesOfModelInsert = typeof sizesOfProducts.$inferInsert
export type SizesOfModelSelect = typeof sizesOfProducts.$inferSelect

export type ColorsOfProductsInsert = typeof colorsOfProducts.$inferInsert
export type ColorsOfProductsSelect = typeof colorsOfProducts.$inferSelect
