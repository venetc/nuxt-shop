import jsonDescriptions from '../json/descriptions.json' assert { type: 'json' }
import jsonCategories from '../json/brands.json' assert { type: 'json' }
import jsonSizes from '../json/sizes.json' assert { type: 'json' }
import jsonProducts from '../json/models.json' assert { type: 'json' }
import jsonGroups from '../json/groups.json' assert { type: 'json' }
import jsonImages from '../json/images.json' assert { type: 'json' }
import jsonPostfixes from '../json/postfixes.json' assert { type: 'json' }

import type { CategoriesInsert, CategoriesSelect, ColorInsert, ColorSelect, ProductsInsert, ProductsSelect, SizeInsert, SizeSelect } from '~/server/db/schema'

import { getLoopedIndexItem, sample, shuffleInPlace } from '~/shared/lib/array'
import { maybeValue, randomFloatInclusive, randomNumberInRangeInclusive } from '~/shared/lib/random'
import { roundToNearest } from '~/shared/lib/number'
import { toSlug } from '~/shared/lib/string'

export function useGeneratedData() {
  const shuffledIndexes = shuffleInPlace(Array.from({ length: jsonProducts.length }, (_, index) => index))
  const colors: ColorInsert[] = jsonGroups.map((group: typeof jsonGroups[number]) => ({ hex: group.group_lead_color.hex }))
  const categories: CategoriesInsert[] = jsonCategories.map((category: typeof jsonCategories[number]) => ({ name: category }))
  const sizes: SizeInsert[] = jsonSizes.map(({ size }: typeof jsonSizes[number]) => ({ size }))

  const createProducts = (partialCategories: Pick<CategoriesSelect, 'id'>[]) => {
    const products: ProductsInsert[] = jsonProducts.map((product: typeof jsonProducts[number], index: number) => {
      const discountPriceRaw = maybeValue(() => randomNumberInRangeInclusive(2_000, 4_000), { probability: 0.25 })
      const discountPrice = discountPriceRaw ? roundToNearest(discountPriceRaw, 100) : null
      const fullPriceRaw = randomNumberInRangeInclusive(4_500, 10_000)
      const fullPrice = roundToNearest(fullPriceRaw, 100)
      const stockAmount = randomNumberInRangeInclusive(0, 100)
      const rating = maybeValue(() => roundToNearest(randomFloatInclusive(2, 5), 0.5), { probability: 0.75 }) ?? 5
      const description = getLoopedIndexItem(index, jsonDescriptions)
      const image = getLoopedIndexItem(index, jsonImages).image
      const name = `${product} ${getLoopedIndexItem(index, jsonPostfixes)}`
      const slug = toSlug(name)
      const sortIndex = shuffledIndexes[index]
      const categoryId = getLoopedIndexItem(index, partialCategories).id

      return { description, image, name, rating, stockAmount, discountPrice, fullPrice, slug, sortIndex, categoryId }
    })

    return products
  }

  const createColorsToProductsRelations = (products: Pick<ProductsSelect, 'id' | 'image'>[], colors: ColorSelect[]) => {
    const colorsOfProducts: { productId: ProductsSelect['id'], colorId: ColorSelect['id'] }[] = []

    const groupsDict = createColorGroupsDictionary(jsonGroups)
    const productsDict = createProductsDictionary(products)
    const colorsDict = createColorsDictionary(colors)

    for (const [hexFromDict, imagesFromDict] of groupsDict) {
      const colorId = colorsDict.get(hexFromDict)

      if (!colorId) continue

      for (const image of imagesFromDict) {
        const insertedProductsIds = productsDict.get(image)

        if (!insertedProductsIds) continue

        for (const productId of insertedProductsIds) {
          colorsOfProducts.push({ productId, colorId })
        }
      }
    }

    return colorsOfProducts
  }

  const createSizesToProductsRelations = (productsIds: Pick<ProductsSelect, 'id'>[], sizesIds: Pick<SizeSelect, 'id'>[]) => {
    const sizesOfProducts: { productId: ProductsSelect['id'], sizeId: SizeSelect['id'] }[] = []

    for (const product of productsIds) {
      const amount = maybeValue(() => randomNumberInRangeInclusive(1, sizes.length), { probability: 0.75 }) ?? sizes.length
      const concreteSizes = sample(sizesIds, amount)

      for (const size of concreteSizes) {
        sizesOfProducts.push({ productId: product.id, sizeId: size.id })
      }
    }

    return sizesOfProducts
  }

  return { colors, categories, sizes, createProducts, createColorsToProductsRelations, createSizesToProductsRelations }
}

function createColorGroupsDictionary(groups: typeof jsonGroups) {
  const groupsDict = new Map<ColorSelect['hex'], ProductsSelect['image'][]>()

  for (const group of groups) {
    const groupsArray = groupsDict.get(group.group_lead_color.hex) ?? []

    for (const imageObject of group.images_in_group) {
      groupsArray.push(imageObject.image)
    }

    groupsDict.set(group.group_lead_color.hex, groupsArray)
  }

  return groupsDict
}

function createProductsDictionary(partialProducts: Pick<ProductsSelect, 'id' | 'image'>[]) {
  const productsDict = new Map<ProductsSelect['image'], ProductsSelect['id'][]>()

  for (const product of partialProducts) {
    const productsArray = productsDict.get(product.image) ?? []

    productsArray.push(product.id)

    productsDict.set(product.image, productsArray)
  }

  return productsDict
}

function createColorsDictionary(colors: ColorSelect[]) {
  const colorsDict = new Map<ColorSelect['hex'], ColorSelect['id']>()

  for (const color of colors) {
    colorsDict.set(color.hex, color.id)
  }

  return colorsDict
}
