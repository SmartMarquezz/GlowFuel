import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMessaging } from '../context/useMessaging'

export function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getConversation, getThread, appendMessage } = useMessaging()
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const convo = useMemo(() => getConversation(id), [getConversation, id])
  const messages = useMemo(() => getThread(id), [getThread, id])

  function send() {
    const t = draft.trim()
    if (!t) return
    setSending(true)
    window.setTimeout(() => {
      appendMessage(id, { from: 'me', text: t })
      setDraft('')
      setSending(false)
    }, 280)
  }

  if (!convo) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 pb-28 pt-10 text-center">
        <p className="text-5xl" aria-hidden="true">
          💌
        </p>
        <p className="text-lg font-semibold text-white">Conversation not found</p>
        <Link to="/messages" className="gf-magenta-btn rounded-[20px] px-6 py-3 text-sm font-semibold text-white">
          Back to Messages
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-transparent">
      <header className="flex items-center gap-3 border-b border-white/10 px-3 py-3 gf-glass">
        <button
          type="button"
          onClick={() => navigate('/messages')}
          className="gf-glow-hover flex h-10 w-10 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-[#FFB3D1]"
          aria-label="Back"
        >
          ←
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E91E8C] to-[#7B2FBE] text-xs font-bold text-white">
            {convo.avatar}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{convo.name}</p>
            <p className="text-[11px] font-light text-[#FFB3D1]/80">
              {convo.brand ? 'Brand · Verified' : 'Active now'}
            </p>
          </div>
        </div>
      </header>

      <div className="scroll-stable flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-4 pt-4">
        {messages.map((m, i) =>
          m.from === 'me' ? (
            <div key={`${i}-${m.text}`} className="ml-8 flex justify-end">
              <div className="gf-magenta-btn max-w-[85%] rounded-[20px] rounded-br-md px-4 py-2.5 text-sm font-light text-white shadow-[0_8px_24px_rgba(233,30,140,0.25)]">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={`${i}-${m.text}`} className="mr-8 flex justify-start">
              <div className="gf-glass max-w-[85%] rounded-[20px] rounded-bl-md px-4 py-2.5 text-sm font-light text-[#FFB3D1]">
                {m.text}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="border-t border-white/10 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 gf-glass">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message…"
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-[20px] border border-white/10 bg-[#1A0A3E]/80 px-4 py-3 text-sm font-light text-white placeholder:text-[#FFB3D1]/45 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/35"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
          />
          <button
            type="button"
            disabled={sending || !draft.trim()}
            onClick={send}
            className="gf-magenta-btn flex h-11 min-w-[52px] items-center justify-center rounded-[18px] px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Send"
          >
            {sending ? <span className="gf-spinner !h-5 !w-5 !border-2" /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
