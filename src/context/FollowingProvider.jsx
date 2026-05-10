import { useCallback, useMemo, useState } from 'react'
import { FollowingContext } from './follow-context'
import { useUserSession } from './UserSessionProvider'

function loadSet() {
  try {
    const raw = sessionStorage.getItem('glowfuel-following')
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

export function FollowingProvider({ children }) {
  const { memberSlug } = useUserSession()
  const [following, setFollowing] = useState(loadSet)

  const persist = useCallback((next) => {
    sessionStorage.setItem('glowfuel-following', JSON.stringify([...next]))
  }, [])

  const isFollowing = useCallback((slug) => following.has(slug), [following])

  const toggleFollow = useCallback(
    (slug) => {
      if (slug === memberSlug) return
      setFollowing((prev) => {
        const next = new Set(prev)
        if (next.has(slug)) next.delete(slug)
        else next.add(slug)
        persist(next)
        return next
      })
    },
    [memberSlug, persist],
  )

  const value = useMemo(
    () => ({
      following,
      isFollowing,
      toggleFollow,
    }),
    [following, isFollowing, toggleFollow],
  )

  return <FollowingContext.Provider value={value}>{children}</FollowingContext.Provider>
}
