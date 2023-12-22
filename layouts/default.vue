<template>
  <div>
    <div class="fixed z-10 top-0 left-0 w-full font-nunito text-2xl">
      <nav class="flex flex-row gap-2">
        <ul class="border px-2 py-1 rounded-md shadow bg-navy-50">
          <NuxtLink :to="{ path: '/catalogue' }">
            Catalogue
          </NuxtLink>
        </ul>
        <ul class="border px-2 py-1 rounded-md shadow bg-navy-50">
          <NuxtLink :to="{ path: '/product/1', query: { id: [1, 2] } }">
            Product
          </NuxtLink>
        </ul>
        <ul class="border px-2 py-1 rounded-md shadow bg-navy-50">
          <NuxtLink to="/">
            Home
          </NuxtLink>
        </ul>
        <ul class="border px-2 py-1 rounded-md shadow bg-navy-50">
          <NuxtLink to="/seed">
            Seed
          </NuxtLink>
        </ul>
      </nav>
    </div>
    <div class="min-h-screen pt-20">
      <NuxtPage />
    </div>
  </div>
</template>
