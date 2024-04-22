<script setup lang="ts">
const { data: categories } = useFetch('/api/v1/categories', {
  key: 'categories',
  watch: false,
})
</script>

<template>
  <div class="space-y-5 py-5 pb-10 px-3">
    <div class="font-rubik font-light grid gap-4 grid-cols-5 w-full max-w-screen-2xl mx-auto">
      <NuxtLink v-for="{ id, name, logo } in categories"
                :key="id"
                class="bg-white rounded-md shadow-md flex flex-nowrap items-center px-5 py-2 hover:shadow-lg transition-shadow ease-linear"
                :to="{ name: 'categories-id', params: { id } }"
      >
        <div class="w-20 aspect-square">
          <NuxtPicture class=""
                       :src="logo"
                       format="webp"
                       width="150"
                       height="150"
                       loading="lazy"
                       decoding="async"
                       :imgAttrs="{ class: 'w-full h-full object-cover' }"
          />
        </div>
        <div class="text-center text-lg font-medium text-foreground font-rubik flex-1">
          {{ name }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
