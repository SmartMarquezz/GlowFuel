import { useContext } from 'react'
import { CommunityFeedContext } from './community-context'

export function useCommunityFeed() {
  const ctx = useContext(CommunityFeedContext)
  if (!ctx) throw new Error('useCommunityFeed must be used within CommunityFeedProvider')
  return ctx
}
