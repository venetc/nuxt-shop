import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'
import type { ProductDetails } from '~/server/utils/productDTO'

export function useProductSEO(productDetails: MaybeRefOrGetter<ProductDetails | null>) {
  const product = toValue(productDetails)

  if (!product) return

  const { t, locale } = useI18n()

  const seoTitle = computed(() => `${product.name} ${t('common.by')} ${product.category.name}`)
  const seoDescription = computed(() => locale.value === 'ru' ? product.description.ru : product.description.en)
  const seoSiteName = computed(() => t('common.siteName'))
  const seoLocale = computed(() => locale.value === 'ru' ? 'ru_RU' : 'en_US')

  useSeoMeta({
    title: () => seoTitle.value,
    description: () => seoDescription.value,
  })

  useHead({
    meta: [
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:image', content: product.image },
      { property: 'og:image:alt', content: seoTitle },
      { property: 'og:image:width', content: 322 },
      { property: 'og:image:height', content: 112 },
      { property: 'og:type', content: 'website' },
      { property: 'og:site:name', content: seoSiteName },
      { property: 'og:locale', content: seoLocale },
    ],
  })
}
