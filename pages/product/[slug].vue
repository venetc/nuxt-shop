<script setup lang="ts">
const { params: { slug } } = useRoute()

const productStore = useProductStore()
await productStore.fetchProduct(Array.isArray(slug) ? slug[0] : slug)

const { product, error } = storeToRefs(productStore)

if (error.value) {
  showError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
  })
}
</script>

<template>
  <div class="text-3xl">
    <div v-if="product" class="text-sm whitespace-break-spaces">
      <pre class="whitespace-break-spaces">Data: {{ product }}</pre>
    </div>
    <div v-else>
      Error: {{ error }}
    </div>
    <div>Slug: {{ slug }}</div>
  </div>
</template>
