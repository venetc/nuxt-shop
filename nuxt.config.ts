// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: { name: 'fade', mode: 'out-in' },
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'shadcn-nuxt',
    '@nuxt/test-utils/module',
    'nuxt-icon',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
  ],
  typescript: { shim: false },
  runtimeConfig: {
    tursoDbUrl: process.env.NUXT_TURSO_DB_URL,
    tursoDbToken: process.env.NUXT_TURSO_DB_TOKEN,
    seedToken: process.env.NUXT_SEED_TOKEN,
  },
  shadcn: { prefix: 'Shared', componentDir: './shared/ui' },
  components: [
    {
      path: '~/shared/ui',
      extensions: ['.vue'],
      pathPrefix: false,
      prefix: 'Shared',
    },
    {
      path: '~/entities',
      extensions: ['.vue'],
      pathPrefix: false,
      prefix: 'Entity',
    },
    {
      path: '~/features',
      extensions: ['.vue'],
      pathPrefix: false,
      prefix: 'Feature',
    },
    {
      path: '~/widgets',
      extensions: ['.vue'],
      pathPrefix: false,
      prefix: 'Widget',
    },
  ],
  imports: {
    dirs: [
      'shared/**',
      'entities/**',
      'features/**',
      'widgets/**',
    ],
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'Nunito': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'Rubik': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'Fira Sans': [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    lazy: true,
    langDir: './locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' },
    ],
    experimental: {
      localeDetector: './server/utils/localeDetector.ts',
    },
  },
})
