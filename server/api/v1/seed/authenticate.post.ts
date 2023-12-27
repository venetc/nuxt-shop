import { readValidatedBody } from 'h3'
import { z } from 'zod'

function dynamicSchema(message: string) {
  return z.object({ secret: z.literal(useRuntimeConfig().seedToken, { errorMap: () => ({ message }) }) })
}

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event)
  const errorMessage = t('seedPage.auth.error')

  const response = await readValidatedBody(event, dynamicSchema(errorMessage).safeParse)

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
