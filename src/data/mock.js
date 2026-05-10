export const REFERRAL_CODE = 'GLOW-7K2M'
export const USER_NAME = 'Eric'

export const FLAVORS = [
  {
    sku: 'peach-glow',
    name: 'Peach Glow',
    gradient: 'from-[#FF6B6B] to-[#E91E8C]',
    singlePrice: 5.5,
    subPrice: 110,
  },
  {
    sku: 'berry-radiance',
    name: 'Berry Radiance',
    gradient: 'from-[#E91E8C] to-[#7B2FBE]',
    singlePrice: 5.5,
    subPrice: 110,
  },
  {
    sku: 'citrus-boost',
    name: 'Citrus Boost',
    gradient: 'from-[#FFB3D1] to-[#FF6B6B]',
    singlePrice: 5.5,
    subPrice: 110,
  },
  {
    sku: 'tropical-shine',
    name: 'Tropical Shine',
    gradient: 'from-[#7B2FBE] to-[#FF6B6B]',
    singlePrice: 5.5,
    subPrice: 110,
  },
]

/** Client-only: shareable shop URL including referral code */
export function getReferralInviteUrl() {
  if (typeof window === 'undefined') return ''
  try {
    const u = new URL('/shop', window.location.href)
    u.searchParams.set('ref', REFERRAL_CODE)
    return u.toString()
  } catch {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    return `${base}/shop?ref=${encodeURIComponent(REFERRAL_CODE)}`
  }
}

/**
 * Web Share API if available; otherwise copies invite text + URL to clipboard.
 * @returns {'shared'|'copied'|'aborted'}
 */
export async function shareReferralInvite(fromName = 'GlowFuel') {
  const url = getReferralInviteUrl()
  const text = `Join me on GlowFuel — use code ${REFERRAL_CODE} for $10 credit on your first order.`
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: `${fromName} invites you to GlowFuel`,
        text,
        url: url || undefined,
      })
      return 'shared'
    } catch (e) {
      if (e?.name === 'AbortError') return 'aborted'
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    const payload = url ? `${text}\n${url}` : `${text}\nCode: ${REFERRAL_CODE}`
    await navigator.clipboard.writeText(payload)
    return 'copied'
  }
  throw new Error('Share and clipboard are not available')
}
