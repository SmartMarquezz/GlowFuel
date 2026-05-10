import { NavLink, useLocation } from 'react-router-dom'
import { IconCommunity, IconHome, IconMessages, IconProfile, IconShop } from './Icons'

const tabs = [
  { to: '/', label: 'Home', Icon: IconHome },
  { to: '/shop', label: 'Shop', Icon: IconShop },
  { to: '/community', label: 'Community', Icon: IconCommunity },
  { to: '/messages', label: 'Messages', Icon: IconMessages },
  { to: '/profile', label: 'Profile', Icon: IconProfile },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2 border-t border-white/10 gf-glass px-2 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2"
      aria-label="Primary"
    >
      <ul className="flex items-end justify-between gap-1">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => {
                const communityActive = to === '/community' && location.pathname.startsWith('/community')
                const shopActive = to === '/shop' && (location.pathname === '/shop' || location.pathname === '/checkout')
                const active =
                  to === '/community' ? communityActive : to === '/shop' ? shopActive : isActive
                return `flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 transition-colors ${
                  active ? 'text-[#C9A96E]' : 'text-white/55 hover:text-[#FFB3D1]'
                }`
              }}
            >
              {({ isActive }) => {
                const communityActive = to === '/community' && location.pathname.startsWith('/community')
                const shopActive = to === '/shop' && (location.pathname === '/shop' || location.pathname === '/checkout')
                const active =
                  to === '/community' ? communityActive : to === '/shop' ? shopActive : isActive
                return (
                  <>
                    <Icon active={active} />
                    <span
                      className={`text-[10px] font-medium tracking-wide ${
                        active ? 'text-[#FFB3D1]' : 'text-white/50'
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
