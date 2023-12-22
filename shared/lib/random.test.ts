import { maybeValue, randomBoolean, randomFloatInclusive, randomNumberInRangeInclusive } from './random'

import { describe, expect, it, vi } from 'vitest'

describe('randomFloatInclusive', () => {
  it('should return a random float between 0 and 1 (inclusive) when no arguments are provided', () => {
    for (let i = 0; i < 10; i++) {
      const result = randomFloatInclusive()
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(1)
    }
  })

  it('should return a random float between the specified min and max values (inclusive)', () => {
    for (let i = 0; i < 10; i++) {
      const min = i * 5
      const max = i * 10
      const result = randomFloatInclusive(min, max)
      expect(result).toBeGreaterThanOrEqual(min)
      expect(result).toBeLessThanOrEqual(max)
    }
  })

  it('should return the specified min value when min and max are the same', () => {
    const result = randomFloatInclusive(3, 3)
    expect(result).toBe(3)
  })
})

describe('randomBoolean', () => {
  it('should return true with high probability', () => {
    const trueValues = { count: 0 }
    const falseValues = { count: 0 }

    for (let i = 0; i < 500; i++) {
      randomBoolean(0.75) === true ? trueValues.count++ : falseValues.count++
    }

    expect(trueValues.count).toBeGreaterThanOrEqual(falseValues.count)
  })

  it('should return false with low probability', () => {
    const trueValues = { count: 0 }
    const falseValues = { count: 0 }

    for (let i = 0; i < 500; i++) {
      randomBoolean(0.25) === true ? trueValues.count++ : falseValues.count++
    }

    expect(falseValues.count).toBeGreaterThanOrEqual(trueValues.count)
  })
})

describe('maybeValue', () => {
  it('should always return value with probability 1', () => {
    for (let i = 0; i < 100; i++) {
      const result = maybeValue(() => 69, { probability: 1 })
      expect(result).toBe(69)
    }
  })

  it('should always return undefined with probability 0', () => {
    for (let i = 0; i < 100; i++) {
      const result = maybeValue(() => 69, { probability: 0 })
      expect(result).toBe(undefined)
    }
  })

  it('should return value with high probability', () => {
    const undefinedValues = { count: 0 }
    const definedValues = { count: 0 }

    for (let i = 0; i < 100; i++) {
      const result = maybeValue(() => 69, { probability: 0.75 })

      result ? definedValues.count++ : undefinedValues.count++
    }

    expect(definedValues.count).toBeGreaterThanOrEqual(undefinedValues.count)
  })

  it('should return undefined with low probability', () => {
    const undefinedValues = { count: 0 }
    const definedValues = { count: 0 }

    for (let i = 0; i < 100; i++) {
      const result = maybeValue(() => 69, { probability: 0.25 })

      result ? definedValues.count++ : undefinedValues.count++
    }

    expect(undefinedValues.count).toBeGreaterThanOrEqual(definedValues.count)
  })

  it('should return undefined if the callback function throws an error', () => {
    const mockCallback = vi.fn().mockImplementation(() => {
      throw new Error('Some error')
    })

    const result = maybeValue(mockCallback)

    expect(result).toBeUndefined()
    expect(mockCallback).toThrow()
  })
})

describe('randomNumberInRangeInclusive', () => {
  it('should return the minimum value when min and max are the same', () => {
    expect(randomNumberInRangeInclusive(5, 5)).toEqual(5)
  })

  it('should throw an error when max is less than min', () => {
    expect(() => {
      randomNumberInRangeInclusive(10, 5)
    }).toThrow('Invalid range')
  })

  it('should return a random number within the specified range (inclusive)', () => {
    const min = 1
    const max = 50

    for (let i = min; i < max - 1; i++) {
      const randomNumber = randomNumberInRangeInclusive(i, max - 1)
      expect(randomNumber).toBeGreaterThanOrEqual(i)
      expect(randomNumber).toBeLessThanOrEqual(max - 1)
    }
  })
})
