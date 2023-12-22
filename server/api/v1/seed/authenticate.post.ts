export default defineEventHandler(async (event) => {
  const { secret } = await readBody<{ secret: string }>(event)

  if (secret.length === 0) return createError({ statusCode: 401, statusMessage: 'Missing token' })

  const token = process.env.NUXT_SEED_TOKEN ?? useRuntimeConfig().seedToken

  if (secret !== token) return createError({ statusCode: 401, statusMessage: 'Invalid token' })

  return { status: 'ok' }
})
