import { roundToNearest } from '../number'

import { describe, expect, it } from 'vitest'

describe('roundToNearest', () => {
  it('should return 0 if the value is 0', () => {
    expect(roundToNearest(0, 0.5)).toBe(0)
    expect(roundToNearest(0, 1)).toBe(0)
    expect(roundToNearest(0, 10)).toBe(0)
    expect(roundToNearest(0, 100)).toBe(0)
    expect(roundToNearest(0, 1000)).toBe(0)
  })

  it('should round the value to the nearest specified value', () => {
    expect(roundToNearest(3.2, 0.5)).toBe(3)
    expect(roundToNearest(3.6, 0.5)).toBe(3.5)
    expect(roundToNearest(3.7, 0.5)).toBe(3.5)
    expect(roundToNearest(3.8, 0.5)).toBe(4)

    expect(roundToNearest(15, 1)).toBe(15)
    expect(roundToNearest(17, 1)).toBe(17)

    expect(roundToNearest(300, 10)).toBe(300)
    expect(roundToNearest(305, 10)).toBe(310)

    expect(roundToNearest(2000, 100)).toBe(2000)
    expect(roundToNearest(2100, 100)).toBe(2100)

    expect(roundToNearest(5000, 1000)).toBe(5000)
    expect(roundToNearest(5500, 1000)).toBe(6000)
  })
})
