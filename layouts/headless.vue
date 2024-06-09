<script setup lang="ts">
import { ConfigProvider } from 'radix-vue'

const useIdFunction = () => useId()
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <ConfigProvider :use-id="useIdFunction">
      <header class="sticky top-0 z-50 w-full px-3">
        <div class="flex h-14 items-center">
          <LanguageChanger class="ml-auto" />
        </div>
      </header>
      <main class="flex-1">
        <slot />
      </main>
    </ConfigProvider>
  </div>
</template>
