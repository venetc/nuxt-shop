<template>
  <div class="relative flex min-h-screen flex-col">
    <header class="sticky top-0 z-50 border-b rounded-b-lg border-border/40 mx-auto w-full max-w-screen-2xl px-3 backdrop-blur bg-navy-200/95 supports-[backdrop-filter]:bg-navy-200/25">
      <div class="flex h-14 items-center">
        <nav class="flex flex-row">
          <SharedButton asChild variant="link" size="default">
            <NuxtLink :to="{ path: '/catalogue' }">
              Catalogue
            </NuxtLink>
          </SharedButton>
          <SharedButton asChild variant="link" size="default">
            <NuxtLink :to="{ name: 'product-slug', params: { slug: 'airmax-supreme-alpha' } }">
              Product
            </NuxtLink>
          </SharedButton>
          <SharedButton asChild variant="link" size="default">
            <NuxtLink :to="{ name: 'product-slug', params: { slug: '1' } }">
              Wrong product
            </NuxtLink>
          </SharedButton>
          <SharedButton asChild variant="link" size="default">
            <NuxtLink to="/">
              Home
            </NuxtLink>
          </SharedButton>
          <SharedButton asChild variant="link" size="default">
            <NuxtLink to="/seed">
              Seed
            </NuxtLink>
          </SharedButton>
        </nav>

        <FeatureLanguageChanger class="ml-auto" />
      </div>
    </header>
    <main class="flex-1">
      <NuxtPage />
    </main>
  </div>
</template>
