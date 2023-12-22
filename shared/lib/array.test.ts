import { getLoopedIndexItem, sample, shuffleInPlace } from './array'

import { describe, expect, it } from 'vitest'

describe('getLoopedIndexItem', () => {
  it('should return the item at the lookup index in the target array', () => {
    const targetArray = [1, 2, 3, 4, 5]
    expect(getLoopedIndexItem(6, targetArray)).toBe(2)
    expect(getLoopedIndexItem(7, targetArray)).toBe(3)
    expect(getLoopedIndexItem(8, targetArray)).toBe(4)
  })
})

describe('shuffleInPlace', () => {
  it('should shuffle the array in place', () => {
    const array = [1, 2, 3, 4, 5]
    const shuffledArray = shuffleInPlace(array)

    expect(shuffledArray).not.toEqual([1, 2, 3, 4, 5])

    expect(shuffledArray).toContain(1)
    expect(shuffledArray).toContain(2)
    expect(shuffledArray).toContain(3)
    expect(shuffledArray).toContain(4)
    expect(shuffledArray).toContain(5)

    expect(shuffledArray.length).toEqual(array.length)
  })

  it('should return the same array if it has only one element', () => {
    const array = [1]
    const shuffledArray = shuffleInPlace(array)

    expect(shuffledArray).toEqual(array)
  })

  it('should return an empty array if the input array is empty', () => {
    const array: number[] = []
    const shuffledArray = shuffleInPlace(array)

    expect(shuffledArray.length).toEqual(0)
  })
})

describe('sample', () => {
  it('should return an empty array if the input array is empty', () => {
    expect(sample([], 3)).toEqual([])
  })

  it('should return the entire array if the requested amount is greater than the length of the array', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(sample(input, 11)).toEqual(input)
  })

  it('should return a sample of the requested amount from the input array', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(input, 3)
    expect(result).toHaveLength(3)
    result.forEach((item) => {
      expect(input).toContain(item)
    })
  })

  it('shoud contain only unique items', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(input, 9)
    expect(result).toHaveLength(new Set(result).size)
  })

  it('should contain no undefined values', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(input, 9)
    expect(result).not.toContain(undefined)
  })
})
