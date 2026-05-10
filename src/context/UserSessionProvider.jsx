import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { COMMUNITY_MEMBERS } from '../data/communitySeed'

const STORAGE_KEY = 'glowfuel-class-session'

const UserSessionContext = createContext(null)

export function UserSessionProvider({ children }) {
  const [state, setState] = useState(() => ({ memberSlug: null, ready: false }))

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        setState({ memberSlug: null, ready: true })
        return
      }
      const parsed = JSON.parse(raw)
      const slug = typeof parsed?.memberSlug === 'string' ? parsed.memberSlug : null
      const valid = slug && COMMUNITY_MEMBERS[slug]
      setState({ memberSlug: valid ? slug : null, ready: true })
    } catch {
      setState({ memberSlug: null, ready: true })
    }
  }, [])

  const signIn = useCallback((memberSlug) => {
    if (!COMMUNITY_MEMBERS[memberSlug]) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ memberSlug }))
    setState((s) => ({ ...s, memberSlug }))
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState((s) => ({ ...s, memberSlug: null }))
  }, [])

  const member = state.memberSlug ? COMMUNITY_MEMBERS[state.memberSlug] : null

  const value = useMemo(
    () => ({
      ready: state.ready,
      memberSlug: state.memberSlug,
      member,
      signIn,
      signOut,
    }),
    [state.ready, state.memberSlug, member, signIn, signOut],
  )

  return <UserSessionContext.Provider value={value}>{children}</UserSessionContext.Provider>
}

export function useUserSession() {
  const ctx = useContext(UserSessionContext)
  if (!ctx) throw new Error('useUserSession must be used within UserSessionProvider')
  return ctx
}
