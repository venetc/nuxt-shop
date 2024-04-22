<script setup lang="ts">
const isBurgerOpened = ref(false)
const setOpenState = (state: boolean) => isBurgerOpened.value = state
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <header class="sticky top-0 z-50 border-b rounded-b-lg border-border/40 mx-auto w-full max-w-screen-2xl px-3 backdrop-blur bg-navy-200/95 supports-[backdrop-filter]:bg-navy-200/25">
      <div class="flex h-14 items-center">
        <SharedDropdownMenu @update:open="setOpenState">
          <SharedDropdownMenuTrigger asChild>
            <SharedButton variant="outline"
                          size="icon"
            >
              <Icon v-if="isBurgerOpened"
                    name="ic:round-close"
                    class="text-navy-500"
                    size="24"
              />
              <Icon v-else
                    name="ic:round-menu"
                    class="text-navy-500"
                    size="24"
              />
            </SharedButton>
          </SharedDropdownMenuTrigger>
          <SharedDropdownMenuContent :collisionPadding="{ left: 12, right: 12 }">
            <SharedDropdownMenuItem asChild>
              <NuxtLink :to="{ path: '/catalogue' }"
                        class="cursor-pointer"
              >
                Catalogue
              </NuxtLink>
            </SharedDropdownMenuItem>
            <SharedDropdownMenuItem asChild>
              <NuxtLink :to="{ name: 'products-slug', params: { slug: 'airmax-supreme-alpha' } }"
                        class="cursor-pointer"
              >
                Product
              </NuxtLink>
            </SharedDropdownMenuItem>
            <SharedDropdownMenuItem asChild>
              <NuxtLink :to="{ name: 'categories' }"
                        class="cursor-pointer"
              >
                Categories
              </NuxtLink>
            </SharedDropdownMenuItem>
            <SharedDropdownMenuItem asChild>
              <NuxtLink :to="{ name: 'categories-id', params: { id: 1 } }"
                        class="cursor-pointer"
              >
                Concrete category
              </NuxtLink>
            </SharedDropdownMenuItem>
            <SharedDropdownMenuItem asChild>
              <NuxtLink :to="{ name: 'products-slug', params: { slug: '1' } }"
                        class="cursor-pointer"
              >
                Wrong product
              </NuxtLink>
            </SharedDropdownMenuItem>
            <SharedDropdownMenuItem asChild>
              <NuxtLink to="/"
                        class="cursor-pointer"
              >
                Home
              </NuxtLink>
            </SharedDropdownMenuItem>
            <SharedDropdownMenuItem asChild>
              <NuxtLink to="/seed"
                        class="cursor-pointer"
              >
                Seed
              </NuxtLink>
            </SharedDropdownMenuItem>
          </SharedDropdownMenuContent>
        </SharedDropdownMenu>

        <LanguageChanger class="ml-auto" />
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
