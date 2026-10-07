// Helpers shared by the server and the browser, so both compute the same class
// name for the same column layout.

export const PACKAGE_COLUMNS = 'minmax(12rem, 2fr) 7rem 9rem 6rem'

// FNV-1a, 32-bit. Stable and short; not a security hash.
function fnv1a(input: string): string {
  let hash = 0x811c9dc5

  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }

  return (hash >>> 0).toString(36)
}

export function gridClassName(columns: string): string {
  return `g-${fnv1a(columns)}`
}

// A grid-template-columns value needs letters, digits, spaces, dots, commas,
// hyphens, percent signs and parentheses - nothing that can close a rule or
// open a new one.
const TRACK_LIST = /^[a-z0-9.%(),\s-]{1,200}$/i

export function isValidTrackList(columns: string): boolean {
  return TRACK_LIST.test(columns)
}
