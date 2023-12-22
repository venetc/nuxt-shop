export function getLoopedIndexItem<T>(lookupIndex: number, targetArray: T[]) {
  return targetArray[lookupIndex % targetArray.length]
}

export function shuffleInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function sample<T>(array: T[], amount: number): T[] {
  if (array.length === 0 || amount <= 0) return []
  if (amount > array.length) return array

  const sampledElements: T[] = []
  const randmoIndexes = new Set<number>()

  while (randmoIndexes.size < amount) {
    const randomIndex = Math.floor(Math.random() * array.length)
    randmoIndexes.add(randomIndex)
  }

  randmoIndexes.forEach((index) => {
    sampledElements.push(array[index])
  })

  return sampledElements
}
