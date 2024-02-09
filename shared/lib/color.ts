import type { Tuple } from './types'

export type RGB = Tuple<number, 3>

export function hexToRGB(hex: string): RGB {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

export function shadeHexColor(color: string, decimal: number): string {
  return hexToRGB(color)
    .map(c => (Math.round(c / decimal)))
    .map(c => (c < 255 ? c : 255))
    .reduce((res, c) => {
      res += c.toString(16).padStart(2, '0')
      return res
    }, '#')
}
