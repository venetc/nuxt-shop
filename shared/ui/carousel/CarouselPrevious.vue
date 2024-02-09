<script setup lang="ts">
import { useCarousel } from './useCarousel'

import { ArrowLeftIcon } from '@radix-icons/vue'

import type { WithClassAsProps } from './interface'

import { cn } from '@/shared/lib/utils'

const props = defineProps<WithClassAsProps>()

const { orientation, canScrollPrev, scrollPrev } = useCarousel()
</script>

<template>
  <SharedButton :disabled="!canScrollPrev"
                :class="cn(
                  'touch-manipulation absolute h-8 w-8 rounded-full p-0',
                  orientation === 'horizontal'
                    ? '-left-12 top-1/2 -translate-y-1/2'
                    : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                  props.class,
                )"
                variant="outline"
                @click="scrollPrev"
  >
    <slot>
      <ArrowLeftIcon class="h-4 w-4 text-current" />
    </slot>
  </SharedButton>
</template>
