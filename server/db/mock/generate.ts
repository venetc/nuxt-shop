import type { BrandInsert, ColorInsert, ColorSelect, ModelInsert, ModelSelect, SizeInsert, SizeSelect } from '../schema'

import { getLoopedIndexItem, sample, shuffleInPlace } from '~/shared/lib/array'
import { maybeValue, randomFloatInclusive, randomNumberInRangeInclusive } from '~/shared/lib/random'
import { roundToNearest } from '~/shared/lib/number'
import { toSlug } from '~/shared/lib/string'

export async function useGeneratedData() {
  const { default: jsonDescriptions } = await import('./json/descriptions.json', { assert: { type: 'json' } })
  const { default: jsonSizes } = await import('./json/sizes.json', { assert: { type: 'json' } })
  const { default: jsonModels } = await import('./json/models.json', { assert: { type: 'json' } })
  const { default: jsonBrands } = await import('./json/brands.json', { assert: { type: 'json' } })
  const { default: jsonGroups } = await import('./json/groups.json', { assert: { type: 'json' } })
  const { default: jsonImages } = await import('./json/images.json', { assert: { type: 'json' } })
  const { default: jsonPostfixes } = await import('./json/postfixes.json', { assert: { type: 'json' } })
  const indexes = shuffleInPlace(Array.from({ length: jsonModels.length }, (_, index) => index))

  const colors: ColorInsert[] = jsonGroups.map((group: typeof jsonGroups[number]) => ({ hex: group.group_lead_color.hex }))

  const brands: BrandInsert[] = jsonBrands.map((brand: typeof jsonBrands[number]) => ({ name: brand }))

  const sizes: SizeInsert[] = jsonSizes.map(({ size }: typeof jsonSizes[number]) => ({ size }))

  const mapModelsToBrands = (brands: Pick<BrandInsert, 'id'>[]) => {
    const models: ModelInsert[] = jsonModels.map((model: typeof jsonModels[number], index: number) => {
      const discountPriceRaw = maybeValue(() => randomNumberInRangeInclusive(2_000, 4_000), { probability: 0.25 })
      const discountPrice = discountPriceRaw ? roundToNearest(discountPriceRaw, 100) : null
      const fullPriceRaw = randomNumberInRangeInclusive(4_500, 10_000)
      const fullPrice = roundToNearest(fullPriceRaw, 100)
      const stockAmount = randomNumberInRangeInclusive(0, 100)
      const rating = maybeValue(() => roundToNearest(randomFloatInclusive(2, 5), 0.5), { probability: 0.75 }) ?? 5
      const description = getLoopedIndexItem(index, jsonDescriptions)
      const image = getLoopedIndexItem(index, jsonImages).image
      const name = `${model} ${getLoopedIndexItem(index, jsonPostfixes)}`
      const slug = toSlug(name)
      const sortIndex = indexes[index]
      const brandId = getLoopedIndexItem(index, brands).id

      return { description, image, name, rating, stockAmount, discountPrice, fullPrice, slug, sortIndex, brandId }
    })

    return models
  }

  /* TODO reafctor to make pure (?) */
  const mapColorsToModels = (models: Pick<ModelSelect, 'id' | 'image'>[], colors: ColorSelect[]) => {
    const colorsOfModels: { modelId: ModelSelect['id'], colorId: ColorSelect['id'] }[] = []

    const groupsDict = new Map<ColorSelect['hex'], ModelSelect['image'][]>()
    const modelsDict = new Map<ModelSelect['image'], ModelSelect['id'][]>()
    const colorsDict = new Map<ColorSelect['hex'], ColorSelect['id']>()

    for (const group of jsonGroups) {
      const groupsArray = groupsDict.get(group.group_lead_color.hex) ?? []

      for (const imageObject of group.images_in_group) {
        groupsArray.push(imageObject.image)
      }

      groupsDict.set(group.group_lead_color.hex, groupsArray)
    }

    for (const model of models) {
      const modelsArray = modelsDict.get(model.image) ?? []

      modelsArray.push(model.id)

      modelsDict.set(model.image, modelsArray)
    }

    for (const color of colors) {
      colorsDict.set(color.hex, color.id)
    }

    for (const [hexFromDict, imagesFromDict] of groupsDict) {
      const colorId = colorsDict.get(hexFromDict)

      if (!colorId) continue

      for (const image of imagesFromDict) {
        const insertedModelIds = modelsDict.get(image)

        if (!insertedModelIds) continue

        for (const modelId of insertedModelIds) {
          colorsOfModels.push({ modelId, colorId })
        }
      }
    }

    return colorsOfModels
  }

  const mapSizesToModels = (modelsIds: Pick<ModelSelect, 'id'>[], sizesIds: Pick<SizeSelect, 'id'>[]) => {
    const sizesOfModels: { modelId: ModelSelect['id'], sizeId: SizeSelect['id'] }[] = []

    for (const model of modelsIds) {
      const amount = maybeValue(() => randomNumberInRangeInclusive(1, sizes.length), { probability: 0.75 }) ?? sizes.length
      const concreteSizes = sample(sizesIds, amount)

      for (const size of concreteSizes) {
        sizesOfModels.push({ modelId: model.id, sizeId: size.id })
      }
    }

    return sizesOfModels
  }

  return { colors, brands, sizes, mapModelsToBrands, mapColorsToModels, mapSizesToModels }
}
