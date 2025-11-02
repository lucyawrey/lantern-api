/**
 * Gets the current unix timestamp in seconds. Useful because SQLite uses this format.
 * @returns unix integer timestamp in the `number` type.
 */
export function now() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Gets a Date object from a unix timestamp in seconds.
 * @param timestamp unix timestamp value in seconds.
 * @returns
 */
export function toDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}
