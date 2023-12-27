<template>
  <div class="relative flex min-h-screen flex-col">
    <header class="sticky top-0 z-50 w-full px-3">
      <div class="flex h-14 items-center">
        <FeatureLanguageChanger class="ml-auto" />
      </div>
    </header>
    <main class="flex-1">
      <NuxtPage />
    </main>
  </div>
</template>
