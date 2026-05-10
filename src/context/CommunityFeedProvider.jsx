import { useCallback, useMemo, useState } from 'react'
import { CAN_IMG, MOOD_IMG } from '../data/media'
import { COMMUNITY_MEMBERS, SEED_POSTS, buildClassComments, classScaleLikes } from '../data/communitySeed'
import { CommunityFeedContext } from './community-context'
import { useUserSession } from './UserSessionProvider'

export function CommunityFeedProvider({ children }) {
  const { memberSlug } = useUserSession()
  const [posts, setPosts] = useState(() => SEED_POSTS)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const toggleLike = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const nextLiked = !p.likedByMe
        return {
          ...p,
          likedByMe: nextLiked,
          likes: Math.max(0, p.likes + (nextLiked ? 1 : -1)),
        }
      }),
    )
  }, [])

  const addComment = useCallback((postId, text) => {
    const t = text.trim()
    if (!t) return
    const me = memberSlug ? COMMUNITY_MEMBERS[memberSlug] : null
    if (!me) return
    const comment = {
      id: `c-${Date.now()}`,
      author: me.displayName,
      authorSlug: me.slug,
      text: t,
      time: 'now',
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
    )
  }, [memberSlug])

  const addPost = useCallback(
    ({ caption, filter, moodKey, useCan, imageUrl }) => {
      const t = caption.trim()
      if (!t) return
      const me = memberSlug ? COMMUNITY_MEMBERS[memberSlug] : null
      if (!me) return
      const image = imageUrl || (useCan ? CAN_IMG : MOOD_IMG[moodKey] ?? MOOD_IMG.abstractAurora)
      const post = {
        id: `u-${Date.now()}`,
        memberSlug: me.slug,
        user: me.displayName,
        handle: `@${me.slug}`,
        time: 'now',
        verified: me.verified,
        caption: t,
        filter,
        image,
        imageAlt: imageUrl ? 'Your photo' : useCan ? 'Your GlowFuel glow post' : 'Your glow post',
        likes: classScaleLikes(Number(`${Date.now()}`.slice(-4)), me.slug),
        likedByMe: false,
        comments: buildClassComments(me.slug, Number(`${Date.now()}`.slice(-5)), 12),
      }
      setPosts((prev) => [post, ...prev])
      showToast('Posted to The Glow Community')
    },
    [memberSlug, showToast],
  )

  const sharePost = useCallback(
    async (post) => {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const postUrl = `${origin}/community/post/${post.id}`
      const line = `${post.user}: ${post.caption}`
      try {
        if (navigator.share) {
          await navigator.share({
            title: `${post.user} on GlowFuel`,
            text: line,
            url: postUrl,
          })
          showToast('Shared')
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(`${line}\n${postUrl}`)
          showToast('Copied link')
        } else {
          showToast('Share not available')
        }
      } catch (e) {
        if (e?.name === 'AbortError') return
        showToast('Could not share')
      }
    },
    [showToast],
  )

  const getMember = useCallback((slug) => {
    const key = String(slug).replace(/^@/, '')
    return COMMUNITY_MEMBERS[key] ?? null
  }, [])

  const getPostsForMember = useCallback(
    (slug) => {
      const key = String(slug).replace(/^@/, '')
      return posts.filter((p) => p.memberSlug === key)
    },
    [posts],
  )

  const getPostById = useCallback(
    (postId) => posts.find((p) => p.id === postId) ?? null,
    [posts],
  )

  const updatePost = useCallback(
    (postId, updates) => {
      const meSlug = memberSlug
      const caption = updates.caption !== undefined ? String(updates.caption).trim() : undefined
      if (caption !== undefined && !caption) return
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId || p.memberSlug !== meSlug) return p
          const next = { ...p }
          if (caption !== undefined) next.caption = caption
          if (updates.filter !== undefined) next.filter = updates.filter
          return next
        }),
      )
      showToast('Post updated')
    },
    [memberSlug, showToast],
  )

  const deletePost = useCallback(
    (postId) => {
      const meSlug = memberSlug
      setPosts((prev) => prev.filter((p) => !(p.id === postId && p.memberSlug === meSlug)))
      showToast('Post removed from your feed')
    },
    [memberSlug, showToast],
  )

  const value = useMemo(
    () => ({
      posts,
      toast,
      toggleLike,
      addComment,
      addPost,
      updatePost,
      deletePost,
      sharePost,
      getMember,
      getPostsForMember,
      getPostById,
    }),
    [
      posts,
      toast,
      toggleLike,
      addComment,
      addPost,
      updatePost,
      deletePost,
      sharePost,
      getMember,
      getPostsForMember,
      getPostById,
    ],
  )

  return <CommunityFeedContext.Provider value={value}>{children}</CommunityFeedContext.Provider>
}
