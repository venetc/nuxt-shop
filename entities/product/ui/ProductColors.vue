<script setup lang="ts">
import type { ProductColor } from '~/server/utils/productDTO'

defineProps<{ colors: ProductColor[] }>()
</script>

<template>
  <div class="flex gap-1">
    <div v-for="color in colors"
         :key="color.hex"
         class="w-8 h-8 rounded-full shadow-sm"
         :style="{
           background: `linear-gradient(145deg, ${shadeHexColor(color.hex, 0.85)}, ${shadeHexColor(color.hex, 1.15)})`,
         }"
    />
  </div>
</template>
