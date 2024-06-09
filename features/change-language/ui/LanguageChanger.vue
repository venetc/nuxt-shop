<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'

const { locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value).filter((i): i is LocaleObject => typeof i !== 'string')
})
</script>

<template>
  <div>
    <SharedDropdownMenu>
      <SharedDropdownMenuTrigger asChild>
        <SharedButton variant="outline"
                      size="icon"
        >
          <Icon name="ic:outline-g-translate"
                class="text-navy-500"
                size="24"
          />
        </SharedButton>
      </SharedDropdownMenuTrigger>
      <SharedDropdownMenuContent :collisionPadding="{ left: 12, right: 12 }">
        <SharedDropdownMenuItem v-for="locale in availableLocales"
                                :key="locale.name"
                                class="cursor-pointer"
                                @click="setLocale(locale.code)"
        >
          {{ locale.name }}
        </SharedDropdownMenuItem>
      </SharedDropdownMenuContent>
    </SharedDropdownMenu>
  </div>
</template>
