import { Link } from 'react-router-dom'
import { useMessaging } from '../context/useMessaging'

export function Messages() {
  const { conversations } = useMessaging()

  return (
    <div className="scroll-stable flex min-h-dvh flex-col gap-4 overflow-y-auto px-4 pb-28 pt-7">
      <header>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="mt-1 text-sm font-light text-[#FFB3D1]">Slip into the soft pink inbox.</p>
      </header>

      <div className="gf-glass relative rounded-[22px]">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB3D1]/60" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          placeholder="Search conversations..."
          className="w-full rounded-[22px] bg-transparent py-3.5 pl-11 pr-4 text-sm font-light text-white placeholder:text-[#FFB3D1]/55 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/40"
        />
      </div>

      <ul className="flex flex-col gap-2">
        {conversations.map((c) => (
          <li key={c.id}>
            <Link
              to={`/messages/${c.id}`}
              className="gf-glass gf-glow-hover flex gap-3 rounded-[22px] p-3 transition"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                  c.brand
                    ? 'bg-gradient-to-br from-[#E91E8C] to-[#7B2FBE] ring-2 ring-[#C9A96E]/60'
                    : 'bg-gradient-to-br from-[#FF6B6B] to-[#E91E8C]'
                }`}
              >
                {c.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-white">{c.name}</p>
                  <span className="shrink-0 text-[11px] font-medium text-[#FFB3D1]/70">{c.time}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs font-light leading-snug text-[#FFB3D1]/90">
                  {c.last}
                </p>
              </div>
              {c.unread > 0 && (
                <div className="flex flex-col items-end justify-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E91E8C] shadow-[0_0_12px_rgba(233,30,140,0.8)]" />
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
