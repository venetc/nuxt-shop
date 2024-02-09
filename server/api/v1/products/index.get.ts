import { z } from 'zod'
import { and, asc, count, desc, eq, gte, inArray, lte, or } from 'drizzle-orm'

import type { SQL } from 'drizzle-orm'

import * as schema from '@/server/db/schema'
import { useDBClient } from '~/server/db/client'

const querySchema = z
  .object({
    categoryId: z.string().or(z.array(z.string())).optional(),
    sizeId: z.string().or(z.array(z.string())).optional(),
    colorId: z.string().or(z.array(z.string())).optional(),
    order: z.enum(['asc', 'desc'], { errorMap: () => ({ message: 'Invalid sort order, use "asc" or "desc"' }) }).optional(),
    orderBy: z.enum(['name', 'fullPrice', 'rating'], { errorMap: () => ({ message: 'Invalid sort parameter, use "name", "fullPrice" or "rating"' }) }).optional(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
    priceMin: z.string().optional(),
    priceMax: z.string().optional(),
  })
  .refine((data) => {
    return data.priceMin && data.priceMax ? +data.priceMin <= +data.priceMax : true
  }, {
    message: 'Minimum price must be less than maximum price',
  })

export type QuerySchema = z.infer<typeof querySchema>

const db = useDBClient()

export default cachedEventHandler(async (event) => {
  const validateQuery = await getValidatedQuery(event, querySchema.safeParse)

  if (!validateQuery.success) {
    throw createError({
      statusCode: 400,
      message: parseZodError(validateQuery.error),
      statusMessage: parseZodError(validateQuery.error),
    })
  }

  const { categoryId, colorId, sizeId, order, orderBy, ...query } = validateQuery.data

  let pageSize = query.pageSize ? +query.pageSize : -1
  const page = query.page ? +query.page : 1

  const categoryIdsArray = Array.isArray(categoryId) ? categoryId : [categoryId]
  const categoryIds = categoryIdsArray.filter((id): id is string => id !== 'undefined' && !Number.isNaN(Number(id))).map(Number)
  const categoryCondition = or(...categoryIds.map(id => eq(schema.products.categoryId, id)))

  const colorIdsArray = Array.isArray(colorId) ? colorId : [colorId]
  const colorIds = colorIdsArray.filter((id): id is string => id !== 'undefined' && !Number.isNaN(Number(id))).map(Number)
  const colorCondition = or(...colorIds.map(id => eq(schema.globalColorsOfProducts.globalColorId, id)))

  const sizeIdsArray = Array.isArray(sizeId) ? sizeId : [sizeId]
  const sizeIds = sizeIdsArray.filter((id): id is string => id !== 'undefined' && !Number.isNaN(Number(id))).map(Number)
  const sizeCondition = or(...sizeIds.map(id => eq(schema.sizesOfProducts.sizeId, id)))

  const priceMin = !!query.priceMin && !Number.isNaN(+query.priceMin) ? +query.priceMin : 0
  const priceMax = !!query.priceMax && !Number.isNaN(+query.priceMax) ? +query.priceMax : undefined
  const minPriceCcondition = or(gte(schema.products.fullPrice, priceMin), gte(schema.products.discountPrice, priceMin))
  const maxPriceCcondition = priceMax ? or(lte(schema.products.fullPrice, priceMax), lte(schema.products.discountPrice, priceMax)) : undefined

  const colorSubquery = db
    .select({ id: schema.globalColorsOfProducts.productId })
    .from(schema.globalColorsOfProducts)
    .where(colorCondition)

  const sizeSubquery = db
    .select({ id: schema.sizesOfProducts.productId })
    .from(schema.sizesOfProducts)
    .where(sizeCondition)

  const conditions = and(
    categoryCondition,
    minPriceCcondition,
    maxPriceCcondition,
    inArray(schema.products.id, colorSubquery),
    inArray(schema.products.id, sizeSubquery),
  )

  const withConditions = <T extends typeof queryBuilder>(qb: T, conditions: SQL<unknown> | undefined) => {
    return qb.where(conditions)
  }
  const withOrder = <T extends typeof queryBuilder>(qb: T, order: QuerySchema['order'], orderBy: QuerySchema['orderBy']) => {
    let ob

    switch (orderBy) {
      case 'name':{
        ob = schema.products.name
        break
      }
      case 'fullPrice':{
        ob = schema.products.fullPrice
        break
      }
      case 'rating': {
        ob = schema.products.rating
        break
      }
      default: {
        ob = schema.products.sortIndex
      }
    }

    return qb.orderBy(order === 'asc' ? asc(ob) : desc(ob))
  }
  const withPagination = <T extends typeof queryBuilder>(qb: T, page: number, page_size: number) => {
    return qb.limit(page_size).offset((page - 1) * page_size)
  }

  let queryBuilder = db.select().from(schema.products).$dynamic()

  queryBuilder = withConditions(queryBuilder, conditions)
  queryBuilder = withPagination(queryBuilder, page, pageSize)
  queryBuilder = withOrder(queryBuilder, order, orderBy)

  const [countResult] = await db
			  .select({ count: count() })
			  .from(schema.products)
			  .where(conditions)

  const amount = countResult ? +countResult.count : 0
  pageSize = pageSize < 0 ? amount : pageSize
  const totalPage = Math.ceil(amount / pageSize) <= 0 ? 1 : Math.ceil(amount / pageSize)

  const meta = {
    page: page <= 0 ? 1 : page,
    pageSize: pageSize > amount ? amount : pageSize,
    totalPage,
  }

  const data = await queryBuilder.execute()

  return {
    meta,
    data,
  }
})
