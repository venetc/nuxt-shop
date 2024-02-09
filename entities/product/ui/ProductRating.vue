<script setup lang="ts">
const props = defineProps<{
  rating: number
}>()

const { rating } = toRefs(props)

const MAX_RATING = 5

const hasReminder = computed(() => rating.value % 1 !== 0)
const ratingInt = computed(() => Math.floor(rating.value))
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-1 w-fit">
    <div v-if="ratingInt !== MAX_RATING"
         class="col-start-1 row-start-1 flex gap-x-0.5"
    >
      <Icon v-for="i in MAX_RATING"
            :key="i"
            name="iconamoon:star-fill"
            class="text-navy-100"
            size="20"
      />
    </div>
    <div class="col-start-1 row-start-1 flex gap-x-0.5">
      <Icon v-for="i in ratingInt"
            :key="i"
            name="iconamoon:star-fill"
            class="text-yellow-400"
            size="20"
      />
      <Icon v-if="hasReminder"
            name="iconamoon:star-fill"
            class="text-yellow-400"
            :style="{ clipPath: 'inset(0 50% 0 0)' }"
            size="20"
      />
    </div>
  </div>
</template>
