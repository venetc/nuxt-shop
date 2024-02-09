export async function useProductDetailsFetch(slug: string) {
  const { data, error, execute } = await useAsyncData(
    `product-${slug}`,
    () => $fetch(`/api/v1/products/${slug}`),
  )

  if (error.value) {
    showError({
      statusCode: error.value.statusCode,
      statusMessage: error.value.statusMessage,
    })
  }

  const product = computed(() => data.value)

  return { product, fetchProduct: execute }
}
