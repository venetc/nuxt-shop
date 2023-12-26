import { readValidatedBody } from 'h3'
import { z } from 'zod'

const sc = z.object({
  secret: z.literal(useRuntimeConfig().seedToken, { errorMap: () => ({ message: 'Invalid secret token' }) }),
})

export default defineEventHandler(async (event) => {
  const response = await readValidatedBody(event, sc.safeParse)

  if (!response.success) {
    const errors = response.error.flatten().fieldErrors

    throw createError({
      statusCode: 401,
      message: Object.values(errors).join(', '),
      data: { errors },
    })
  }

  return { data: response.data }
})
