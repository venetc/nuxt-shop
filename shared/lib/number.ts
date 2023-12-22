export function roundToNearest(value: number, nearest: 0.5 | 1 | 10 | 100 | 1_000) {
  if (value === 0) return value

  return Math.round(value / nearest) * nearest
}
