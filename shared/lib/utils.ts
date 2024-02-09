import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deserialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
