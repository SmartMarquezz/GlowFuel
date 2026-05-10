import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useHomeActivity } from '../context/useHomeActivity'

function formatMoney(n) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, removeItem, clearCart } = useCart()
  const {
    glowPointsBalance,
    deductGlowPoints,
    pointsPerFiveDollars,
    dollarsPerRedemption,
  } = useHomeActivity()

  const [redemptionBlocks, setRedemptionBlocks] = useState(0)
  const [status, setStatus] = useState(null)

  const maxBlocks = useMemo(() => {
    if (subtotal <= 0) return 0
    const fromBalance = Math.floor(glowPointsBalance / pointsPerFiveDollars)
    const fromTotal = Math.floor(subtotal / dollarsPerRedemption)
    return Math.max(0, Math.min(fromBalance, fromTotal))
  }, [subtotal, glowPointsBalance, pointsPerFiveDollars, dollarsPerRedemption])

  const blocksApplied = Math.min(redemptionBlocks, maxBlocks)
  const discount = blocksApplied * dollarsPerRedemption
  const pointsUsed = blocksApplied * pointsPerFiveDollars
  const total = Math.max(0, subtotal - discount)

  function adjustBlocks(delta) {
    setRedemptionBlocks((b) => {
      const current = Math.min(b, maxBlocks)
      const next = current + delta
      return Math.max(0, Math.min(maxBlocks, next))
    })
  }

  function placeOrder() {
    if (items.length === 0) return
    deductGlowPoints(pointsUsed)
    clearCart()
    setRedemptionBlocks(0)
    setStatus('success')
    window.setTimeout(() => {
      setStatus(null)
      navigate('/shop')
    }, 2200)
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 pb-28 pt-10 text-center">
        <p className="text-5xl" aria-hidden="true">
          ✓
        </p>
        <h1 className="text-xl font-bold text-white">Order placed</h1>
        <p className="text-sm font-light text-[#FFB3D1]">Thanks — your glow is on the way.</p>
      </div>
    )
  }

  return (
    <div className="scroll-stable flex min-h-dvh flex-col gap-5 overflow-y-auto px-4 pb-28 pt-7">
      <header className="flex items-center gap-3">
        <Link
          to="/shop"
          className="gf-glow-hover flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-[#FFB3D1]"
          aria-label="Back to Shop"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
          <p className="text-sm font-light text-[#FFB3D1]">Review, redeem Glow Points, pay.</p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="gf-glass rounded-[24px] p-8 text-center">
          <p className="text-sm font-light text-[#FFB3D1]">Your cart is empty.</p>
          <Link to="/shop" className="gf-magenta-btn mt-4 inline-block rounded-[20px] px-6 py-3 text-sm font-semibold text-white">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">Your cart</h2>
            {items.map((i) => (
              <div
                key={i.id}
                className="gf-glass flex items-start justify-between gap-3 rounded-[20px] border border-white/10 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white">{i.name}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#FFB3D1]/70">
                    {i.mode === 'subscribe' ? 'Subscribe' : 'One-time'}
                  </p>
                  <p className="mt-1 text-sm text-[#C9A96E]">{formatMoney(Number(i.price))}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i.id)}
                  className="shrink-0 text-xs font-semibold text-[#E91E8C] hover:text-[#FFB3D1]"
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <section className="gf-glass rounded-[22px] p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">Glow Points</h2>
            <p className="mt-2 text-sm font-light text-[#FFB3D1]">
              Balance:{' '}
              <span className="font-semibold text-white">{glowPointsBalance.toLocaleString()} pts</span> · every{' '}
              {pointsPerFiveDollars} pts = {formatMoney(dollarsPerRedemption)} off
            </p>
            {maxBlocks === 0 ? (
              <p className="mt-2 text-xs font-light text-white/50">
                {subtotal < dollarsPerRedemption
                  ? 'Add more to your cart to use a $5 reward.'
                  : 'Not enough Glow Points for a $5 reward yet.'}
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-white">Apply {formatMoney(dollarsPerRedemption)} off blocks:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustBlocks(-1)}
                    disabled={blocksApplied <= 0}
                    className="gf-glow-hover flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/15 bg-white/5 text-lg text-white disabled:opacity-35"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-lg font-bold text-white">{blocksApplied}</span>
                  <button
                    type="button"
                    onClick={() => adjustBlocks(1)}
                    disabled={blocksApplied >= maxBlocks}
                    className="gf-glow-hover flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/15 bg-white/5 text-lg text-white disabled:opacity-35"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            {blocksApplied > 0 && (
              <p className="mt-2 text-xs font-light text-[#FFB3D1]">
                Using {pointsUsed.toLocaleString()} pts for {formatMoney(discount)} off.
              </p>
            )}
          </section>

          <section className="gf-glass rounded-[22px] p-4">
            <div className="flex justify-between text-sm text-[#FFB3D1]">
              <span>Subtotal</span>
              <span className="text-white">{formatMoney(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="mt-2 flex justify-between text-sm text-[#C9A96E]">
                <span>Glow Points</span>
                <span>−{formatMoney(discount)}</span>
              </div>
            )}
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
            <p className="mt-3 text-[11px] font-light text-white/45">
              Demo only — no card is charged. Place order applies points and clears your cart.
            </p>
            <button
              type="button"
              onClick={placeOrder}
              className="gf-magenta-btn mt-4 w-full rounded-[20px] py-3.5 text-sm font-semibold text-white"
            >
              Place order
            </button>
          </section>
        </>
      )}
    </div>
  )
}
