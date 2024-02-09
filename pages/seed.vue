<script setup lang="ts">
import { type Table, TablesKeys } from '@/server/db/schema'

definePageMeta({ layout: 'headless' })

function useSeeder(table: Table) {
  return useFetch('/api/v1/seed', {
    key: `seed-${table}`,
    method: 'POST',
    immediate: false,
    body: { table },
  })
}

const { t } = useI18n()

const tables = TablesKeys.map(table => ({ name: computed(() => t(`common.${table}`)), seeder: useSeeder(table) }))

const someIdle = computed(() => tables.some(table => table.seeder.status.value === 'idle'))
const somePending = computed(() => tables.some(table => table.seeder.status.value === 'pending'))
const someHasErrors = computed(() => tables.some(table => table.seeder.status.value === 'error'))

async function seedAll() {
  for (const table of tables) await table.seeder.execute()
}

const isPasswordVisible = ref(false)

const secret = ref('')

const authController = useFetch<{ secret: string }, ValidationErrors<{ secret: string }>>('/api/v1/seed/authenticate', {
  key: 'seed-secret-phrase',
  method: 'POST',
  immediate: false,
  watch: false,
  body: { secret },
})

const { execute: auth, status: authStatus, error: authError } = authController
</script>

<template>
  <div class="grid place-items-center min-h-[calc(100vh-57px)] pb-14">
    <div class="relative m-auto w-full max-w-xs justify-center bg-navy-50 shadow-lg h-auto rounded-md px-6 py-4 pb-5">
      <SharedButton variant="link"
                    size="icon"
                    class="absolute top-5 left-3 bg-navy-50"
                    @click="authStatus === 'success' ? authStatus = 'idle' : navigateTo({ path: '/' })"
      >
        <Icon name="lucide:arrow-left"
              size="20"
              class="text-navy-500"
        />
      </SharedButton>
      <h1 class="text-center font-nunito text-4xl font-semibold text-navy-900 mb-4">
        {{ $t('seedPage.title') }}
      </h1>

      <Transition name="fade"
                  mode="out-in"
      >
        <div v-if="authStatus === 'success'">
          <SharedSeparator class="mt-4 mb-4" />
          <div class="text-center leading-snug font-rubik">
            <div>{{ $t('seedPage.seed.description_1') }}</div>
            <div>{{ $t('seedPage.seed.description_2') }}</div>
            <div>{{ $t('seedPage.seed.description_3') }}</div>
          </div>
          <SharedSeparator class="mt-4 mb-4" />
          <div class="space-y-1.5">
            <div v-for="table in tables"
                 :key="table.name.value"
                 class="text-md flex justify-between items-center font-rubik"
            >
              <span class="capitalize">{{ table.name.value }}</span>

              <Icon v-if="table.seeder.status.value === 'pending'"
                    name="fluent:spinner-ios-16-regular"
                    size="24"
                    class="text-navy-500 animate-spin"
              />

              <Icon v-else-if="table.seeder.status.value === 'success'"
                    name="lucide:check"
                    size="24"
                    class="text-navy-500"
              />

              <Icon v-else-if="table.seeder.status.value === 'error'"
                    name="lucide:x"
                    size="24"
                    class="text-red-500"
              />

              <Icon v-else
                    name="lucide:minus"
                    size="24"
                    class="text-navy-500"
              />
            </div>
          </div>

          <div class="mt-4">
            <SharedButton v-if="someIdle || somePending"
                          class="w-full"
                          :disabled="somePending"
                          @click="seedAll"
            >
              {{ somePending ? $t('seedPage.seed.button_pending') : $t('seedPage.seed.button_idle') }}
            </SharedButton>

            <div v-else
                 class="w-full min-h-[36px] grid place-items-center items-center text-center"
            >
              <div v-if="someHasErrors"
                   class="text-red-700 font-mono"
              >
                ¯\_(ツ)_/¯
              </div>
              <div v-else
                   class="text-green-700 font-rubik"
              >
                {{ $t('seedPage.seed.button_complete') }}
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <SharedSeparator class="mt-4 mb-5" />
          <div class="text-center leading-snug font-rubik">
            {{ $t('seedPage.auth.description_1.part_1') }}
            <br>
            {{ $t('seedPage.auth.description_1.part_2') }}
            <br>
            {{ $t('seedPage.auth.description_2') }}
          </div>
          <label class="relative my-5 block">
            <SharedInput v-model="secret"
                         :type="isPasswordVisible ? 'text' : 'password'"
                         class="font-rubik"
                         :error="authError !== null"
                         @input="authError = null"
                         @keyup.enter="auth"
            />
            <SharedButton size="sm"
                          variant="link"
                          :class="cn(
                            'absolute top-1/2 -translate-y-1/2 right-0.5 cursor-pointer transition-all',
                            authError === null ? 'text-navy-900' : 'text-red-900',
                          )"
                          @click="isPasswordVisible = !isPasswordVisible"
            >
              <Icon :name="isPasswordVisible ? 'lucide:eye-off' : 'lucide:eye'"
                    size="20"
              />
            </SharedButton>
            <span v-if="authError"
                  class="absolute w-full text-center top-full mt-0.5 text-sm leading-none text-red-700"
            >
              {{ authError.data?.data.errors.secret ? authError.data.data.errors.secret[0] : authError.statusMessage }}
            </span>
          </label>
          <SharedButton class="w-full"
                        :disabled="authStatus === 'pending'"
                        @click="auth"
          >
            <div>{{ authStatus === 'pending' ? $t('seedPage.auth.button_pending') : $t('seedPage.auth.button_idle') }}</div>
            <Icon v-if="authStatus === 'pending'"
                  name="fluent:spinner-ios-16-regular"
                  size="14"
                  class="text-white animate-spin ml-1"
            />
          </SharedButton>
        </div>
      </Transition>
    </div>
  </div>
</template>
