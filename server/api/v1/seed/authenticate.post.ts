import { readValidatedBody } from 'h3'
import { z } from 'zod'

const authSchema = z.object({
  secret: z.literal(useRuntimeConfig().seedToken, { errorMap: () => ({ message: 'Invalid secret token' }) }),
})

export default defineEventHandler(async (event) => {
  const response = await readValidatedBody(event, authSchema.safeParse)

  if (!response.success) {
    const errors = response.error.flatten().fieldErrors

    throw createError({
      statusCode: 401,
      message: parseZodError(response.error),
      data: { errors },
    })
  }

  return { data: { secret: 'ok!' } }
})
