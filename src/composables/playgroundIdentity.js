export function getBlockIdFromSearch(search) {
  const params = new URLSearchParams(search)
  return params.get('block')?.trim() || ''
}

export function createScopedStorageKey(baseKey, blockId) {
  return blockId ? `${baseKey}-${blockId}` : baseKey
}
