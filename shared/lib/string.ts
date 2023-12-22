export function toSlug(str: string) {
  let s = str
  if (!s) return ''

  s = s.toLowerCase().trim()
  s = s.replace(/ & /g, ' and ')
  s = s.replace(/[ ]+/g, '-')
  s = s.replace(/[-]+/g, '-')
  s = s.replace(/[^a-z0-9-]+/g, '')
  return s
}

export function camelToKebab(str: string) {
  return str.replace(/[\w]([A-Z])/g, group => `${(group[0] as string)}-${(group[1] as string)}`).toLowerCase()
}

export function camelToSnake(str: string) {
  return str.replace(/[\w]([A-Z])/g, group => `${(group[0] as string)}_${(group[1])}`).toLowerCase().trim()
}

export function kebabToCamel(str: string) {
  return str.replace(/(-\w)/g, group => (group[1] as string).toUpperCase())
}

export function snakeToCamel(str: string) {
  return str.replace(/(_\w)/g, group => (group[1] as string).toUpperCase())
}
