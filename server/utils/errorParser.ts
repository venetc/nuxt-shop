import type { z } from 'zod'

export function parseZodError<T>(error: z.ZodError<T>) {
  const fieldErrors = error.flatten().fieldErrors
  const formErrors = error.flatten().formErrors

  const formatedFieldErrors = Object.entries(fieldErrors)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 1) {
          return `${key}: ${value[0]}`
        }

        return `${key}: ${value.join(', ')}`
      }

      return `${key}: ${value}`
    })
    .join(', ')

  const formatedFormErrors = formErrors.map(value => `${value}`).join(', ')

  return formatedFormErrors ? `${formatedFieldErrors} ${formatedFormErrors}` : formatedFieldErrors
}
