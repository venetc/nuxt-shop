export default defineEventHandler(async (event) => {
  const { secret } = await readBody<{ secret: string }>(event)

  const cloudflareContext = event.context.cloudflare

  const token = cloudflareContext ? cloudflareContext.NUXT_SEED_TOKEN : useRuntimeConfig().seedToken

  if (secret !== token) return createError({ statusCode: 401, statusMessage: 'Invalid token' })

  return { status: 'ok' }
})
