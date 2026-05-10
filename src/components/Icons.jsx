export function IconHome({ active, className = 'h-6 w-6' }) {
  const stroke = active ? '#C9A96E' : 'rgba(255,255,255,0.55)'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconShop({ active, className = 'h-6 w-6' }) {
  const stroke = active ? '#C9A96E' : 'rgba(255,255,255,0.55)'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h15l-1.2 7.2a2 2 0 0 1-2 1.68H8.2a2 2 0 0 1-2-1.74L5 4H3"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="9" cy="20" r="1.3" fill={stroke} />
      <circle cx="18" cy="20" r="1.3" fill={stroke} />
    </svg>
  )
}

export function IconCommunity({ active, className = 'h-6 w-6' }) {
  const stroke = active ? '#C9A96E' : 'rgba(255,255,255,0.55)'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="7.5" r="2.75" stroke={stroke} strokeWidth="1.7" />
      <path
        d="M3.25 19.5c0-3.6 2.55-6.25 5.75-6.25s5.75 2.65 5.75 6.25"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="16.25" cy="7.5" r="2.75" stroke={stroke} strokeWidth="1.7" />
      <path
        d="M10.5 19.5c0-3.6 2.55-6.25 5.75-6.25s5.75 2.65 5.75 6.25"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconMessages({ active, className = 'h-6 w-6' }) {
  const stroke = active ? '#C9A96E' : 'rgba(255,255,255,0.55)'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5.5L8 20v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconProfile({ active, className = 'h-6 w-6' }) {
  const stroke = active ? '#C9A96E' : 'rgba(255,255,255,0.55)'
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" stroke={stroke} strokeWidth="1.7" />
      <path
        d="M5.5 19.2c.8-3.3 3.6-5.7 6.5-5.7s5.7 2.4 6.5 5.7"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconCart({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h15l-1.2 7.2a2 2 0 0 1-2 1.68H8.2a2 2 0 0 1-2-1.74L5 4H3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="9" cy="20" r="1.3" fill="currentColor" />
      <circle cx="18" cy="20" r="1.3" fill="currentColor" />
    </svg>
  )
}

export function IconChevronRight({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function IconStar({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.3 14.1 9l5.9.9-4.3 4.2 1 5.9L12 17.9 6.3 19l1-5.9L3 9.9 8.9 9 12 3.3Z" />
    </svg>
  )
}
