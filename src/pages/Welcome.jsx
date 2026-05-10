import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuroraBackground } from '../components/AuroraBackground'
import { GlowFuelLogo } from '../components/GlowFuelLogo'
import { COMMUNITY_MEMBERS, findClassmateMatches, STORY_MEMBER_ORDER } from '../data/communitySeed'
import { useUserSession } from '../context/UserSessionProvider'

const CLASS_SNIPPETS = [
  'One shared app. Your name is your passkey.',
  'Pick yourself — this device remembers your glow.',
  'Dana approved the ring light energy.',
]

export function Welcome() {
  const navigate = useNavigate()
  const { signIn } = useUserSession()
  const [name, setName] = useState('')
  const [step, setStep] = useState('enter')
  const [candidates, setCandidates] = useState([])
  const [hint, setHint] = useState(null)
  const [snippetIdx, setSnippetIdx] = useState(0)

  const roster = useMemo(
    () =>
      STORY_MEMBER_ORDER.map((slug) => COMMUNITY_MEMBERS[slug]).filter(Boolean).sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      ),
    [],
  )

  function tryMatch() {
    setHint(null)
    const { exact, candidates: c } = findClassmateMatches(name)
    if (exact) {
      signIn(exact)
      navigate('/', { replace: true })
      return
    }
    if (c.length > 1) {
      setCandidates(c)
      setStep('pick')
      return
    }
    if (c.length === 1) {
      signIn(c[0])
      navigate('/', { replace: true })
      return
    }
    setStep('roster')
    setHint('No auto-match — tap your sparkle in the class grid below.')
  }

  function pickSlug(slug) {
    signIn(slug)
    navigate('/', { replace: true })
  }

  function goBackToEnter() {
    setStep('enter')
    setCandidates([])
    setHint(null)
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#0A0A2E]">
      <AuroraBackground />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-5 pb-14 pt-9">
        <header className="flex flex-col items-center gap-3 text-center">
          <GlowFuelLogo />
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C9A96E]">Class glow lounge</p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[1.55rem] font-bold leading-tight text-white"
          >
            Claim your{' '}
            <span className="bg-gradient-to-r from-[#FFB3D1] via-[#E91E8C] to-[#C9A96E] bg-clip-text text-transparent">
              corner
            </span>{' '}
            of the feed
          </motion.h1>
          <motion.p
            key={snippetIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[19rem] text-sm font-light leading-relaxed text-[#FFB3D1]/90"
          >
            {CLASS_SNIPPETS[snippetIdx]}{' '}
            <button
              type="button"
              className="text-[#C9A96E] underline decoration-[#C9A96E]/40 underline-offset-2"
              onClick={() => setSnippetIdx((i) => (i + 1) % CLASS_SNIPPETS.length)}
            >
              Next tip
            </button>
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {step === 'enter' ? (
            <motion.section
              key="enter"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-9 flex flex-1 flex-col gap-6"
            >
              <div className="relative">
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-tr from-[#E91E8C]/40 via-[#7B2FBE]/25 to-[#C9A96E]/35 opacity-80 blur-md"
                  animate={{ rotate: [0, 3, -2, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <label className="relative block rounded-[26px] border border-white/10 bg-[#1A0A3E]/85 p-5 shadow-[0_0_40px_rgba(233,30,140,0.12)] backdrop-blur-md">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">Your roster name</span>
                  <input
                    autoComplete="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') tryMatch()
                    }}
                    placeholder="e.g. Lea Cini or @lea-cini"
                    className="mt-3 w-full rounded-[18px] border border-white/10 bg-[#0A0A2E]/80 px-4 py-3.5 text-base font-medium text-white placeholder:text-[#FFB3D1]/40 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/45"
                  />
                  <p className="mt-3 text-[11px] font-light leading-relaxed text-[#FFB3D1]/65">
                    Type what&apos;s on the class list — we map it to your profile. Handles work too.
                  </p>
                </label>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => tryMatch()}
                disabled={!name.trim()}
                className="gf-magenta-btn rounded-[22px] py-4 text-sm font-semibold text-white shadow-[0_0_28px_rgba(233,30,140,0.35)] disabled:cursor-not-allowed disabled:opacity-35"
              >
                Step into the glow ring →
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setStep('roster')
                  setHint('Browse everyone — tap your face when you spot it.')
                }}
                className="text-center text-xs font-medium text-[#FFB3D1]/80 underline decoration-white/10 underline-offset-4"
              >
                I&apos;d rather scroll the whole class
              </button>
            </motion.section>
          ) : null}

          {step === 'pick' ? (
            <motion.section
              key="pick"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-8 flex flex-1 flex-col gap-4"
            >
              <p className="text-center text-sm font-light text-[#FFB3D1]">
                A few names lit up — <span className="font-semibold text-white">which one is you?</span>
              </p>
              <ul className="flex max-h-[min(52vh,420px)] flex-col gap-2 overflow-y-auto pr-1">
                {candidates.map((slug, i) => {
                  const m = COMMUNITY_MEMBERS[slug]
                  if (!m) return null
                  return (
                    <motion.li
                      key={slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        type="button"
                        onClick={() => pickSlug(slug)}
                        className="flex w-full items-center gap-3 rounded-[20px] border border-white/10 bg-[#1A0A3E]/80 px-4 py-3 text-left transition hover:border-[#E91E8C]/35 hover:bg-white/[0.06]"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#0A0A2E] ring-2 ring-[#E91E8C]/25">
                          {m.avatarImage ? (
                            <img src={m.avatarImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E91E8C] to-[#7B2FBE] text-sm font-bold text-white">
                              {m.avatarInitial}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{m.displayName}</p>
                          <p className="truncate text-xs text-[#FFB3D1]/75">@{slug}</p>
                        </div>
                        <span className="shrink-0 text-lg text-[#C9A96E]" aria-hidden>
                          ✦
                        </span>
                      </button>
                    </motion.li>
                  )
                })}
              </ul>
              <button
                type="button"
                onClick={goBackToEnter}
                className="mt-2 text-sm font-medium text-[#FFB3D1]/85 underline decoration-white/15"
              >
                ← Try a different spelling
              </button>
            </motion.section>
          ) : null}

          {step === 'roster' ? (
            <motion.section
              key="roster"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-6 flex flex-1 flex-col gap-3"
            >
              {hint ? (
                <p className="rounded-[16px] border border-[#C9A96E]/25 bg-[#C9A96E]/10 px-3 py-2 text-center text-xs font-light text-[#FFB3D1]">
                  {hint}
                </p>
              ) : null}
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">
                Class constellation
              </p>
              <div className="no-scrollbar grid max-h-[min(54vh,480px)] grid-cols-2 gap-2 overflow-y-auto pb-4">
                {roster.map((m, i) => (
                  <motion.button
                    key={m.slug}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.4) }}
                    onClick={() => pickSlug(m.slug)}
                    className="group flex flex-col items-center gap-2 rounded-[20px] border border-white/10 bg-[#1A0A3E]/70 p-3 transition hover:border-[#E91E8C]/40 hover:shadow-[0_0_20px_rgba(233,30,140,0.2)]"
                  >
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr p-[2px] ${m.storyRing}`}
                    >
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0A0A2E] text-sm font-semibold text-[#FFB3D1]">
                        {m.avatarImage ? (
                          <img src={m.avatarImage} alt="" className="h-full w-full object-cover" />
                        ) : (
                          m.avatarInitial
                        )}
                      </div>
                    </div>
                    <span className="line-clamp-2 w-full text-center text-[11px] font-medium leading-tight text-white">
                      {m.displayName}
                    </span>
                  </motion.button>
                ))}
              </div>
              <button
                type="button"
                onClick={goBackToEnter}
                className="text-sm font-medium text-[#FFB3D1]/85 underline decoration-white/15"
              >
                ← Back to name entry
              </button>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
