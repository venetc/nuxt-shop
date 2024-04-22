<script setup lang="ts">
import type { QuerySchema } from '~/server/api/v1/products/index.get'

definePageMeta({ layout: 'default' })

const query: Ref<QuerySchema> = ref({
  categoryId: undefined,
  colorId: undefined,
  order: undefined,
  orderBy: undefined,
  page: '1',
  pageSize: '12',
  priceMax: undefined,
  priceMin: undefined,
  sizeId: undefined,
})

const category = {
  transformGetter: () => {
    if (Array.isArray(query.value.categoryId)) return query.value.categoryId.join(' ')
    return query.value.categoryId
  },
  transformSetter: (value: string | undefined) => {
    if (!value) query.value.categoryId = undefined
    else if (!Array.isArray(value)) {
      const v = value.split(' ').filter(v => Boolean(v) && !Number.isNaN(+v))
      query.value.categoryId = v.length > 1 ? v : v[0]
    }
  },
}

const categoryId = computed({
  get: category.transformGetter,
  set: category.transformSetter,
})

const priceMin = computed({
  get: () => query.value.priceMin,
  set: (value) => {
    const stringValue = value?.toString()
    query.value.priceMin = stringValue && stringValue.length > 0 ? stringValue : undefined
  },
})
const priceMax = computed({
  get: () => query.value.priceMax,
  set: (value) => {
    const stringValue = value?.toString()
    query.value.priceMax = stringValue && stringValue.length > 0 ? stringValue : undefined
  },
})

const { data, execute } = useFetch('/api/v1/products', {
  query,
  watch: false,
})

watchDebounced(query.value, () => {
  execute()
}, { debounce: 500 })
</script>

<template>
  <div class="space-y-5 py-5 pb-10 px-3">
    <div>Query: {{ query }}</div>
    <div class="max-w-md px-1.5 py-1.5 rounded-md bg-white space-y-2">
      <div class="flex items-center justify-between">
        <div>Category id:</div>
        <SharedInput v-model.trim="categoryId"
                     class="max-w-xs"
        />
      </div>
      <div class="flex items-center bg-white justify-between ">
        <div>Price min:</div>
        <SharedInput v-model.trim="priceMin"
                     type="number"
                     class="max-w-xs"
        />
      </div>
      <div class="flex items-center bg-white justify-between ">
        <div>Price max:</div>
        <SharedInput v-model.trim="priceMax"
                     type="number"
                     class="max-w-xs"
        />
      </div>
    </div>
    <SharedSeparator />
    <div v-if="data"
         class="flex flex-col space-y-3"
    >
      <div class="font-nunito text-lg">
        Response meta: {{ data.meta }}
      </div>
      <div class="font-rubik font-light grid gap-2 grid-cols-6 text-sm">
        <NuxtLink v-for="product in data.data"
                  :key="product.id"
                  class="bg-white pt-2 rounded-md shadow-md overflow-hidden"
                  :to="{ name: 'products-slug', params: { slug: product.slug } }"
        >
          <div class="flex space-x-3 px-3">
            <div class="font-medium">
              Id:
            </div>
            <div>{{ product.id }}</div>
          </div>
          <div class="flex space-x-3 px-3">
            <div class="font-medium">
              Sort index:
            </div>
            <div>{{ product.sortIndex }}</div>
          </div>
          <div class="flex space-x-3 px-3">
            <div class="font-medium">
              Category ID:
            </div>
            <div>{{ product.categoryId }}</div>
          </div>
          <div class="flex space-x-3 px-3">
            <div class="font-medium">
              Name:
            </div>
            <div>{{ product.name }}</div>
          </div>
          <div class="flex space-x-3 px-3">
            <div class="font-medium">
              Full price:
            </div>
            <div>{{ product.fullPrice }}</div>
          </div>
          <div class="flex space-x-3 px-3">
            <div class="font-medium">
              Discount price:
            </div>
            <div>{{ product.discountPrice ?? '-' }}</div>
          </div>
          <div class="flex space-x-3 px-3">
            <div class="font-medium">
              Stock amount:
            </div>
            <div>{{ product.stockAmount }}</div>
          </div>
          <div class="flex space-x-3 px-3">
            <div class="font-medium">
              Rating:
            </div>
            <div>{{ product.rating }}</div>
          </div>
          <NuxtImg class="mt-2 object-cover w-full aspect-video"
                   :src="product.image"
                   placeholder
                   width="300"
                   height="170"
                   loading="lazy"
                   decoding="async"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
