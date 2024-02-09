<script setup lang="ts">
import type { ProductSize } from '~/server/utils/productDTO'

const props = defineProps<{
  availableSizes: ProductSize[]
  highlighted?: boolean
}>()

const availableSizesMap = new Map(props.availableSizes.map(size => [size.id, size]))

const { data } = useFetch('/api/v1/sizes', {
  key: 'product-sizes',
  watch: false,
})

const sizes = computed(() => {
  if (!data.value) return []

  return data.value.sizes.map(size => ({ ...size, stockAmount: availableSizesMap.get(size.id)?.stockAmount ?? 0 }))
})

const selectedSizeId = ref<number>()

function handleKeyPress(event: KeyboardEvent, size: ProductSize) {
  event.preventDefault()

  selectedSizeId.value = size.id
}
</script>

<template>
  <div :class="{ 'shadow-lg -translate-y-0.5': highlighted }"
       class="grid grid-cols-6 gap-1.5 px-2 py-2 rounded-md max-w-sm transition-[box-shadow,transform] ease-linear max-sm:grid-cols-4"
  >
    <label v-for="entity in sizes"
           :key="entity.id"
           :tabindex="entity.stockAmount === 0 ? -1 : 0"
           :class="cn(
             'border rounded-md h-9 flex items-center justify-center font-fira text-foreground outline-none leading-none transition-all',
             'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ring-offset-2',
             entity.stockAmount === 0 ? 'opacity-30 cursor-not-allowed  border-foreground/30' : 'cursor-pointer border-foreground',
             selectedSizeId === entity.id ? 'bg-navy-600 border-navy-600 text-white' : '',
           )"
           role="radio"
           @keypress.enter.space="$event => handleKeyPress($event, entity)"
    >
      <input v-model="selectedSizeId"
             type="radio"
             name="size"
             :value="entity.id"
             tabindex="-1"
             :disabled="entity.stockAmount === 0"
             class="sr-only"
      >

      <span>{{ entity.size }}</span>
    </label>
  </div>
</template>
