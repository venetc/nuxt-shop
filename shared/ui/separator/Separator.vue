<script setup lang="ts">
import { Separator, type SeparatorProps } from 'radix-vue'

import { cn } from '@/shared/lib/utils'

const props = defineProps<SeparatorProps & { class?: string }>()
</script>

<template>
  <Separator :class="cn('shrink-0 bg-navy-200', props.class, props.orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full')" />
</template>
