import { useContext } from 'react'
import { MessagingContext } from './messaging-context'

export function useMessaging() {
  const ctx = useContext(MessagingContext)
  if (!ctx) throw new Error('useMessaging must be used within MessagingProvider')
  return ctx
}
