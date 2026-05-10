import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CAN_IMG } from '../data/media'
import { useCommunityFeed } from '../context/useCommunityFeed'

function formatLikes(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function CommunityPostCard({ post, className = '', manageActions = null }) {
  const { toggleLike, addComment, sharePost } = useCommunityFeed()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [draft, setDraft] = useState('')

  const profileTo = `/community/user/${post.memberSlug}`

  function submitComment() {
    addComment(post.id, draft)
    setDraft('')
  }

  return (
    <article className={`gf-glass gf-glow-hover overflow-hidden rounded-[24px] ${className}`}>
      <div className="flex items-center gap-3 p-4 pb-3">
        <Link
          to={profileTo}
          className="flex h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#E91E8C] to-[#7B2FBE] text-sm font-bold text-white ring-1 ring-white/10"
          aria-label={`View ${post.user}'s profile`}
        >
          {post.verified ? (
            <img src={CAN_IMG} alt="" className="h-full w-full object-cover opacity-90" loading="lazy" />
          ) : (
            <span className="flex h-full w-full items-center justify-center">{post.user[0]}</span>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={profileTo} className="truncate text-sm font-semibold text-white hover:text-[#FFB3D1]">
              {post.user}
            </Link>
            {post.verified && (
              <span className="shrink-0 rounded-full bg-[#C9A96E]/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#C9A96E]">
                GlowFuel Verified
              </span>
            )}
          </div>
          <Link
            to={profileTo}
            className="block truncate text-left text-xs font-light text-[#FFB3D1]/90 hover:text-[#FFB3D1]"
          >
            {post.handle} · {post.time}
          </Link>
        </div>
      </div>

      {manageActions ? (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/10 px-4 py-2.5">
          {manageActions.feedHref ? (
            <Link
              to={manageActions.feedHref}
              onClick={manageActions.onNavigate}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#C9A96E] ring-1 ring-[#C9A96E]/35 hover:text-[#FFB3D1]"
            >
              View in feed
            </Link>
          ) : null}
          <button
            type="button"
            onClick={manageActions.onEdit}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={manageActions.onDelete}
            className="rounded-full bg-[#E91E8C]/20 px-3 py-1.5 text-xs font-semibold text-[#FFB3D1] ring-1 ring-[#E91E8C]/35 hover:bg-[#E91E8C]/30"
          >
            Delete
          </button>
        </div>
      ) : null}

      <div className="relative mx-4 h-52 overflow-hidden rounded-[20px] ring-1 ring-white/10">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A2E]/75 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      <p className="px-4 py-3 text-sm font-light leading-relaxed text-[#FFB3D1]">{post.caption}</p>

      <div className="flex flex-wrap items-center gap-4 border-t border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className={`text-sm font-semibold transition hover:drop-shadow-[0_0_10px_rgba(233,30,140,0.45)] ${
            post.likedByMe ? 'text-[#FFB3D1]' : 'text-[#E91E8C]'
          } hover:text-[#FFB3D1]`}
        >
          {post.likedByMe ? '♥ Liked' : '♥ Like'} · {formatLikes(post.likes)}
        </button>
        <button
          type="button"
          onClick={() => setCommentsOpen((o) => !o)}
          className="text-sm font-semibold text-[#C9A96E] transition hover:text-[#FFB3D1]"
        >
          💬 Comment{post.comments.length ? ` · ${post.comments.length}` : ''}
        </button>
        <button
          type="button"
          onClick={() => sharePost(post)}
          className="text-sm font-semibold text-[#FFB3D1] transition hover:text-white"
        >
          ↗ Share
        </button>
      </div>

      {commentsOpen && (
        <div className="border-t border-white/10 px-4 py-3">
          <ul className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {post.comments.length === 0 ? (
              <li className="text-xs font-light text-[#FFB3D1]/70">No comments yet — start the thread.</li>
            ) : (
              post.comments.map((c) => (
                <li key={c.id} className="rounded-[14px] bg-white/[0.04] px-3 py-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      to={`/community/user/${c.authorSlug}`}
                      className="text-xs font-semibold text-white hover:text-[#FFB3D1]"
                    >
                      {c.author}
                    </Link>
                    <span className="text-[10px] font-medium text-[#FFB3D1]/60">{c.time}</span>
                  </div>
                  <p className="mt-1 text-xs font-light leading-snug text-[#FFB3D1]">{c.text}</p>
                </li>
              ))
            )}
          </ul>
          <div className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment…"
              className="min-w-0 flex-1 rounded-[16px] border border-white/10 bg-[#1A0A3E]/80 px-3 py-2 text-xs font-light text-white placeholder:text-[#FFB3D1]/45 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/35"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  submitComment()
                }
              }}
            />
            <button
              type="button"
              onClick={submitComment}
              disabled={!draft.trim()}
              className="gf-magenta-btn shrink-0 rounded-[16px] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
