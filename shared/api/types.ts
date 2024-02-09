import type { H3Error } from 'h3'

export type ValidationErrors<O extends Record<string, unknown>> = H3Error<{ data: { errors: { [K in keyof O]: string[] } } }>
