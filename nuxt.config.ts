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
      path: '~/shared',
      extensions: ['.vue'],
      pathPrefix: true,
      prefix: 'Shared',
    },
    {
      path: '~/entities',
      extensions: ['.vue'],
      pathPrefix: true,
      prefix: 'Entity',
    },
    {
      path: '~/features',
      extensions: ['.vue'],
      pathPrefix: true,
      prefix: 'Feature',
    },
    {
      path: '~/widgets',
      extensions: ['.vue'],
      pathPrefix: true,
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
})
