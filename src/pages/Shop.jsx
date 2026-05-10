import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FLAVORS, REFERRAL_CODE, getReferralInviteUrl } from '../data/mock'
import { CAN_IMG, MOOD_IMG } from '../data/media'
import { IconCart } from '../components/Icons'
import { useCart } from '../context/useCart'

export function Shop() {
  const { addItem, count } = useCart()
  const navigate = useNavigate()
  const [mode, setMode] = useState('once') // once | subscribe
  const [adding, setAdding] = useState(null)
  const [inviteCopied, setInviteCopied] = useState(false)

  const formatted = useMemo(
    () =>
      FLAVORS.map((f) => ({
        ...f,
        displayPrice: mode === 'subscribe' ? `$${f.subPrice}/mo` : `$${f.singlePrice.toFixed(2)}`,
      })),
    [mode],
  )

  function handleAdd(flavor) {
    setAdding(flavor.sku)
    window.setTimeout(() => {
      addItem({
        sku: flavor.sku,
        name: flavor.name,
        mode,
        price: mode === 'subscribe' ? flavor.subPrice : flavor.singlePrice,
      })
      setAdding(null)
    }, 450)
  }

  async function handleCopyInviteLink() {
    const url = getReferralInviteUrl()
    const text = url || `GlowFuel referral ${REFERRAL_CODE} — add ?ref=${REFERRAL_CODE} at checkout`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        throw new Error('no-clipboard')
      }
      setInviteCopied(true)
      window.setTimeout(() => setInviteCopied(false), 2200)
    } catch {
      window.prompt('Copy this invite link:', text)
      setInviteCopied(false)
    }
  }

  function handleStartMonthlyGlow() {
    setAdding('GF-MONTHLY')
    window.setTimeout(() => {
      addItem({
        sku: 'GF-MONTHLY',
        name: 'GlowFuel Monthly — 24 cans',
        mode: 'subscribe',
        price: 110,
      })
      setAdding(null)
      navigate('/checkout')
    }, 450)
  }

  return (
    <div className="scroll-stable flex min-h-dvh flex-col gap-5 overflow-y-auto px-4 pb-28 pt-7">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Shop GlowFuel</h1>
          <p className="mt-1 text-sm font-light text-[#FFB3D1]">The night-berry can — bottled aurora energy.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="gf-glow-hover relative flex h-12 w-12 items-center justify-center rounded-[20px] gf-glass text-[#FFB3D1]"
          aria-label={`Cart, ${count} items. Open checkout.`}
        >
          <IconCart className="h-6 w-6" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E91E8C] px-1 text-[11px] font-bold text-white">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
      </header>

      <section className="gf-glass gf-glow-hover overflow-hidden rounded-[26px] ring-1 ring-white/10">
        <div className="relative grid gap-4 bg-gradient-to-br from-[#1A0A3E]/95 via-[#0A0A2E] to-[#1A0A3E] p-5 sm:grid-cols-[1fr_1.15fr] sm:items-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `url(${MOOD_IMG.marbleDark})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0A0A2E]/93 via-[#1A0A3E]/88 to-[#0A0A2E]/80" aria-hidden="true" />
          <div className="relative z-[1] flex justify-center sm:justify-start">
            <img
              src={CAN_IMG}
              alt="GlowFuel can — deep navy with aurora gradients and rose gold moon logo"
              className="h-[200px] w-auto max-w-full object-contain drop-shadow-[0_28px_60px_rgba(233,30,140,0.35)]"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="relative z-[1] text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A96E]">Flagship</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-white">Night Recovery, elevated.</h2>
            <p className="mt-2 text-sm font-light leading-relaxed text-[#FFB3D1]">
              Functional hydration with a moonlit finish — made for feeds, lockers, and late-night wind-downs.
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-white/70">
              Zero sugar · Electrolytes · B6 &amp; B12
            </p>
          </div>
        </div>
      </section>

      <div className="gf-glass flex rounded-[22px] p-1">
        <button
          type="button"
          onClick={() => setMode('once')}
          className={`flex-1 rounded-[18px] py-2.5 text-sm font-medium transition ${
            mode === 'once' ? 'gf-magenta-btn text-white' : 'text-[#FFB3D1]/80 hover:text-white'
          }`}
        >
          One-Time Purchase
        </button>
        <button
          type="button"
          onClick={() => setMode('subscribe')}
          className={`flex-1 rounded-[18px] py-2.5 text-sm font-medium transition ${
            mode === 'subscribe' ? 'gf-magenta-btn text-white' : 'text-[#FFB3D1]/80 hover:text-white'
          }`}
        >
          Subscribe &amp; Save 20%
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {formatted.map((f) => (
          <article key={f.sku} className="gf-glass gf-glow-hover flex flex-col rounded-[22px] p-4">
            <div className="relative mx-auto flex h-[7.5rem] w-full max-w-[9rem] items-center justify-center overflow-hidden rounded-[24px] bg-[#0A0A2E] ring-1 ring-white/10">
              <img
                src={CAN_IMG}
                alt={`${f.name} — GlowFuel sparkling recovery`}
                className="relative z-[1] h-[6.5rem] w-auto object-contain"
                loading="lazy"
              />
              <div
                className={`pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br ${f.gradient} opacity-[0.38] mix-blend-color`}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-[#0A0A2E]/55 to-transparent"
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-4 text-center text-sm font-bold text-white">{f.name}</h2>
            <p className="mt-1 text-center text-sm font-light text-[#FFB3D1]">{f.displayPrice}</p>
            <button
              type="button"
              disabled={adding === f.sku}
              onClick={() => handleAdd(f)}
              className="gf-magenta-btn mt-4 w-full rounded-[18px] py-2.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {adding === f.sku ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="gf-spinner !h-4 !w-4 !border-2" />
                  Adding…
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </article>
        ))}
      </div>

      <section className="gf-glass gf-subscribe-ring overflow-hidden rounded-[24px]">
        <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="relative mx-auto flex h-28 w-24 items-center justify-center overflow-hidden rounded-[20px] bg-[#0A0A2E]/80 ring-1 ring-[#E91E8C]/25">
            <img src={CAN_IMG} alt="" className="h-[5.5rem] w-auto object-contain opacity-95" loading="lazy" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">Most loved</p>
            <h2 className="mt-2 text-xl font-bold text-white">GlowFuel Monthly</h2>
            <p className="mt-2 text-sm font-light leading-relaxed text-[#FFB3D1]">
              24 curated cans / mo — rotate flavors or lock your glow. Free chill pack included.
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              $110<span className="text-sm font-light text-[#FFB3D1]"> / month</span>
            </p>
            <button
              type="button"
              disabled={adding === 'GF-MONTHLY'}
              onClick={handleStartMonthlyGlow}
              className="gf-magenta-btn mt-4 w-full rounded-[20px] py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
            >
              {adding === 'GF-MONTHLY' ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="gf-spinner !h-4 !w-4 !border-2" />
                  Adding…
                </span>
              ) : (
                'Start monthly glow'
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="gf-glass gf-glow-hover overflow-hidden rounded-[22px]">
        <div className="relative h-24 w-full">
          <img
            src={MOOD_IMG.abstractAurora}
            alt=""
            className="h-full w-full object-cover opacity-35"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A2E]/95 to-[#1A0A3E]/80" />
        </div>
        <div className="p-4">
          <p className="text-sm font-light text-[#FFB3D1]">
            Your referral code:{' '}
            <span className="font-semibold tracking-wide text-white">{REFERRAL_CODE}</span> — share and earn{' '}
            <span className="text-[#C9A96E]">$10</span> per friend.
          </p>
          <button
            type="button"
            onClick={() => void handleCopyInviteLink()}
            className="gf-glow-hover mt-3 w-full rounded-[18px] border border-[#C9A96E]/40 bg-[#C9A96E]/10 py-2.5 text-sm font-medium text-[#FFB3D1]"
          >
            {inviteCopied ? 'Copied!' : 'Copy invite link'}
          </button>
        </div>
      </section>
    </div>
  )
}
