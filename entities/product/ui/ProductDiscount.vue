<script setup lang="ts">
const props = defineProps<{
  percent: number
}>()
</script>

<template>
  <div class="leading-none font-nunito overflow-hidden">
    <div class="bg-destructive text-destructive-foreground pt-1.5 pb-1 pl-3 pr-2 -skew-x-12 -translate-x-1">
      {{ props.percent * -1 }}%
    </div>
  </div>
</template>
