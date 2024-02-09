import type { CategoriesInsert, GlobalColorSelect, ProductsSelect, SizeSelect } from '../db/schema'

export type ProductDetailsDTO = ProductsSelect &
  { sizes: { size: SizeSelect, stockAmount: number }[] } &
  { globalColors: { globalColor: GlobalColorSelect }[] } &
  { category: Pick<CategoriesInsert, 'id' | 'name'> }

export type ProductDetails = ReturnType<typeof normalizeProductDetails>
export type ProductSize = ReturnType<typeof normalizeSizes>[number]
export interface ProductColor { hex: string }

// TEMP
export type Product = ProductDetails

export function normalizeProductDetails(product: ProductDetailsDTO) {
  const {
    id,
    name,
    slug,
    category,
    descriptionEnglish,
    descriptionRussian,
    stockAmount,
    fullPrice,
    discountPrice,
    image,
    categoryId,
    rating,
    sortIndex,
    globalColors,
    sizes,
    productColors,
  } = product

  return {
    id,
    name,
    slug,
    category: {
      id: category.id,
      name: category.name,
    },
    description: {
      en: descriptionEnglish,
      ru: descriptionRussian,
    },
    stockAmount,
    fullPrice,
    discountPrice,
    discountPercent: calcDicsountPercent({ fullPrice, discountPrice }),
    image,
    categoryId,
    rating,
    sortIndex,
    colors: normalizeColors(productColors),
    globalColors: normalizeGlobalColors(globalColors),
    sizes: normalizeSizes(sizes),
  }
}

function normalizeSizes(sizes: { size: SizeSelect, stockAmount: number }[]) {
  return sizes.map(({ size, stockAmount }) => ({
    id: size.id,
    size: size.size,
    stockAmount,
  }))
}

function normalizeColors(colors: ProductDetailsDTO['productColors']): ProductColor[] {
  if (!colors || !Array.isArray(colors)) return []

  return colors
}

function normalizeGlobalColors(colors: { globalColor: GlobalColorSelect }[]) {
  return colors.map(({ globalColor }) => ({
    id: globalColor.id,
    hex: globalColor.hex,
  }))
}

function calcDicsountPercent({ fullPrice, discountPrice }: { fullPrice: number, discountPrice: number | null }) {
  if (!discountPrice) return null

  return Math.round(((fullPrice - discountPrice) / fullPrice) * 100)
}
