import { useLayoutEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GlowFuelLogo } from '../components/GlowFuelLogo'
import { CAN_IMG, MOOD_IMG } from '../data/media'
import { useHomeActivity } from '../context/useHomeActivity'
import { useUserSession } from '../context/UserSessionProvider'

const highlights = [
  {
    user: '@christopher-harris',
    snippet: 'Peach Glow hits different after leg day ✨',
    image: MOOD_IMG.strengthTraining,
    accent: 'from-[#FF6B6B]/30 to-[#E91E8C]/30',
    postId: 'p-2',
  },
  {
    user: '@lea-cini',
    snippet: 'Berry Radiance + sunset run = perfect combo',
    image: MOOD_IMG.nightRUN,
    accent: 'from-[#7B2FBE]/30 to-[#E91E8C]/30',
    postId: 'p-3',
  },
  {
    user: '@ericmarquez',
    snippet: 'Class demo energy — recovery never looked this good 💗',
    image: CAN_IMG,
    accent: 'from-[#FFB3D1]/20 to-[#7B2FBE]/30',
    postId: 'p-6',
  },
]

export function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const { member } = useUserSession()
  const greetingName = member?.displayName.trim().split(/\s+/)[0] ?? 'Glow'
  const {
    deliveryScheduled,
    deliveryDate,
    deliveryFlavor,
    deliveryPack,
    FLAVORS,
    DATE_OPTIONS,
    applyDeliveryEdit,
    cancelDelivery,
    resumeDelivery,
    challengeComplete,
    challengePoints,
    glowPointsBalance,
    completeChallenge,
  } = useHomeActivity()

  const [modifyOpen, setModifyOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [planPerksOpen, setPlanPerksOpen] = useState(false)
  const [editFlavor, setEditFlavor] = useState(deliveryFlavor)
  const [editDate, setEditDate] = useState(deliveryDate)

  // sync local edit state when opening modify
  function openModify() {
    setEditFlavor(deliveryFlavor)
    setEditDate(deliveryDate)
    setModifyOpen(true)
  }

  useLayoutEffect(() => {
    if (!location.state?.openDeliveryEdit) return
    resumeDelivery()
    setEditFlavor(deliveryFlavor)
    setEditDate(deliveryDate)
    setModifyOpen(true)
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.state?.openDeliveryEdit, deliveryFlavor, deliveryDate, location.pathname, navigate, resumeDelivery])

  function saveModify() {
    applyDeliveryEdit({ flavor: editFlavor, date: editDate })
    setModifyOpen(false)
  }

  return (
    <div className="scroll-stable flex min-h-dvh flex-col gap-6 overflow-y-auto px-4 pb-28 pt-6">
      <header className="flex flex-col items-center gap-5">
        <GlowFuelLogo />
        <div className="w-full text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A96E]">Sparkling recovery</p>
          <h1 className="mt-2 text-[1.65rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[1.75rem]">
            Recover like it&apos;s{' '}
            <span className="bg-gradient-to-r from-[#FFB3D1] via-white to-[#C9A96E] bg-clip-text text-transparent">
              luxury
            </span>
            .
          </h1>
          <p className="mx-auto mt-3 max-w-[20rem] text-base font-light leading-relaxed text-[#FFB3D1]">
            Hey <span className="font-semibold text-white">{greetingName}</span> — hydrate bold tonight, glow louder
            tomorrow.
          </p>
          <div className="mx-auto mt-5 flex max-w-[20rem] gap-3">
            <Link
              to="/shop"
              className="gf-magenta-btn flex-1 rounded-[20px] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Shop the can
            </Link>
            <Link
              to="/community"
              className="gf-glow-hover flex-1 rounded-[20px] border border-white/20 bg-white/5 py-3 text-center text-sm font-semibold text-white"
            >
              See the feed
            </Link>
          </div>
        </div>
      </header>

      <section className="gf-glass gf-glow-hover overflow-hidden rounded-[28px] ring-1 ring-[#C9A96E]/15">
        <div className="relative bg-gradient-to-br from-[#1A0A3E]/95 via-[#0A0A2E] to-[#1A0A3E]/90 px-4 pb-5 pt-6">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#E91E8C]/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-[#7B2FBE]/30 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A96E]">
              The bottle
            </p>
            <img
              src={CAN_IMG}
              alt="GlowFuel sparkling recovery drink can — night berry edition with rose gold moon logo"
              className="relative z-[1] mt-2 h-[220px] w-auto max-w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
              loading="eager"
              decoding="async"
            />
            <p className="relative z-[1] mt-2 max-w-[17rem] text-center text-xs font-light leading-relaxed text-[#FFB3D1]">
              Zero sugar ritual. Electrolytes + B vitamins — styled for your camera roll.
            </p>
          </div>
        </div>
      </section>

      <section className="gf-glass gf-glow-hover rounded-[24px] p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-[4.5rem] w-[3.25rem] shrink-0 overflow-hidden rounded-[16px] bg-[#0A0A2E] ring-1 ring-white/10">
            <img src={CAN_IMG} alt="" className="h-full w-full object-contain object-center p-0.5" loading="lazy" />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A0A3E]/80 to-transparent"
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">Membership</p>
            <h2 className="mt-1 text-xl font-bold leading-snug text-white">Active — Peach Glow Plan</h2>
            <p className="mt-2 text-sm font-light leading-relaxed text-[#FFB3D1]">
              Perks stack with streaks. Rose-gold referrals pay you back in credits.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPlanPerksOpen(true)}
          className="gf-glow-hover mt-4 w-full rounded-[20px] border border-white/15 bg-white/5 py-3 text-sm font-medium text-white"
        >
          View plan perks
        </button>
      </section>

      <section>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/90">This month at a glance</h2>
        <p className="mb-3 text-[11px] font-light leading-relaxed text-[#FFB3D1]/90">
          Membership snapshot: what&apos;s left in your current shipment, your app check-in streak, and referral credits
          you can spend in Shop.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Bottles left',
              value: '18',
              sub: 'this cycle',
              hint: 'Cans still in your active monthly box before we ship the next refill.',
            },
            {
              label: 'Streak',
              value: '12',
              sub: 'days',
              hint: 'Days in a row you opened the app or finished a daily challenge — keeps perks stacking.',
            },
            {
              label: 'Referrals',
              value: '5',
              sub: '$50 credit',
              hint: 'Friends who joined with your code; credits apply automatically at checkout.',
            },
          ].map((s) => (
            <div key={s.label} className="gf-glass gf-glow-hover rounded-[22px] px-2 py-3 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/90">{s.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-white">{s.value}</p>
              <p className="mt-0.5 text-[10px] font-light text-white/70">{s.sub}</p>
              <p className="mt-2 border-t border-white/10 pt-2 text-[9px] font-light leading-snug text-white/55">
                {s.hint}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="gf-glass gf-glow-hover rounded-[24px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">Your next delivery</p>
            {deliveryScheduled ? (
              <>
                <h2 className="mt-2 text-xl font-bold text-white">{deliveryDate}</h2>
                <p className="mt-1 text-sm font-light text-[#FFB3D1]">
                  {deliveryFlavor} — {deliveryPack}
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-xl font-bold text-white">No delivery scheduled</h2>
                <p className="mt-1 text-sm font-light text-[#FFB3D1]">
                  Resume your plan anytime from Shop or subscription settings.
                </p>
              </>
            )}
          </div>
          {deliveryScheduled ? (
            <span className="shrink-0 rounded-full bg-[#E91E8C]/25 px-3 py-1 text-[11px] font-semibold text-[#FFB3D1] ring-1 ring-[#E91E8C]/30">
              Scheduled
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70 ring-1 ring-white/15">
              Paused
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {!deliveryScheduled ? (
            <button
              type="button"
              onClick={() => {
                resumeDelivery()
                openModify()
              }}
              className="gf-magenta-btn w-full rounded-[20px] py-3 text-sm font-semibold text-white sm:flex-1"
            >
              Resume &amp; reschedule
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={openModify}
                className="gf-magenta-btn flex-1 rounded-[20px] py-3 text-sm font-semibold text-white"
              >
                Modify
              </button>
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="gf-glow-hover flex-1 rounded-[20px] border border-white/20 bg-white/5 py-3 text-sm font-medium text-white"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </section>

      <section className="gf-glass gf-glow-hover rounded-[24px] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Daily challenge</h2>
          <span className="shrink-0 rounded-full bg-[#C9A96E]/15 px-2.5 py-1 text-[11px] font-semibold text-[#C9A96E] ring-1 ring-[#C9A96E]/25">
            +{challengePoints} pts
          </span>
        </div>
        <p className="mt-3 text-[15px] font-light leading-relaxed text-[#FFB3D1]">
          Post your post-workout glow — tag <span className="font-semibold text-white">#GlowFuelGirls</span> and keep
          the can in frame.
        </p>
        <div className="mt-4 rounded-[18px] border border-[#C9A96E]/25 bg-[#C9A96E]/10 px-4 py-3 text-xs font-light leading-relaxed text-[#FFB3D1]">
          <p className="font-semibold text-white">Glow Points ({glowPointsBalance.toLocaleString()} total)</p>
          <p className="mt-2">
            Points convert to <span className="text-white">shop credit</span> and{' '}
            <span className="text-white">subscriber perks</span>. Every 500 pts unlocks{' '}
            <span className="font-semibold text-[#C9A96E]">$5 off</span> at checkout; 1,000 pts can be exchanged for a{' '}
            <span className="font-semibold text-white">free 4-pack add-on</span> or early access drops in the Shop.
          </p>
        </div>
        <button
          type="button"
          disabled={challengeComplete}
          onClick={completeChallenge}
          className="gf-magenta-btn mt-4 w-full rounded-[20px] py-3.5 text-sm font-semibold text-white disabled:cursor-default disabled:opacity-70"
        >
          {challengeComplete ? `Completed — +${challengePoints} pts added` : 'Mark as done'}
        </button>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 className="text-lg font-bold text-white">Community highlights</h2>
          <Link to="/community" className="text-xs font-semibold text-[#C9A96E] hover:text-[#FFB3D1]">
            Open feed
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {highlights.map((h) => (
            <article
              key={h.user}
              className="gf-glass gf-glow-hover flex gap-3 overflow-hidden rounded-[22px] p-3"
            >
              <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[18px] ring-1 ring-white/10">
                <img src={h.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${h.accent}`}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{h.user}</p>
                <p className="mt-1 text-sm font-light leading-snug text-[#FFB3D1]">{h.snippet}</p>
                <Link
                  to={`/community/post/${h.postId}`}
                  className="mt-2 inline-block text-xs font-medium text-[#C9A96E] transition hover:text-[#FFB3D1]"
                >
                  View post →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {planPerksOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="plan-perks-title">
          <button
            type="button"
            className="absolute inset-0 bg-[#0A0A2E]/85 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setPlanPerksOpen(false)}
          />
          <div className="relative z-[1] mx-auto max-h-[min(85dvh,540px)] w-full max-w-[390px] overflow-hidden rounded-t-[26px] border border-white/10 gf-glass sm:max-h-[80dvh] sm:rounded-[26px]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 id="plan-perks-title" className="text-base font-bold text-white">
                Peach Glow Plan perks
              </h2>
              <button
                type="button"
                onClick={() => setPlanPerksOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-white/10 bg-white/5 text-[#FFB3D1]"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="scroll-stable max-h-[min(70dvh,460px)] overflow-y-auto px-4 pb-6 pt-4">
              <p className="text-sm font-light leading-relaxed text-[#FFB3D1]">
                Everything included with your active membership — stack more as your streak and referrals grow.
              </p>
              <ul className="mt-4 space-y-3 text-sm font-light text-[#FFB3D1]">
                {[
                  '24 chilled cans per billing cycle — rotate flavors or lock your favorite before each ship.',
                  'Subscriber pricing: about 20% off versus one-time packs in Shop.',
                  `Glow Points boost — complete daily challenges on Home (earn up to +${challengePoints} pts when you finish today’s).`,
                  'Redeem 500 pts for $5 off at checkout; bigger redemptions unlock add-ons and drop access.',
                  'Monthly insulated shipper included so your box arrives cold and photo-ready.',
                  'Pause deliveries or push your next ship date anytime from Home — your plan stays active when you skip.',
                  'Referral credits stack: friends who join with your code credit your account automatically.',
                ].map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3"
                  >
                    <span className="shrink-0 text-[#C9A96E]" aria-hidden="true">
                      ✦
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setPlanPerksOpen(false)}
                className="gf-magenta-btn mt-5 w-full rounded-[20px] py-3 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {modifyOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-[#0A0A2E]/85 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setModifyOpen(false)}
          />
          <div className="relative z-[1] mx-auto w-full max-w-[390px] rounded-t-[26px] border border-white/10 gf-glass p-5 sm:rounded-[26px]">
            <h2 className="text-lg font-bold text-white">Modify delivery</h2>
            <p className="mt-1 text-xs font-light text-[#FFB3D1]">Update your next box before it locks for packing.</p>
            <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">Flavor</label>
            <select
              value={editFlavor}
              onChange={(e) => setEditFlavor(e.target.value)}
              className="mt-2 w-full rounded-[18px] border border-white/10 bg-[#1A0A3E]/90 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/35"
            >
              {FLAVORS.map((f) => (
                <option key={f} value={f} className="bg-[#1A0A3E] text-white">
                  {f}
                </option>
              ))}
            </select>
            <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">
              Delivery date
            </label>
            <select
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="mt-2 w-full rounded-[18px] border border-white/10 bg-[#1A0A3E]/90 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/35"
            >
              {DATE_OPTIONS.map((d) => (
                <option key={d} value={d} className="bg-[#1A0A3E] text-white">
                  {d}
                </option>
              ))}
            </select>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setModifyOpen(false)}
                className="gf-glow-hover flex-1 rounded-[20px] border border-white/15 bg-white/5 py-3 text-sm font-medium text-white"
              >
                Discard
              </button>
              <button type="button" onClick={saveModify} className="gf-magenta-btn flex-1 rounded-[20px] py-3 text-sm font-semibold text-white">
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4" role="alertdialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-[#0A0A2E]/88 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setCancelOpen(false)}
          />
          <div className="relative z-[1] w-full max-w-[340px] rounded-[24px] border border-white/10 gf-glass p-6">
            <h2 className="text-lg font-bold text-white">Cancel this delivery?</h2>
            <p className="mt-2 text-sm font-light text-[#FFB3D1]">
              Your May box will be skipped. You can reschedule from Shop or membership settings.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setCancelOpen(false)}
                className="gf-glow-hover flex-1 rounded-[20px] border border-white/15 bg-white/5 py-3 text-sm font-medium text-white"
              >
                Keep delivery
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelDelivery()
                  setCancelOpen(false)
                }}
                className="flex-1 rounded-[20px] bg-[#E91E8C]/90 py-3 text-sm font-semibold text-white ring-1 ring-[#E91E8C]/50"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
