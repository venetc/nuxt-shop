<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <div class="min-h-screen grid place-items-center text-center">
        <div class="relative m-auto w-full max-w-xs justify-center bg-navy-50 shadow-lg h-auto rounded-md px-6 py-4 pb-5 space-y-3">
          <h2 class="flex flex-col font-nunito space-y-2">
            <span class="text-2xl text-navy-900">Something went wrong</span>
            <span class="text-lg text-red-500">{{ error?.message }}</span>
          </h2>
          <SharedButton @click="handleError">
            Go Home
          </SharedButton>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
