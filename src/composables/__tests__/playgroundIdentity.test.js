import { describe, it, expect } from 'vitest'
import { getBlockIdFromSearch, createScopedStorageKey } from '../playgroundIdentity.js'

describe('playgroundIdentity', () => {
  it('reads block id from the URL query string', () => {
    expect(getBlockIdFromSearch('?block=2')).toBe('2')
  })

  it('ignores empty block ids', () => {
    expect(getBlockIdFromSearch('?block=')).toBe('')
  })

  it('trims whitespace around the block id', () => {
    expect(getBlockIdFromSearch('?block=%20demo-1%20')).toBe('demo-1')
  })

  it('builds a scoped key when a block id exists', () => {
    expect(createScopedStorageKey('feishu-rust-playground-code', '3')).toBe('feishu-rust-playground-code-3')
  })

  it('keeps the base key when no block id exists', () => {
    expect(createScopedStorageKey('feishu-rust-playground-code', '')).toBe('feishu-rust-playground-code')
  })
})
