import { camelToKebab, camelToSnake, kebabToCamel, snakeToCamel, toSlug } from './string'

import { describe, expect, it } from 'vitest'

describe('toSlug', () => {
  it('should return an empty string if input is empty', () => {
    expect(toSlug('')).toBe('')
  })

  it('should convert spaces to hyphens', () => {
    expect(toSlug('hello world')).toBe('hello-world')
  })

  it('should convert multiple spaces to a single hyphen', () => {
    expect(toSlug('hello   world')).toBe('hello-world')
  })

  it('should handle single lowercase word', () => {
    expect(toSlug('hello')).toBe('hello')
  })

  it('should convert ampersands to "and"', () => {
    expect(toSlug('bread & butter')).toBe('bread-and-butter')
  })

  it('should convert uppercase characters to lowercase', () => {
    expect(toSlug('HelloWorld')).toBe('helloworld')
  })

  it('should remove special characters', () => {
    expect(toSlug('123!@#$%^&*()')).toBe('123')
  })

  it('should handle a combination of transformations', () => {
    expect(toSlug('Adidas & Puma.')).toBe('adidas-and-puma')
  })
})

describe('camelToKebab', () => {
  it('should convert camel case to kebab case', () => {
    expect(camelToKebab('camelCase')).toBe('camel-case')
    expect(camelToKebab('helloWorld')).toBe('hello-world')
    expect(camelToKebab('kebabCase')).toBe('kebab-case')
  })

  it('should handle the first letter being uppercase', () => {
    expect(camelToKebab('CamelCase')).toBe('camel-case')
    expect(camelToKebab('HelloWorld')).toBe('hello-world')
    expect(camelToKebab('KebabCase')).toBe('kebab-case')
  })

  it('should handle numbers in the string', () => {
    expect(camelToKebab('camelCase123')).toBe('camel-case123')
    expect(camelToKebab('helloWorld456')).toBe('hello-world456')
    expect(camelToKebab('kebabCase789')).toBe('kebab-case789')
  })

  it('should handle special characters in the string', () => {
    expect(camelToKebab('camelCase!@#')).toBe('camel-case!@#')
    expect(camelToKebab('helloWorld$%^')).toBe('hello-world$%^')
    expect(camelToKebab('kebabCase&*(')).toBe('kebab-case&*(')
  })
})

describe('camelToSnake', () => {
  it('should convert camel case to snake case', () => {
    expect(camelToSnake('helloWorld')).toBe('hello_world')
    expect(camelToSnake('fooBarBaz')).toBe('foo_bar_baz')
  })

  it('should convert camel case with numbers to snake case', () => {
    expect(camelToSnake('helloWorld123')).toBe('hello_world123')
    expect(camelToSnake('fooBarBaz456')).toBe('foo_bar_baz456')
  })

  it('should handle empty string', () => {
    expect(camelToSnake('')).toBe('')
  })

  it('should handle words with only numbers', () => {
    expect(camelToSnake('123')).toBe('123')
    expect(camelToSnake('4567890')).toBe('4567890')
  })

  it('should handle words with leading and trailing spaces', () => {
    expect(camelToSnake('   helloWorld   ')).toBe('hello_world')
    expect(camelToSnake('   fooBarBaz   ')).toBe('foo_bar_baz')
  })

  it('should handle words with special characters', () => {
    expect(camelToSnake('hello@World')).toBe('hello@world')
    expect(camelToSnake('foo#Bar#Baz')).toBe('foo#bar#baz')
  })
})

describe('kebabToCamel', () => {
  it('should convert kebab case to camel case', () => {
    expect(kebabToCamel('hello-world')).toBe('helloWorld')
    expect(kebabToCamel('codeium-rocks')).toBe('codeiumRocks')
    expect(kebabToCamel('test-case-example')).toBe('testCaseExample')
  })

  it('should not convert non-kebab case strings', () => {
    expect(kebabToCamel('HelloWorld')).toBe('HelloWorld')
    expect(kebabToCamel('codeiumRocks')).toBe('codeiumRocks')
    expect(kebabToCamel('testCaseExample')).toBe('testCaseExample')
  })

  it('should handle empty string', () => {
    expect(kebabToCamel('')).toBe('')
  })
})

describe('snakeToCamel', () => {
  it('should convert snake case to camel case', () => {
    expect(snakeToCamel('hello_world')).toBe('helloWorld')
    expect(snakeToCamel('my_variable_name')).toBe('myVariableName')
    expect(snakeToCamel('another_example')).toBe('anotherExample')
  })

  it('should handle empty string', () => {
    expect(snakeToCamel('')).toBe('')
  })

  it('should handle single word without underscore', () => {
    expect(snakeToCamel('hello')).toBe('hello')
    expect(snakeToCamel('world')).toBe('world')
    expect(snakeToCamel('camelcase')).toBe('camelcase')
  })
})
