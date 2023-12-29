<script setup lang="ts">
const app = useNuxtApp()

const { params: { slug } } = useRoute()
const { data, error } = await useFetch(`/api/v1/products/${slug}`, {
  key: `product-${slug}`,
  transform: fetchEntity => ({ fetchEntity, fetchedAt: Date.now() }),
  getCachedData: (key) => {
    const data = app.payload.data[key] ?? app.static.data[key]

    if (!data) return

    const expirationDate = new Date(data.fetchedAt).setTime(data.fetchedAt + 30 * 1000) // 30 seconds

    if (expirationDate < Date.now()) return

    return data
  },
})

if (error.value) {
  showError({ statusCode: error.value.statusCode, statusMessage: error.value.statusMessage })
}
</script>

<template>
  <div class="text-3xl">
    <pre class="text-sm whitespace-break-spaces">Data: {{ data.fetchEntity }}</pre>
    <div>Error: {{ error }}</div>
    <div>Slug: {{ slug }}</div>
  </div>
</template>
