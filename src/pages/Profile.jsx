import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFollowingShipDate } from '../data/shippingDates'
import { REFERRAL_CODE, shareReferralInvite } from '../data/mock'
import { COMMUNITY_MEMBERS, peerFollowerSlugs, peerFollowingSlugs } from '../data/communitySeed'
import {
  DELIVERY_HISTORY,
  REFERRAL_BREAKDOWN,
  TOTAL_BOTTLES_DELIVERED,
  TOTAL_REFERRAL_CREDIT,
} from '../data/userProfileExtras'
import { IconChevronRight, IconStar } from '../components/Icons'
import { useCommunityFeed } from '../context/useCommunityFeed'
import { useHomeActivity } from '../context/useHomeActivity'
import { useUserSession } from '../context/UserSessionProvider'

const SETTINGS_ITEMS = [
  { id: 'edit-profile', label: 'Edit Profile' },
  { id: 'notifications', label: 'Notification Settings' },
  { id: 'payment', label: 'Payment Methods' },
  { id: 'help', label: 'Help & Support' },
  { id: 'logout', label: 'Log Out' },
]

/** Matches categories in PostComposerModal */
const POST_CATEGORIES = [
  { id: 'all', label: 'All Posts' },
  { id: 'challenges', label: 'Challenge' },
  { id: 'results', label: 'Results' },
  { id: 'recipes', label: 'Recipe' },
]

function ProfilePostEditor({ post, onSave, onCancel }) {
  const [caption, setCaption] = useState(post.caption)
  const [filter, setFilter] = useState(post.filter ?? 'all')

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#C9A96E]/25 bg-[#1A0A3E]/90 p-4 ring-1 ring-[#C9A96E]/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">Edit post</p>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={4}
        className="mt-3 w-full resize-none rounded-[18px] border border-white/10 bg-[#0A0A2E]/80 px-3 py-2 text-sm font-light text-white placeholder:text-[#FFB3D1]/45 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/35"
      />
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">Category</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {POST_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === c.id
                ? 'bg-gradient-to-r from-[#E91E8C] to-[#7B2FBE] text-white shadow-[0_0_12px_rgba(233,30,140,0.35)]'
                : 'bg-white/5 text-[#FFB3D1] ring-1 ring-white/10 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="gf-glow-hover flex-1 rounded-[18px] border border-white/15 bg-white/5 py-2.5 text-sm font-medium text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!caption.trim()}
          onClick={() => onSave({ caption: caption.trim(), filter })}
          className="gf-magenta-btn flex-1 rounded-[18px] py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  )
}

function ProfileMemberRow({ slug, onClose }) {
  const m = COMMUNITY_MEMBERS[slug]
  if (!m) return null
  return (
    <li className="rounded-[18px] border border-white/10 bg-white/[0.04]">
      <Link
        to={`/community/user/${slug}`}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/[0.06]"
      >
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#0A0A2E] ring-1 ring-white/10">
          {m.avatarImage ? (
            <img src={m.avatarImage} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E91E8C] to-[#7B2FBE] text-sm font-bold text-white">
              {m.avatarInitial}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{m.displayName}</p>
          <p className="truncate text-xs font-light text-[#FFB3D1]/85">@{slug}</p>
        </div>
        {m.verified ? (
          <span className="shrink-0 rounded-full bg-[#C9A96E]/20 px-2 py-0.5 text-[10px] font-semibold text-[#C9A96E]">Verified</span>
        ) : null}
      </Link>
    </li>
  )
}

function Overlay({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-[#0A0A2E]/85 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-[1] mx-auto max-h-[85dvh] w-full max-w-[390px] overflow-hidden rounded-t-[26px] border border-white/10 gf-glass sm:max-h-[80dvh] sm:rounded-[26px]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-white/10 bg-white/5 text-[#FFB3D1]"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="scroll-stable max-h-[min(70dvh,520px)] overflow-y-auto px-4 pb-6 pt-4">{children}</div>
      </div>
    </div>
  )
}

function formatFollowers(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function Profile() {
  const navigate = useNavigate()
  const { member: me, memberSlug, signOut } = useUserSession()
  const followingSlugs = memberSlug ? peerFollowingSlugs(memberSlug) : []
  const followerSlugs = memberSlug ? peerFollowerSlugs(memberSlug) : []
  const { getPostsForMember, updatePost, deletePost } = useCommunityFeed()
  const myPosts = memberSlug ? getPostsForMember(memberSlug) : []
  const {
    deliveryScheduled,
    deliveryDate,
    deliveryFlavor,
    deliveryPack,
    cancelDelivery,
    resumeDelivery,
    shiftDeliveryLater,
    glowPointsBalance,
  } = useHomeActivity()

  const [copied, setCopied] = useState(false)
  const [modal, setModal] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [toastMsg, setToastMsg] = useState(null)
  const [notifyOrders, setNotifyOrders] = useState(true)
  const [notifyChallenges, setNotifyChallenges] = useState(true)
  const [notifySocial, setNotifySocial] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [editingPostId, setEditingPostId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (me) setDisplayName(me.displayName)
  }, [me])

  useEffect(() => {
    if (!toastMsg) return
    const t = window.setTimeout(() => setToastMsg(null), 2400)
    return () => window.clearTimeout(t)
  }, [toastMsg])

  function copyCode() {
    void navigator.clipboard?.writeText(REFERRAL_CODE)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  async function shareReferralFromProfile() {
    try {
      const result = await shareReferralInvite(displayName)
      if (result === 'aborted') return
      if (result === 'shared') setToastMsg('Shared your invite')
      if (result === 'copied') setToastMsg('Invite copied — paste it anywhere')
    } catch {
      setToastMsg('Sharing isn’t available — try Copy code')
    }
  }

  if (!me || !memberSlug) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 pb-28 pt-8">
        <div className="gf-spinner" role="status" aria-label="Loading profile" />
      </div>
    )
  }

  return (
    <div className="scroll-stable flex min-h-dvh flex-col gap-5 overflow-y-auto px-4 pb-28 pt-8">
      {toastMsg ? (
        <div className="fixed left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-[95] w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[16px] border border-white/10 bg-[#1A0A3E]/95 px-4 py-2.5 text-center text-xs font-medium text-white shadow-lg">
          {toastMsg}
        </div>
      ) : null}
      <div className="flex flex-col items-center text-center">
        <h1 className="max-w-[min(100%,20rem)] px-2 text-2xl font-bold leading-snug text-white">{displayName}</h1>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#C9A96E]/20 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-[#C9A96E] ring-1 ring-[#C9A96E]/35">
          <IconStar className="h-3.5 w-3.5 text-[#C9A96E]" /> Glow Member
        </span>
        <div className="relative mt-6">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-[#C9A96E] via-[#E91E8C] to-[#7B2FBE] p-[3px] shadow-[0_0_40px_rgba(233,30,140,0.25)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1A0A3E] text-3xl font-semibold text-[#FFB3D1]">
              {me.avatarInitial}
            </div>
          </div>
        </div>
        <p className="mt-5 text-sm font-light text-[#FFB3D1]">Member since March 2025</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setEditingPostId(null)
            setDeleteTarget(null)
            setModal('posts')
          }}
          className="gf-glass gf-glow-hover rounded-[20px] px-2 py-4 text-center transition"
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/85">Posts</p>
          <p className="mt-2 text-xl font-bold text-white">{myPosts.length}</p>
          <p className="mt-1 text-[9px] font-light text-white/50">View &amp; edit</p>
        </button>
        <button
          type="button"
          onClick={() => setModal('followers')}
          className="gf-glass gf-glow-hover rounded-[20px] px-2 py-4 text-center transition"
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/85">Followers</p>
          <p className="mt-2 text-xl font-bold text-white">{formatFollowers(me.followerCount)}</p>
          <p className="mt-1 text-[9px] font-light text-white/50">See who</p>
        </button>
        <button
          type="button"
          onClick={() => setModal('following')}
          className="gf-glass gf-glow-hover rounded-[20px] px-2 py-4 text-center transition"
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/85">Following</p>
          <p className="mt-2 text-xl font-bold text-white">{me.followingCount}</p>
          <p className="mt-1 text-[9px] font-light text-white/50">See who</p>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setModal('bottles')}
          className="gf-glass gf-glow-hover rounded-[20px] px-2 py-4 text-center transition"
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/85">Bottles</p>
          <p className="mt-2 text-xl font-bold text-white">{TOTAL_BOTTLES_DELIVERED}</p>
          <p className="mt-1 text-[9px] font-light text-white/50">All deliveries</p>
        </button>
        <button
          type="button"
          onClick={() => setModal('referrals')}
          className="gf-glass gf-glow-hover rounded-[20px] px-2 py-4 text-center transition"
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/85">Referrals</p>
          <p className="mt-2 text-xl font-bold text-white">{REFERRAL_BREAKDOWN.length}</p>
          <p className="mt-1 text-[9px] font-light text-white/50">Tap for detail</p>
        </button>
      </div>

      <section className="gf-glass gf-glow-hover rounded-[24px] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#C9A96E]">Glow Points</h2>
            <p className="mt-2 text-3xl font-bold tabular-nums text-white">{glowPointsBalance.toLocaleString()}</p>
            <p className="mt-1 text-xs font-light text-[#FFB3D1]/90">500 pts = $5 off at checkout · earn more from daily challenges</p>
          </div>
          <Link
            to="/"
            className="gf-glow-hover shrink-0 rounded-[18px] border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white"
          >
            Earn on Home
          </Link>
        </div>
      </section>

      <section className="gf-glass gf-glow-hover rounded-[24px] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#C9A96E]">Referrals</h2>
        <p className="mt-3 text-sm font-light text-[#FFB3D1]">
          Your Code: <span className="font-semibold tracking-[0.12em] text-white">{REFERRAL_CODE}</span>
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={copyCode}
            className="gf-magenta-btn flex-1 rounded-[20px] py-3 text-sm font-semibold text-white"
          >
            {copied ? 'Copied' : 'Copy code'}
          </button>
          <button
            type="button"
            onClick={() => void shareReferralFromProfile()}
            className="gf-glow-hover flex-1 rounded-[20px] border border-white/15 bg-white/5 py-3 text-sm font-medium text-white"
          >
            Share
          </button>
        </div>
        <p className="mt-4 rounded-[18px] bg-[#E91E8C]/10 px-4 py-3 text-sm font-light text-[#FFB3D1] ring-1 ring-[#E91E8C]/20">
          You&apos;ve earned <span className="font-semibold text-white">${TOTAL_REFERRAL_CREDIT}</span> in credits —
          stack through summer.
        </p>
      </section>

      <section className="gf-glass gf-glow-hover rounded-[24px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Peach Glow Plan</h2>
            <p className="mt-1 text-sm font-light text-[#FFB3D1]">Renews May 22 · 24 bottles / cycle</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white">
            {deliveryScheduled ? 'Active' : 'Paused'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setModal('subscription')}
          className="gf-glow-hover mt-4 w-full rounded-[20px] border border-white/15 bg-white/5 py-3 text-sm font-medium text-white"
        >
          Manage subscription
        </button>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">Settings</h2>
        <ul className="flex flex-col gap-2">
          {SETTINGS_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => (item.id === 'logout' ? setLogoutConfirm(true) : setModal(item.id))}
                className="gf-glass gf-glow-hover flex w-full items-center justify-between rounded-[20px] px-4 py-3.5 text-left text-sm font-medium text-white"
              >
                {item.label}
                <IconChevronRight className="h-5 w-5 text-[#C9A96E]" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {modal === 'bottles' && (
        <Overlay title="Delivery history" onClose={() => setModal(null)}>
          <p className="mb-4 text-sm font-light text-[#FFB3D1]">
            Lifetime bottles received from GlowFuel:{' '}
            <span className="font-semibold text-white">{TOTAL_BOTTLES_DELIVERED}</span>
          </p>
          <ul className="flex flex-col gap-2">
            {DELIVERY_HISTORY.map((d) => (
              <li key={d.id} className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{d.date}</p>
                  <span className="shrink-0 rounded-full bg-[#E91E8C]/15 px-2.5 py-0.5 text-xs font-bold text-[#FFB3D1]">
                    {d.bottles} bottles
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#FFB3D1]/85">{d.flavor}</p>
                <p className="mt-0.5 text-[11px] font-light text-white/50">{d.plan}</p>
              </li>
            ))}
          </ul>
        </Overlay>
      )}

      {modal === 'referrals' && (
        <Overlay title="Referral earnings" onClose={() => setModal(null)}>
          <p className="mb-4 text-sm font-light text-[#FFB3D1]">
            Total credited: <span className="font-semibold text-white">${TOTAL_REFERRAL_CREDIT}</span> · $10 per
            qualifying friend.
          </p>
          <ul className="flex flex-col gap-2">
            {REFERRAL_BREAKDOWN.map((r) => (
              <li key={r.id} className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      to={`/community/user/${r.slug}`}
                      className="text-sm font-semibold text-white hover:text-[#FFB3D1]"
                      onClick={() => setModal(null)}
                    >
                      {r.name}
                    </Link>
                    <p className="text-xs text-[#FFB3D1]/80">@{r.handle} · joined {r.joined}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${r.status === 'credited' ? 'text-[#C9A96E]' : 'text-[#FFB3D1]'}`}>
                      {r.status === 'credited' ? `+$${r.amount}` : `$${r.amount} pending`}
                    </p>
                    <p className="text-[10px] capitalize text-white/45">{r.status}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Overlay>
      )}

      {modal === 'followers' && (
        <Overlay title="Your followers" onClose={() => setModal(null)}>
          <p className="mb-4 text-xs font-light leading-relaxed text-[#FFB3D1]/85">
            Preview: {followerSlugs.length} profiles shown · you have{' '}
            <span className="font-semibold text-white">{me.followerCount.toLocaleString()}</span> followers total in this
            demo.
          </p>
          <ul className="flex flex-col gap-2">
            {followerSlugs.map((slug) => (
              <ProfileMemberRow key={slug} slug={slug} onClose={() => setModal(null)} />
            ))}
          </ul>
        </Overlay>
      )}

      {modal === 'following' && (
        <Overlay title="Accounts you follow" onClose={() => setModal(null)}>
          <p className="mb-4 text-xs font-light leading-relaxed text-[#FFB3D1]/85">
            Preview: {followingSlugs.length} profiles shown · you follow{' '}
            <span className="font-semibold text-white">{me.followingCount.toLocaleString()}</span> accounts total in this
            demo.
          </p>
          <ul className="flex flex-col gap-2">
            {followingSlugs.map((slug) => (
              <ProfileMemberRow key={slug} slug={slug} onClose={() => setModal(null)} />
            ))}
          </ul>
        </Overlay>
      )}

      {modal === 'posts' && (
        <Overlay
          title="Your community posts"
          onClose={() => {
            setEditingPostId(null)
            setDeleteTarget(null)
            setModal(null)
          }}
        >
          {myPosts.length === 0 ? (
            <p className="text-center text-sm font-light text-[#FFB3D1]">Post from the Community tab to see them here.</p>
          ) : (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-light text-[#FFB3D1]/85">
                Tap <span className="font-semibold text-white">View in feed</span> for the full post page, or{' '}
                <span className="font-semibold text-white">Edit</span> / <span className="font-semibold text-white">Delete</span>{' '}
                to manage your glow.
              </p>
              {myPosts.map((p) =>
                editingPostId === p.id ? (
                  <ProfilePostEditor
                    key={p.id}
                    post={p}
                    onSave={(patch) => {
                      updatePost(p.id, patch)
                      setEditingPostId(null)
                    }}
                    onCancel={() => setEditingPostId(null)}
                  />
                ) : (
                  <CommunityPostCard
                    key={p.id}
                    post={p}
                    manageActions={{
                      feedHref: `/community/post/${p.id}`,
                      onNavigate: () => setModal(null),
                      onEdit: () => setEditingPostId(p.id),
                      onDelete: () => setDeleteTarget(p),
                    }}
                  />
                ),
              )}
            </div>
          )}
        </Overlay>
      )}

      {modal === 'posts' && deleteTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-post-title">
          <button
            type="button"
            className="absolute inset-0 bg-[#0A0A2E]/88 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-[1] w-full max-w-[340px] rounded-[24px] border border-white/10 gf-glass p-6">
            <h2 id="delete-post-title" className="text-lg font-bold text-white">
              Delete this post?
            </h2>
            <p className="mt-2 text-sm font-light text-[#FFB3D1]">
              It will disappear from your profile and the community feed. This can&apos;t be undone in the demo.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="gf-glow-hover flex-1 rounded-[20px] border border-white/15 bg-white/5 py-3 text-sm font-medium text-white"
              >
                Keep post
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePost(deleteTarget.id)
                  setDeleteTarget(null)
                  setEditingPostId(null)
                }}
                className="flex-1 rounded-[20px] bg-[#E91E8C]/90 py-3 text-sm font-semibold text-white ring-1 ring-[#E91E8C]/50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'subscription' && (
        <Overlay title="Manage subscription" onClose={() => setModal(null)}>
          <div className="space-y-4 text-sm font-light text-[#FFB3D1]">
            <p>
              <span className="font-semibold text-white">Peach Glow Plan</span> — $110 / month · 24 bottles per cycle.
              Renews May 22.
            </p>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">Next shipment</p>
              {deliveryScheduled ? (
                <>
                  <p className="mt-2 text-white">{deliveryDate}</p>
                  <p className="mt-1">
                    {deliveryFlavor} · {deliveryPack}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-white/80">Deliveries paused — resume to pick your next ship date.</p>
                  <button
                    type="button"
                    onClick={() => {
                      resumeDelivery()
                      setModal(null)
                      navigate('/', { state: { openDeliveryEdit: true } })
                    }}
                    className="gf-magenta-btn mt-3 w-full rounded-[18px] py-2.5 text-sm font-semibold text-white"
                  >
                    Resume &amp; set next delivery
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setModal(null)
                navigate('/', { state: { openDeliveryEdit: true } })
                setToastMsg('Pick a new date or flavor in Modify delivery.')
              }}
              className="gf-magenta-btn w-full rounded-[18px] py-3 text-center text-sm font-semibold text-white"
            >
              Reschedule next delivery
            </button>
            <button
              type="button"
              onClick={() => {
                const next = getFollowingShipDate(deliveryDate)
                if (next === deliveryDate) {
                  setToastMsg('Already on the latest demo ship date — open Home to choose any slot.')
                  setModal(null)
                  return
                }
                shiftDeliveryLater()
                setModal(null)
                setToastMsg(`Next box moved to ${next} — still on your plan.`)
              }}
              className="gf-glow-hover w-full rounded-[18px] border border-white/15 bg-white/5 py-3 text-sm font-medium text-white"
            >
              Skip / push next box (keeps plan active)
            </button>
            <button
              type="button"
              onClick={() => {
                cancelDelivery()
                setModal(null)
                setToastMsg('Deliveries paused — resume from Home or Profile anytime.')
              }}
              className="w-full rounded-[18px] border border-[#E91E8C]/35 bg-[#E91E8C]/10 py-3 text-sm font-medium text-[#FFB3D1]"
            >
              Pause all deliveries
            </button>
            <p className="text-[11px] leading-relaxed text-white/50">
              Skip only moves your ship date later. Pause stops shipments until you resume. For billing cancellation,
              contact support (portal coming soon).
            </p>
          </div>
        </Overlay>
      )}

      {modal === 'edit-profile' && (
        <Overlay title="Edit Profile" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">
              Display name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-[18px] border border-white/10 bg-[#1A0A3E]/85 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/35"
            />
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">Username</label>
            <input
              value={`@${memberSlug}`}
              readOnly
              className="w-full cursor-not-allowed rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#FFB3D1]/70"
            />
            <p className="text-[11px] text-white/45">Username is locked in this preview build.</p>
            <button
              type="button"
              onClick={() => {
                setModal(null)
                setToastMsg('Profile updated')
              }}
              className="gf-magenta-btn w-full rounded-[20px] py-3 text-sm font-semibold text-white"
            >
              Save changes
            </button>
          </div>
        </Overlay>
      )}

      {modal === 'notifications' && (
        <Overlay title="Notification settings" onClose={() => setModal(null)}>
          <p className="mb-4 text-sm font-light text-[#FFB3D1]">
            Choose what pings your lock screen. Changes apply to this device only in the demo.
          </p>
          {[
            { id: 'orders', label: 'Orders & deliveries', desc: 'Shipped, out for delivery, delays', value: notifyOrders, set: setNotifyOrders },
            { id: 'challenges', label: 'Challenges & Glow Points', desc: 'Daily challenge + rewards', value: notifyChallenges, set: setNotifyChallenges },
            { id: 'social', label: 'Community', desc: 'Likes, mentions, new followers', value: notifySocial, set: setNotifySocial },
          ].map((row) => (
            <div
              key={row.id}
              className="mb-3 flex items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">{row.label}</p>
                <p className="text-xs font-light text-[#FFB3D1]/75">{row.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={row.value}
                onClick={() => row.set((v) => !v)}
                className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                  row.value ? 'bg-gradient-to-r from-[#E91E8C] to-[#7B2FBE]' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                    row.value ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </Overlay>
      )}

      {modal === 'payment' && (
        <Overlay title="Payment methods" onClose={() => setModal(null)}>
          <p className="mb-4 text-sm font-light text-[#FFB3D1]">
            Your default card is charged for subscriptions and Shop orders.
          </p>
          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-white">Visa ending 4242</p>
                <p className="text-xs text-[#FFB3D1]/80">Expires 08 / 28 · Eric Marquez Lluhen</p>
              </div>
              <span className="rounded-full bg-[#C9A96E]/15 px-2 py-0.5 text-[10px] font-semibold text-[#C9A96E]">
                Default
              </span>
            </div>
          </div>
          <button
            type="button"
            className="gf-glow-hover mt-4 w-full rounded-[20px] border border-[#C9A96E]/35 bg-[#C9A96E]/10 py-3 text-sm font-medium text-[#FFB3D1]"
          >
            Add another card (demo)
          </button>
        </Overlay>
      )}

      {modal === 'help' && (
        <Overlay title="Help & Support" onClose={() => setModal(null)}>
          <ul className="list-inside list-disc space-y-3 text-sm font-light text-[#FFB3D1]">
            <li>
              <span className="text-white">Shipping &amp; returns:</span> chilled packs ship Mon–Wed; full policy in
              FAQ.
            </li>
            <li>
              <span className="text-white">Glow Points:</span> 500 pts = $5 at checkout — redeem on the checkout
              screen.
            </li>
            <li>
              <span className="text-white">Subscriptions:</span> skip or modify next box from Home or Manage
              subscription here.
            </li>
          </ul>
          <a
            href="mailto:hello@glowfuel.com"
            className="gf-magenta-btn mt-6 block w-full rounded-[20px] py-3 text-center text-sm font-semibold text-white"
          >
            Email hello@glowfuel.com
          </a>
        </Overlay>
      )}

      {logoutConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4" role="alertdialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-[#0A0A2E]/88 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setLogoutConfirm(false)}
          />
          <div className="relative z-[1] w-full max-w-[340px] rounded-[24px] border border-white/10 gf-glass p-6">
            <h2 className="text-lg font-bold text-white">Log out?</h2>
            <p className="mt-2 text-sm font-light text-[#FFB3D1]">You&apos;ll need to sign in again to manage deliveries.</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setLogoutConfirm(false)}
                className="gf-glow-hover flex-1 rounded-[20px] border border-white/15 bg-white/5 py-3 text-sm font-medium text-white"
              >
                Stay logged in
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutConfirm(false)
                  signOut()
                  navigate('/welcome')
                }}
                className="flex-1 rounded-[20px] bg-[#E91E8C]/90 py-3 text-sm font-semibold text-white"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
