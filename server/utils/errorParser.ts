import type { z } from 'zod'

export function parseZodError<T>(error: z.ZodError<T>) {
  const fieldErrors = error.flatten().fieldErrors

  return Object.entries(fieldErrors)
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${key}: ${value.join(', ')}`

      return `${key}: ${value}`
    })
    .join(',\n')
}
