import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COMMUNITY_MEMBERS, STORY_MEMBER_ORDER } from '../data/communitySeed'
import { useCommunityFeed } from '../context/useCommunityFeed'
import { useUserSession } from '../context/UserSessionProvider'
import { CommunityPostCard } from '../components/CommunityPostCard'
import { PostComposerModal } from '../components/PostComposerModal'

const tabs = [
  { id: 'all', label: 'All Posts' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'results', label: 'Results' },
  { id: 'recipes', label: 'Recipes' },
]

export function Community() {
  const [tab, setTab] = useState('all')
  const [composerOpen, setComposerOpen] = useState(false)
  const [profileSearch, setProfileSearch] = useState('')
  const { posts, toast } = useCommunityFeed()
  const { memberSlug } = useUserSession()

  const filtered = useMemo(() => {
    if (tab === 'all') return posts
    return posts.filter((p) => p.filter === tab)
  }, [posts, tab])

  const sortedMembers = useMemo(
    () => Object.values(COMMUNITY_MEMBERS).sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [],
  )

  const profileResults = useMemo(() => {
    const q = profileSearch.trim().toLowerCase()
    if (!q) return []
    return sortedMembers.filter(
      (m) =>
        m.displayName.toLowerCase().includes(q) ||
        m.slug.toLowerCase().includes(q) ||
        m.storyLabel.toLowerCase().includes(q),
    )
  }, [profileSearch, sortedMembers])

  return (
    <>
      <div className="scroll-stable relative flex min-h-dvh flex-col gap-4 overflow-y-auto pb-28 pt-7">
        <header className="px-4">
          <h1 className="text-2xl font-bold text-white">The Glow Community</h1>
          <p className="mt-1 text-sm font-light text-[#FFB3D1]">Real routines. Real radiance. Zero gatekeeping.</p>
        </header>

        <section className="px-4" aria-labelledby="classmates-search-title">
          <label id="classmates-search-title" className="sr-only">
            Search classmates
          </label>
          <div className="relative z-30">
            <input
              type="search"
              value={profileSearch}
              onChange={(e) => setProfileSearch(e.target.value)}
              placeholder="Search classmates by name or @handle…"
              autoComplete="off"
              className="w-full rounded-[18px] border border-white/10 bg-[#1A0A3E]/90 px-4 py-3 text-sm font-light text-white placeholder:text-[#FFB3D1]/45 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/35"
            />
            {profileSearch.trim() ? (
              <ul
                className="absolute left-0 right-0 top-full z-40 mt-1 max-h-52 space-y-1 overflow-y-auto rounded-[16px] border border-white/10 bg-[#1A0A3E]/97 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
                role="listbox"
                aria-label="Matching classmates"
              >
                {profileResults.length === 0 ? (
                  <li className="rounded-[12px] px-3 py-2.5 text-xs font-light text-[#FFB3D1]/80">No matches — try another spelling.</li>
                ) : (
                  profileResults.map((m) => (
                    <li key={m.slug}>
                      <Link
                        to={`/community/user/${m.slug}`}
                        onClick={() => setProfileSearch('')}
                        className="flex items-center gap-3 rounded-[14px] px-2 py-2 transition hover:bg-white/[0.08]"
                      >
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#0A0A2E] ring-1 ring-white/10">
                          {m.avatarImage ? (
                            <img src={m.avatarImage} alt="" className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E91E8C] to-[#7B2FBE] text-xs font-bold text-white">
                              {m.avatarInitial}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="truncate text-sm font-semibold text-white">{m.displayName}</p>
                          <p className="truncate text-xs font-light text-[#FFB3D1]/80">@{m.slug}</p>
                        </div>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
          <p className="mt-2 text-[11px] font-light leading-relaxed text-[#FFB3D1]/70">
            Use the horizontal story rings below to open profiles, or type in the search box to find someone by name.
          </p>
        </section>

        <div className="sticky top-0 z-20 -mx-1 bg-gradient-to-b from-[#0A0A2E]/92 to-transparent px-4 pb-2 pt-1 backdrop-blur-md">
          <div className="no-scrollbar flex gap-3 overflow-x-auto py-2">
            {STORY_MEMBER_ORDER.map((slug) => {
              const m = COMMUNITY_MEMBERS[slug]
              if (!m) return null
              const to = `/community/user/${slug}`
              const ringLabel = slug === memberSlug ? 'You' : m.storyLabel
              return (
                <Link key={slug} to={to} className="flex shrink-0 flex-col items-center gap-2">
                  <div
                    className={`flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-tr p-[2px] ${m.storyRing}`}
                  >
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#1A0A3E] text-sm font-semibold text-[#FFB3D1]">
                      {m.avatarImage ? (
                        <img src={m.avatarImage} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        m.avatarInitial
                      )}
                    </div>
                  </div>
                  <span className="max-w-[68px] truncate text-[11px] font-medium text-white/90">{ringLabel}</span>
                </Link>
              )
            })}
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-[#E91E8C] to-[#7B2FBE] text-white shadow-[0_0_20px_rgba(233,30,140,0.35)]'
                    : 'gf-glass text-[#FFB3D1] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 px-4">
          {filtered.length === 0 ? (
            <div className="gf-glass mt-4 rounded-[24px] p-8 text-center">
              <p className="text-4xl" aria-hidden="true">
                🌸
              </p>
              <p className="mt-3 text-lg font-semibold text-white">Nothing here yet</p>
              <p className="mt-2 text-sm font-light text-[#FFB3D1]">
                Be the first to share in this tab — tap Post Your Glow.
              </p>
            </div>
          ) : (
            filtered.map((post) => <CommunityPostCard key={post.id} post={post} />)
          )}
        </div>
      </div>

      <PostComposerModal open={composerOpen} onClose={() => setComposerOpen(false)} />

      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setComposerOpen(true)}
        className="gf-community-fab gf-magenta-btn z-[45] flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      >
        <span className="text-lg leading-none">＋</span>
        Post Your Glow
      </motion.button>

      {toast ? (
        <div className="gf-toast fixed left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-[70] w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[18px] border border-white/10 bg-[#1A0A3E]/95 px-4 py-3 text-center text-sm font-medium text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
          {toast}
        </div>
      ) : null}
    </>
  )
}
