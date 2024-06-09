<script setup lang="ts">
const props = defineProps<{
  price: number
  type?: 'accent' | 'default'
  strikeThrough?: boolean
}>()

const { type, strikeThrough } = toRefs(props)

const classes = computed(() => ([
  'text-2xl',
  type.value === 'accent' ? 'text-red-600' : 'text-navy-600',
  strikeThrough.value ? 'line-through decoration-2 text-opacity-50' : '',
]))
</script>

<template>
  <div class="font-nunito leading-none font-semibold"
       :class="classes"
  >
    {{ price }} &#8381;
  </div>
</template>
