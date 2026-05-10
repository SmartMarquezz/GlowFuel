import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUserSession } from '../context/UserSessionProvider'
import { useCommunityFeed } from '../context/useCommunityFeed'
import { useFollowing } from '../context/useFollowing'
import { useMessaging } from '../context/useMessaging'
import { CommunityPostCard } from '../components/CommunityPostCard'

function formatFollowers(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function MemberProfile() {
  const { handle } = useParams()
  const navigate = useNavigate()
  const { memberSlug } = useUserSession()
  const { getMember, getPostsForMember } = useCommunityFeed()
  const { isFollowing, toggleFollow } = useFollowing()
  const { openOrCreateDm } = useMessaging()

  const member = useMemo(() => getMember(handle), [getMember, handle])
  const userPosts = useMemo(() => getPostsForMember(handle), [getPostsForMember, handle])
  const isSelf = member?.slug === memberSlug

  const displayFollowers = member
    ? member.followerCount + (isFollowing(member.slug) && !isSelf ? 1 : 0)
    : 0

  function onMessage() {
    if (!member || isSelf) return
    const id = openOrCreateDm(member.slug, member.displayName)
    navigate(`/messages/${id}`)
  }

  if (!member) {
    return (
      <div className="scroll-stable flex min-h-dvh flex-col items-center justify-center gap-4 px-6 pb-28 pt-10 text-center">
        <p className="text-5xl" aria-hidden="true">
          ✦
        </p>
        <p className="text-lg font-semibold text-white">Profile not found</p>
        <p className="text-sm font-light text-[#FFB3D1]">Double-check that handle and try again.</p>
        <Link to="/community" className="gf-magenta-btn rounded-[20px] px-6 py-3 text-sm font-semibold text-white">
          Back to Community
        </Link>
      </div>
    )
  }

  return (
    <div className="scroll-stable flex min-h-dvh flex-col overflow-y-auto pb-28 pt-4">
      <header className="flex items-center gap-2 px-3 pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="gf-glow-hover flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-[#FFB3D1]"
          aria-label="Back"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{member.displayName}</p>
          <p className="truncate text-xs font-light text-[#FFB3D1]/85">@{member.slug}</p>
        </div>
      </header>

      <div className="px-4">
        <div className="gf-glass overflow-hidden rounded-[28px] p-5 ring-1 ring-white/10">
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr p-[2px] ${member.storyRing}`}
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#1A0A3E] text-2xl font-semibold text-[#FFB3D1]">
                {member.avatarImage ? (
                  <img src={member.avatarImage} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  member.avatarInitial
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <h1 className="text-xl font-bold text-white">{member.displayName}</h1>
              {member.verified && (
                <span className="rounded-full bg-[#C9A96E]/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#C9A96E]">
                  GlowFuel Verified
                </span>
              )}
            </div>
            <p className="mt-2 max-w-[19rem] text-sm font-light leading-relaxed text-[#FFB3D1]">{member.bio}</p>
            <div className="mt-5 grid w-full max-w-[17rem] grid-cols-3 gap-2 text-center">
              <div className="rounded-[16px] bg-white/[0.05] px-2 py-2">
                <p className="text-lg font-bold text-white">{userPosts.length}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/80">Posts</p>
              </div>
              <div className="rounded-[16px] bg-white/[0.05] px-2 py-2">
                <p className="text-lg font-bold text-white">{formatFollowers(displayFollowers)}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/80">Followers</p>
              </div>
              <div className="rounded-[16px] bg-white/[0.05] px-2 py-2">
                <p className="text-lg font-bold text-white">{formatFollowers(member.followingCount)}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFB3D1]/80">Following</p>
              </div>
            </div>
            <div className="mt-5 flex w-full max-w-[17rem] gap-3">
              {isSelf ? (
                <Link
                  to="/profile"
                  className="gf-magenta-btn flex-1 rounded-[18px] py-2.5 text-center text-sm font-semibold text-white"
                >
                  My full profile
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => toggleFollow(member.slug)}
                    className={`flex-1 rounded-[18px] py-2.5 text-sm font-semibold transition ${
                      isFollowing(member.slug)
                        ? 'border border-white/20 bg-white/10 text-white'
                        : 'gf-magenta-btn text-white'
                    }`}
                  >
                    {isFollowing(member.slug) ? 'Following' : 'Follow'}
                  </button>
                  <button
                    type="button"
                    onClick={onMessage}
                    className="gf-glow-hover flex-1 rounded-[18px] border border-white/15 bg-white/5 py-2.5 text-sm font-medium text-white"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6 px-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A96E]">
          {member.displayName}&apos;s posts
        </h2>
        {userPosts.length === 0 ? (
          <div className="gf-glass rounded-[22px] p-8 text-center">
            <p className="text-3xl" aria-hidden="true">
              🌙
            </p>
            <p className="mt-2 text-sm font-light text-[#FFB3D1]">No posts yet — check back after the next glow.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {userPosts.map((p) => (
              <CommunityPostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
