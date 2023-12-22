export function randomFloatInclusive(min = 0, max = 1) {
  const random = Math.random()
  const range = max - min
  return +(random * range + min).toFixed(2)
}

export function randomBoolean(probability = 0.5) {
  const float = randomFloatInclusive()
  if (probability === 1) return true
  if (probability === 0) return false

  return float < probability
}

export function maybeValue<T>(callback: () => T, options: { probability?: number } = {}): T | undefined {
  try {
    return randomBoolean(options?.probability) ? callback() : undefined
  }
  catch {
    return undefined
  }
}

export function randomNumberInRangeInclusive(min: number, max: number) {
  const roundedMin = Math.ceil(min)
  const roundedMax = Math.floor(max)

  if (roundedMin === roundedMax) {
    return roundedMin
  }

  if (roundedMax < roundedMin) {
    throw new RangeError('Invalid range')
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}
