<script setup lang="ts">
import type { Tables } from '@/server/db/schema'

definePageMeta({ layout: 'headless' })

function useSeeder({ table }: { table: Tables }) {
  return useFetch('/api/v1/seed', {
    key: `seed-${table}`,
    method: 'POST',
    immediate: false,
    body: { table },
  })
}

const tables = {
  brands: { name: 'Brands', seeder: useSeeder({ table: 'brands' }) },
  colors: { name: 'Colors', seeder: useSeeder({ table: 'colors' }) },
  models: { name: 'Models', seeder: useSeeder({ table: 'models' }) },
  sizes: { name: 'Sizes', seeder: useSeeder({ table: 'sizes' }) },
  colorsOfModels: { name: 'Colors of Models', seeder: useSeeder({ table: 'colors_of_models' }) },
  sizesOfModels: { name: 'Sizes of Models', seeder: useSeeder({ table: 'sizes_of_models' }) },
}

async function seedAll() {
  for (const table of Object.values(tables))
    await table.seeder.execute()
}

const someIdle = computed(() => Object.values(tables).some(table => table.seeder.status.value === 'idle'))
const somePending = computed(() => Object.values(tables).some(table => table.seeder.status.value === 'pending'))
const someHasErrors = computed(() => Object.values(tables).some(table => table.seeder.status.value === 'error'))

const isPasswordVisible = ref(false)

const secret = ref('')

const authController = useFetch('/api/v1/seed/authenticate', {
  key: 'seed-secret-phrase',
  method: 'POST',
  immediate: false,
  watch: false,
  body: { secret },
})

const { execute: auth, status: authStatus, error: authError } = authController
</script>

<template>
  <div class="grid place-items-center min-h-screen">
    <div class="relative m-auto w-full max-w-xs justify-center bg-navy-50 shadow-lg h-auto rounded-md px-6 py-4 pb-5">
      <h1 class="text-center font-nunito text-4xl font-semibold text-navy-900 mb-4">
        Seeding
      </h1>

      <div v-if="authStatus === 'success'">
        <SharedSeparator class="mt-4 mb-4" />
        <div class="text-center leading-snug font-rubik">
          <div>Go on, big boy.</div>
          <div>All previous data will be deleted,</div>
          <div>but who cares, right?</div>
        </div>
        <SharedSeparator class="mt-4 mb-4" />
        <div class="space-y-1.5">
          <div
            v-for="table in tables"
            :key="table.name"
            class="text-md flex justify-between items-center font-rubik"
          >
            <span>{{ table.name }}</span>

            <Icon
              v-if="table.seeder.status.value === 'pending'"
              name="fluent:spinner-ios-16-regular"
              size="24"
              class="text-navy-500 animate-spin"
            />

            <Icon
              v-else-if="table.seeder.status.value === 'success'"
              name="lucide:check"
              size="24"
              class="text-navy-500"
            />

            <Icon
              v-else-if="table.seeder.status.value === 'error'"
              name="lucide:x"
              size="24"
              class="text-red-500"
            />

            <Icon
              v-else
              name="lucide:minus"
              size="24"
              class="text-navy-500"
            />
          </div>
        </div>

        <div class="mt-4">
          <SharedButton
            v-if="someIdle || somePending"
            class="w-full"
            :disabled="somePending"
            @click="seedAll"
          >
            {{ somePending ? 'Seeding...' : 'Add data' }}
          </SharedButton>

          <div v-else class="w-full min-h-[36px] grid place-items-center items-center text-center">
            <div v-if="someHasErrors" class="text-red-700 font-mono">
              ¯\_(ツ)_/¯
            </div>
            <div v-else class="text-green-700 font-rubik">
              Done!
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <SharedSeparator class="mt-4 mb-5" />
        <div class="text-center leading-snug font-rubik">
          So, you are about<br>to seed some juicy data.<br>
          Give me secret phrase to proceed.
        </div>
        <label class="relative my-5 block">
          <SharedInput
            v-model="secret"
            :type="isPasswordVisible ? 'text' : 'password'"
            class="font-rubik"
            :error="authError !== null"
            @input="authError = null"
          />
          <Icon
            :name="isPasswordVisible ? 'lucide:eye-off' : 'lucide:eye'"
            size="20"
            :class="cn(
              'absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer transition-colors',
              authError === null ? 'text-navy-900' : 'text-red-900',
            )"
            @click="isPasswordVisible = !isPasswordVisible"
          />
          <span
            v-if="authError"
            class="absolute w-full text-center top-full mt-0.5 text-sm leading-none text-red-700"
          >
            {{ authError?.statusMessage }}
          </span>
        </label>
        <SharedButton class="w-full" :disabled="authStatus === 'pending'" @click="auth">
          <div>{{ authStatus === 'pending' ? 'Authenticating' : 'Authenticate' }}</div>
          <Icon
            v-if="authStatus === 'pending'"
            name="fluent:spinner-ios-16-regular"
            size="14"
            class="text-white animate-spin ml-1"
          />
        </SharedButton>
      </div>
    </div>
  </div>
</template>
