/** Past subscription deliveries for “Bottles” history (Eric’s account). Sums to lifetime bottle count. */
export const DELIVERY_HISTORY = [
  { id: 'dh-1', date: 'Apr 4, 2026', bottles: 24, flavor: 'Peach Glow', plan: 'Peach Glow Plan' },
  { id: 'dh-2', date: 'Mar 7, 2026', bottles: 24, flavor: 'Berry Radiance', plan: 'Peach Glow Plan' },
  { id: 'dh-3', date: 'Feb 8, 2026', bottles: 24, flavor: 'Mixed rotation', plan: 'Peach Glow Plan' },
  { id: 'dh-4', date: 'Jan 10, 2026', bottles: 18, flavor: 'Citrus Boost trial', plan: 'Starter box' },
  { id: 'dh-5', date: 'Dec 12, 2025', bottles: 24, flavor: 'Peach Glow', plan: 'Peach Glow Plan' },
  { id: 'dh-6', date: 'Nov 14, 2025', bottles: 24, flavor: 'Tropical Shine', plan: 'Peach Glow Plan' },
  { id: 'dh-7', date: 'Oct 9, 2025', bottles: 24, flavor: 'Berry Radiance', plan: 'Peach Glow Plan' },
  { id: 'dh-8', date: 'Sep 2, 2025', bottles: 24, flavor: 'Peach Glow', plan: 'Peach Glow Plan' },
]

/** Total bottles from history (for display consistency). */
export const TOTAL_BOTTLES_DELIVERED = DELIVERY_HISTORY.reduce((acc, d) => acc + d.bottles, 0)

/** Per-friend referral earnings (demo data). */
export const REFERRAL_BREAKDOWN = [
  { id: 'rb-1', name: 'Lea Cini', handle: 'lea-cini', slug: 'lea-cini', amount: 10, status: 'credited', joined: 'Mar 2026' },
  { id: 'rb-2', name: 'Luca Conenna', handle: 'luca-conenna', slug: 'luca-conenna', amount: 10, status: 'credited', joined: 'Feb 2026' },
  { id: 'rb-3', name: 'Kabir Ahmad', handle: 'kabir-ahmad', slug: 'kabir-ahmad', amount: 10, status: 'credited', joined: 'Jan 2026' },
  { id: 'rb-4', name: 'Mikayla Rivera', handle: 'mikayla-rivera', slug: 'mikayla-rivera', amount: 10, status: 'credited', joined: 'Apr 2026' },
  { id: 'rb-5', name: 'Christian Knight', handle: 'christian-knight', slug: 'christian-knight', amount: 10, status: 'credited', joined: 'Dec 2025' },
]

export const TOTAL_REFERRAL_CREDIT = REFERRAL_BREAKDOWN.filter((r) => r.status === 'credited').reduce(
  (acc, r) => acc + r.amount,
  0,
)
