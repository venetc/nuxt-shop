<script setup lang="ts">
import { cn } from '@/shared/lib/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  error?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const attributes = useAttrs()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    :class="cn(
      'flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ring-offset-2 ring-offset-navy-100 disabled:cursor-not-allowed disabled:opacity-50',
      props.error ? 'border-red-200 bg-red-50 text-red-900 placeholder:text-red-900/25' : 'border-input bg-transparent text-navy-900 placeholder:text-navy-900/25',
    )"
    v-bind="attributes"
  >
</template>
