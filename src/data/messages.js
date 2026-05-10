export const CONVERSATIONS = [
  {
    id: 'glowfuel-official',
    name: 'GlowFuel Official',
    avatar: 'GF',
    last: 'Your May box is packed with love — tap to peek inside.',
    time: 'Now',
    unread: 2,
    brand: true,
  },
  {
    id: 'maya-lewis',
    name: 'Lea Cini',
    avatar: 'LC',
    last: 'Peach Glow after class hits different.',
    time: '12m',
    unread: 1,
    brand: false,
  },
  {
    id: 'sofia-reed',
    name: 'Luca Conenna',
    avatar: 'LU',
    time: '2h',
    unread: 0,
    brand: false,
  },
  {
    id: 'jordan-kim',
    name: 'Christian Knight',
    avatar: 'CK',
    last: 'Down to split a monthly sub?',
    time: 'Yesterday',
    unread: 0,
    brand: false,
  },
  {
    id: 'aria-vega',
    name: 'Mikayla Rivera',
    avatar: 'MR',
    last: 'Tysm for the referral code — obsessed.',
    time: 'Tue',
    unread: 1,
    brand: false,
  },
]

export const CHAT_THREADS = {
  'glowfuel-official': [
    { from: 'them', text: 'Hey glow bestie — your subscriber perk just unlocked: early access to Tropical Shine.' },
    { from: 'them', text: 'Your May box is packed with love — tap to peek inside.' },
    { from: 'me', text: 'Stop it — you’re spoiling me. Peach + tropical mix?' },
    { from: 'them', text: 'On it. Want us to pulse it on IG when it lands?' },
  ],
  'maya-lewis': [
    { from: 'them', text: 'Just tried the new challenge — post-workout glow is REAL.' },
    { from: 'me', text: 'Right?? The lighting in my gym mirror never looked this good.' },
    { from: 'them', text: 'Peach Glow after class hits different.' },
  ],
  'sofia-reed': [
    { from: 'them', text: 'Sent a reel: berry radiance mocktail ideas 🍓' },
    { from: 'me', text: 'Saving immediately. Hosting brunch Sunday.' },
  ],
  'jordan-kim': [
    { from: 'them', text: 'Down to split a monthly sub?' },
    { from: 'me', text: 'Yes — I’ll ping you after my call.' },
  ],
  'aria-vega': [
    { from: 'them', text: 'Tysm for the referral code — obsessed.' },
    { from: 'me', text: 'Anytime! Tag me in your first sip vid?' },
  ],
}
