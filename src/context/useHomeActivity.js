import { useContext } from 'react'
import { HomeActivityContext } from './home-context'

export function useHomeActivity() {
  const ctx = useContext(HomeActivityContext)
  if (!ctx) throw new Error('useHomeActivity must be used within HomeActivityProvider')
  return ctx
}
