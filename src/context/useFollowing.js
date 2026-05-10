import { useContext } from 'react'
import { FollowingContext } from './follow-context'

export function useFollowing() {
  const ctx = useContext(FollowingContext)
  if (!ctx) throw new Error('useFollowing must be used within FollowingProvider')
  return ctx
}
