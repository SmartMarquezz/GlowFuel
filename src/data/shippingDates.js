/** Shared delivery date strings for Home + subscription flows */
export const SHIP_DATE_OPTIONS = [
  'Wed, May 14',
  'Thu, May 15',
  'Fri, May 16',
  'Mon, May 19',
  'Wed, May 21',
  'Mon, May 26',
  'Tue, Jun 3',
]

/** Next later slot (demo — moves one step; stays put on last index). */
export function getFollowingShipDate(current) {
  const idx = SHIP_DATE_OPTIONS.indexOf(current)
  if (idx < 0) return SHIP_DATE_OPTIONS[1] ?? SHIP_DATE_OPTIONS[0]
  if (idx >= SHIP_DATE_OPTIONS.length - 1) return SHIP_DATE_OPTIONS[idx]
  return SHIP_DATE_OPTIONS[idx + 1]
}
