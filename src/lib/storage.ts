import type { PurchaseCaseFile, PreferenceState } from '../types'

export const STORAGE_KEYS = {
  preferences: 'buyology:preferences',
  caseFiles: 'buyology:caseFiles',
  watchlist: 'buyology:watchlist',
  history: 'buyology:history',
} as const

/**
 * Returns true if localStorage is available and writable.
 * Never throws.
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__buyology_test__'
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Serializes a value to a JSON string.
 * Returns null if serialization fails.
 * Never throws.
 */
export function serialize<T>(value: T): string | null {
  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}

/**
 * Writes a value to localStorage under the given key.
 * Silently does nothing if localStorage is unavailable or serialization fails.
 * Never throws.
 */
export function writeStorage<T>(key: string, value: T): void {
  try {
    const serialized = serialize(value)
    if (serialized !== null) {
      localStorage.setItem(key, serialized)
    }
  } catch {
    // silently ignore write failures
  }
}

/**
 * Reads and deserializes a value from localStorage.
 * Returns null if the key is missing, unavailable, or parsing fails.
 * Never throws.
 */
export function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Type guard: returns true if value looks like a valid PurchaseCaseFile.
 * Never throws.
 */
export function isValidPurchaseCaseFile(value: unknown): value is PurchaseCaseFile {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v['id'] === 'string' &&
    typeof v['productName'] === 'string' &&
    typeof v['productUrl'] === 'string' &&
    (v['verdict'] === 'BUY' || v['verdict'] === 'WAIT' || v['verdict'] === 'SKIP') &&
    typeof v['confidence'] === 'number' &&
    typeof v['preferences'] === 'object' &&
    v['preferences'] !== null &&
    typeof v['timestamp'] === 'string'
  )
}

/**
 * Type guard: returns true if value looks like a valid PreferenceState.
 * Never throws.
 */
export function isValidPreferenceState(value: unknown): value is PreferenceState {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v['price'] === 'boolean' &&
    typeof v['reviews'] === 'boolean' &&
    typeof v['availability'] === 'boolean' &&
    typeof v['brandTrust'] === 'boolean' &&
    typeof v['sustainability'] === 'boolean'
  )
}
