import { useId } from 'react'

export function GlowFuelLogo({ className = '' }) {
  const gid = useId().replace(/:/g, '')
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl gf-glass ring-1 ring-[#C9A96E]/40"
        aria-hidden="true"
      >
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 4C12 8 8 12 8 18c0 5 3.5 9 8 10 4.5-1 8-5 8-10 0-6-4-10-8-14z"
            stroke="#C9A96E"
            strokeWidth="1.6"
            fill={`url(#gf-${gid})`}
          />
          <defs>
            <linearGradient id={`gf-${gid}`} x1="8" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E91E8C" />
              <stop offset="1" stopColor="#7B2FBE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-lg font-semibold tracking-[0.14em] text-[#C9A96E]">GlowFuel</span>
    </div>
  )
}
