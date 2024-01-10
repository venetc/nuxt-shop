import type { ProductsSelect } from '~/server/db/schema'

export const useProductStore = defineStore('Entities/Product', () => {
  const slug = ref<string>('')
  const url = computed(() => `/api/v1/products/${slug.value}`)

  const { data, error, execute } = useFetch<{ data: ProductsSelect }>(
    url,
    {
      immediate: false,
      watch: false,
      key: `product-${slug.value}`,
    },
  )

  const product = computed(() => data.value?.data)

  const fetchProduct = (productSlug: string) => {
    slug.value = productSlug
    return execute()
  }

  return {
    product,
    error,
    fetchProduct,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
