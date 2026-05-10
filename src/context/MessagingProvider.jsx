import { useCallback, useMemo, useState } from 'react'
import { CHAT_THREADS, CONVERSATIONS } from '../data/messages'
import { MessagingContext } from './messaging-context'

function cloneThreads() {
  const out = {}
  for (const [k, v] of Object.entries(CHAT_THREADS)) {
    out[k] = v.map((m) => ({ ...m }))
  }
  return out
}

export function MessagingProvider({ children }) {
  const [conversations, setConversations] = useState(() =>
    CONVERSATIONS.map((c) => ({ ...c })),
  )
  const [threads, setThreads] = useState(cloneThreads)

  const getConversation = useCallback(
    (id) => conversations.find((c) => c.id === id) ?? null,
    [conversations],
  )

  const getThread = useCallback((id) => threads[id] ?? [], [threads])

  const appendMessage = useCallback((id, message) => {
    setThreads((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), message],
    }))
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, last: message.text, time: 'Now', unread: message.from === 'me' ? c.unread : 0 }
          : c,
      ),
    )
  }, [])

  const openOrCreateDm = useCallback((slug, displayName) => {
    const id = `dm-${slug}`
    const initials = displayName
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    setConversations((prev) => {
      if (prev.some((c) => c.id === id)) return prev
      return [
        {
          id,
          name: displayName,
          avatar: initials || '??',
          last: 'Say hi — tap to chat.',
          time: 'Now',
          unread: 0,
          brand: false,
        },
        ...prev,
      ]
    })

    setThreads((prev) => {
      if (prev[id]?.length) return prev
      return {
        ...prev,
        [id]: [
          {
            from: 'them',
            text: `Hey! It’s ${displayName.split(' ')[0]} — so glad you messaged. What’s your glow today? ✨`,
          },
        ],
      }
    })

    return id
  }, [])

  const value = useMemo(
    () => ({
      conversations,
      getConversation,
      getThread,
      appendMessage,
      openOrCreateDm,
    }),
    [conversations, getConversation, getThread, appendMessage, openOrCreateDm],
  )

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>
}
