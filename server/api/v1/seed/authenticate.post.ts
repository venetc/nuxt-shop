export default defineEventHandler(async (event) => {
  const { secret } = await readBody<{ secret: string }>(event)
  const { seedToken } = useRuntimeConfig()

  if (secret !== seedToken) return createError({ statusCode: 401, statusMessage: 'Invalid token' })

  return { status: 'ok' }
})
