import { CAN_IMG, MOOD_IMG } from './media'

/** Logged-in user — Eric (class demo) */
export const CURRENT_MEMBER_SLUG = 'ericmarquez'

/** Full class roster (students + teacher). Eric is the app “you”. */
const CLASS_PEOPLE_RAW = [
  { slug: 'ericmarquez', displayName: 'Eric Marquez Lluhen', role: 'student' },
  { slug: 'kabir-ahmad', displayName: 'Kabir Ahmad', role: 'student' },
  { slug: 'lea-cini', displayName: 'Lea Cini', role: 'student' },
  { slug: 'luca-conenna', displayName: 'Luca Conenna', role: 'student' },
  { slug: 'shane-gallagher', displayName: 'Shane Gallagher', role: 'student' },
  { slug: 'christopher-harris', displayName: 'Christopher Harris', role: 'student' },
  { slug: 'dana-internicola', displayName: 'Dana Internicola', role: 'teacher' },
  { slug: 'gabriel-johnson', displayName: 'Gabriel Johnson', role: 'student' },
  { slug: 'caroline-kessler', displayName: 'Caroline Kessler', role: 'student' },
  { slug: 'christian-knight', displayName: 'Christian Knight', role: 'student' },
  { slug: 'joseph-lomangino', displayName: 'Joseph Lomangino', role: 'student' },
  { slug: 'victoria-madailperez', displayName: 'Victoria Madail Perez', role: 'student' },
  { slug: 'teree-mcdonald', displayName: 'Teree Mc Donald', role: 'student' },
  { slug: 'daniel-mcmahon', displayName: 'Daniel McMahon', role: 'student' },
  { slug: 'ian-muchineuta', displayName: 'Ian Muchineuta', role: 'student' },
  { slug: 'isaac-oden', displayName: 'Isaac Oden', role: 'student' },
  { slug: 'angelo-pecora', displayName: 'Angelo Pecora', role: 'student' },
  { slug: 'thomas-pesce', displayName: 'Thomas Pesce', role: 'student' },
  { slug: 'mikayla-rivera', displayName: 'Mikayla Rivera', role: 'student' },
  { slug: 'landin-romo', displayName: 'Landin Romo', role: 'student' },
  { slug: 'colin-sabia', displayName: 'Colin Sabia', role: 'student' },
  { slug: 'nicholas-scalise', displayName: 'Nicholas Scalise', role: 'student' },
  { slug: 'christopher-solari', displayName: 'Christopher Solari', role: 'student' },
  { slug: 'diego-tavarez', displayName: 'Diego Tavarez', role: 'student' },
  { slug: 'khalil-wason-taylor', displayName: 'Khalil Wason-Taylor', role: 'student' },
  { slug: 'joseph-witcoski', displayName: 'Joseph Witcoski', role: 'student' },
  { slug: 'siana-zunce', displayName: 'Siana Zunce', role: 'student' },
]

const CLASS_SORTED = [...CLASS_PEOPLE_RAW].sort((a, b) => a.displayName.localeCompare(b.displayName))

const MOOD_KEYS = [
  'abstractAurora',
  'strengthTraining',
  'yogaStudio',
  'nightRUN',
  'macroBerries',
  'marbleDark',
  'neonDumbbells',
  'pilatesMat',
  'smoothieBowl',
  'cityNightLights',
  'waterSplash',
  'stretchingSilhouette',
  'darkPool',
  'studioMirror',
  'matchaPour',
]

const STORY_RING_PRESETS = [
  'from-[#C9A96E] to-[#E91E8C]',
  'from-[#E91E8C] to-[#7B2FBE]',
  'from-[#FF6B6B] to-[#FFB3D1]',
  'from-[#7B2FBE] to-[#FF6B6B]',
  'from-[#FFB3D1] to-[#E91E8C]',
  'from-[#C9A96E] to-[#7B2FBE]',
  'from-[#7B2FBE] to-[#FFB3D1]',
  'from-[#FF6B6B] to-[#7B2FBE]',
]

const CLASS_COUNT_OTHERS = CLASS_PEOPLE_RAW.length - 1

function slugHash(slug) {
  let h = 0
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 33 + slug.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function storyLabelFor(slug, displayName) {
  if (slug === 'ericmarquez') return 'You'
  const parts = displayName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].length > 9 ? `${parts[0].slice(0, 8)}…` : parts[0]
  const first = parts[0]
  const lastInitial = parts[parts.length - 1][0]
  const short = `${first} ${lastInitial}.`
  return short.length > 11 ? `${first[0]}. ${parts[parts.length - 1]}` : short
}

function buildMember(entry, index) {
  const { slug, displayName, role } = entry
  const first = displayName.split(' ')[0]
  const moodKey = MOOD_KEYS[index % MOOD_KEYS.length]
  const isEric = slug === 'ericmarquez'
  const isDana = slug === 'dana-internicola'
  const h = slugHash(slug)

  /** Class-sized social graph: mostly classmates following each other. */
  let followerCount
  let followingCount
  if (isEric) {
    followerCount = CLASS_COUNT_OTHERS
    followingCount = CLASS_COUNT_OTHERS
  } else if (isDana) {
    followerCount = CLASS_COUNT_OTHERS
    followingCount = Math.min(CLASS_COUNT_OTHERS, 18 + (h % 9))
  } else {
    followerCount = 9 + (h % 15)
    followingCount = 8 + (slugHash(`${slug}|f`) % 14)
  }

  return {
    slug,
    displayName,
    verified: false,
    bio:
      role === 'teacher'
        ? `${first} · instructor · stay hydrated, bring the energy.`
        : `${first} · class crew · GlowFuel recovery era.`,
    storyLabel: storyLabelFor(slug, displayName),
    storyRing: STORY_RING_PRESETS[index % STORY_RING_PRESETS.length],
    avatarImage: MOOD_IMG[moodKey],
    avatarInitial: displayName[0].toUpperCase(),
    followerCount,
    followingCount,
  }
}

export const COMMUNITY_MEMBERS = Object.fromEntries(
  CLASS_SORTED.map((p, i) => [p.slug, buildMember(p, i)]),
)

/** Stories strip: Eric → Dana → everyone else A–Z */
const STORY_REST_SLUGS = CLASS_SORTED.filter((p) => p.slug !== 'ericmarquez' && p.slug !== 'dana-internicola').map(
  (p) => p.slug,
)
export const STORY_MEMBER_ORDER = ['ericmarquez', 'dana-internicola', ...STORY_REST_SLUGS]

/** Everyone else in the class ring — for followers / following modals */
export function peerFollowingSlugs(memberSlug) {
  return STORY_MEMBER_ORDER.filter((s) => s !== memberSlug)
}

export function peerFollowerSlugs(memberSlug) {
  return [...STORY_MEMBER_ORDER].filter((s) => s !== memberSlug).reverse()
}

/**
 * Match typed name / @handle to roster for onboarding.
 * @returns {{ exact: string | null, candidates: string[] }} slugs
 */
export function findClassmateMatches(rawInput) {
  const q = String(rawInput ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
  const members = Object.values(COMMUNITY_MEMBERS)
  if (!q) return { exact: null, candidates: [] }

  const exactName = members.find((m) => m.displayName.toLowerCase() === q)
  if (exactName) return { exact: exactName.slug, candidates: [exactName.slug] }

  const handle = q.replace(/^@/, '')
  const bySlug = members.find((m) => m.slug === handle)
  if (bySlug) return { exact: bySlug.slug, candidates: [bySlug.slug] }

  const hyphenGuess = q.replace(/\s+/g, '-')
  const byHyphen = members.find((m) => m.slug === hyphenGuess)
  if (byHyphen) return { exact: byHyphen.slug, candidates: [byHyphen.slug] }

  const contains = members.filter(
    (m) =>
      m.displayName.toLowerCase().includes(q) ||
      m.slug.includes(q.replace(/\s+/g, '')) ||
      m.slug.includes(hyphenGuess),
  )
  if (contains.length === 1) return { exact: contains[0].slug, candidates: [contains[0].slug] }
  if (contains.length > 1) {
    return { exact: null, candidates: contains.map((m) => m.slug) }
  }

  const first = q.split(' ')[0]
  if (first.length >= 2) {
    const firstMatches = members.filter(
      (m) =>
        m.displayName.toLowerCase().startsWith(first) ||
        m.displayName.toLowerCase().split(/\s+/)[0] === first,
    )
    if (firstMatches.length >= 1) {
      return {
        exact: firstMatches.length === 1 ? firstMatches[0].slug : null,
        candidates: firstMatches.map((m) => m.slug),
      }
    }
  }

  return { exact: null, candidates: [] }
}

const CLASS_SIZE = STORY_MEMBER_ORDER.length

/** Classmates who can like/comment (everyone except the author). */
const MAX_PEER_ENGAGEMENT = CLASS_SIZE - 1

/** Featured feed posts: many peer replies visible in the demo. */
const COMMENTS_PER_BASE_POST = 14

const CLASS_COMMENT_SNIPPETS = [
  'Literally so good.',
  'Need this energy.',
  'Saving this 🔥',
  'This is the assignment fr.',
  'The can in frame >>>',
  'Class was goated today.',
  'Stop I love this.',
  'Hydration looks good on you.',
  'Posting mine after class.',
  'Berry Radiance supremacy.',
  'Real.',
  'OKAY this feed though.',
  'Tag me next time 😭',
  'We love the dedication.',
  'Sent this to the group chat.',
  'Professor energy (compliment).',
  'How do you always make it look this good?',
  'Dead.',
  'That pour is immaculate.',
  'Literally our whole row saw this.',
  'Adding to my finals-week stack.',
  'The lighting ?? Unreal.',
  'Peach Glow hive assemble.',
  'This should be in the syllabus.',
  'No notes. Perfect execution.',
  'Saw you in the studio — iconic.',
  'My roommate is obsessed now.',
  'Certified glow moment.',
  'Citrus Boost next time we study?',
  'Screenrecording this for evidence.',
  'Slay hydration slay.',
  'You’re making the rest of us look bad 😂',
  'Respect. Pure respect.',
]

/** Likes = only classmates (max class size minus the author). Dana’s posts trend near full-class. */
export function classScaleLikes(seed, authorSlug) {
  const cap = MAX_PEER_ENGAGEMENT
  const h = (seed * 31 + slugHash(`${authorSlug}|likes|${seed}`)) >>> 0
  const isDana = authorSlug === 'dana-internicola'
  if (isDana) {
    const lo = Math.min(17, cap)
    return lo + (h % (cap - lo + 1))
  }
  const lo = 6
  const hi = Math.min(24, cap)
  return lo + (h % (hi - lo + 1))
}

export function buildClassComments(authorSlug, seed, count) {
  const pool = STORY_MEMBER_ORDER.filter((s) => s !== authorSlug)
  const n = Math.min(Math.max(1, count), pool.length)
  const comments = []
  let step = 1 + (seed % 5)
  let idx = seed % pool.length
  const used = new Set()
  let guard = 0
  while (comments.length < n && guard < 200) {
    guard += 1
    const slug = pool[idx % pool.length]
    idx += step
    if (used.has(slug)) continue
    used.add(slug)
    const m = COMMUNITY_MEMBERS[slug]
    comments.push({
      id: `c-${authorSlug}-${seed}-${comments.length}`,
      author: m.displayName,
      authorSlug: slug,
      text: CLASS_COMMENT_SNIPPETS[(seed + comments.length * 3) % CLASS_COMMENT_SNIPPETS.length],
      time: ['now', '8m', '22m', '1h', '2h', '4h'][(seed + comments.length) % 6],
    })
  }
  return comments
}

const ROTATING_CAPTIONS = [
  'Post-session pour hitting different tonight ✨ #GlowFuelGirls',
  'Zero sugar ≠ zero fun — this misty can is my whole aesthetic.',
  'Leg day + Peach Glow = the only split I care about.',
  'Night run energy: neon legs, chilled Berry Radiance.',
  'Mobility flow done. Citrus Boost tastes like a reward.',
  'New PR, same recovery ritual — hydrate like it’s luxury.',
  'Brunch crew tried the spritz recipe. We’re obsessed.',
  'Hot girl walk upgraded: SPF, playlist, GlowFuel.',
  'Shelfie game strong — the can matches my LED strip.',
  'Coach said rest days count. I’m listening — slowly.',
  'Post-yoga glow is real when hydration is this pretty.',
  'Meal prep Sunday + macro bowls + chilled cans in the fridge.',
  'Studio lights + mirror selfie + zero compromise fizz.',
  'Training block week 4: obsessed with how calm recovery feels.',
  'Girls night in: face masks, rom-coms, berry pour shots.',
  'Morning cortisol who? This sip is my soft ritual.',
]

const ROTATING_TIMES = ['now', '3m', '12m', '28m', '1h', '3h', '6h', '9h', '14h', '1d', '2d', '3d', '5d']

const ROTATING_FILTERS = ['all', 'challenges', 'results', 'recipes']

const ROTATING_AUTHORS = STORY_MEMBER_ORDER

function buildPost({
  id,
  memberSlug,
  filter,
  caption,
  moodKey,
  can,
  time,
  likes,
  imageAlt,
  comments = [],
}) {
  const m = COMMUNITY_MEMBERS[memberSlug]
  const image = can ? CAN_IMG : MOOD_IMG[moodKey]
  return {
    id,
    memberSlug,
    user: m.displayName,
    handle: `@${memberSlug}`,
    time,
    verified: m.verified,
    caption,
    filter,
    image,
    imageAlt,
    likes,
    likedByMe: false,
    comments,
  }
}

const baseThreads = [
  buildPost({
    id: 'p-1',
    memberSlug: 'dana-internicola',
    filter: 'all',
    caption:
      'Night Recovery in wild berry is live — mist, marble, moonlight. Tag your pour with #GlowFuelGirls (yes, it counts for participation).',
    moodKey: 'marbleDark',
    can: true,
    time: '2h',
    likes: classScaleLikes(1, 'dana-internicola'),
    imageAlt: 'GlowFuel night recovery can on dark marble',
    comments: buildClassComments('dana-internicola', 1, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-2',
    memberSlug: 'christopher-harris',
    filter: 'results',
    caption: 'Deadlift day PR — Peach Glow on ice. Recovery that tastes expensive.',
    moodKey: 'strengthTraining',
    can: false,
    time: '4h',
    likes: classScaleLikes(2, 'christopher-harris'),
    imageAlt: 'Athlete training in dim gym',
    comments: buildClassComments('christopher-harris', 2, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-3',
    memberSlug: 'lea-cini',
    filter: 'challenges',
    caption: 'Challenge check-in: 10k steps + Berry Radiance in the park. Feeling lifted.',
    moodKey: 'nightRUN',
    can: false,
    time: '6h',
    likes: classScaleLikes(3, 'lea-cini'),
    imageAlt: 'Runner at night on city path',
    comments: buildClassComments('lea-cini', 3, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-4',
    memberSlug: 'dana-internicola',
    filter: 'recipes',
    caption: 'Peach Glow spritz: muddled basil, crushed ice, slow pour — Sunday brunch approved.',
    moodKey: 'macroBerries',
    can: false,
    time: '1d',
    likes: classScaleLikes(4, 'dana-internicola'),
    imageAlt: 'Fresh berries close-up',
    comments: buildClassComments('dana-internicola', 4, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-5',
    memberSlug: 'mikayla-rivera',
    filter: 'all',
    caption: 'Shelfie update: night routine is mineral-forward and moonlit 💫',
    moodKey: 'abstractAurora',
    can: false,
    time: '2d',
    likes: classScaleLikes(5, 'mikayla-rivera'),
    imageAlt: 'Abstract aurora fluid art',
    comments: buildClassComments('mikayla-rivera', 5, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-6',
    memberSlug: 'ericmarquez',
    filter: 'all',
    caption: 'Peach Glow after a long build session — soft light, loud fizz. Class demo energy ⚡',
    moodKey: 'cityNightLights',
    can: true,
    time: '3d',
    likes: classScaleLikes(6, 'ericmarquez'),
    imageAlt: 'GlowFuel can with city vibe',
    comments: buildClassComments('ericmarquez', 6, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-7',
    memberSlug: 'colin-sabia',
    filter: 'results',
    caption: 'Slow flow Friday. Mobility tastes better with Citrus Boost waiting.',
    moodKey: 'yogaStudio',
    can: false,
    time: '8h',
    likes: classScaleLikes(7, 'colin-sabia'),
    imageAlt: 'Yoga studio stretch',
    comments: buildClassComments('colin-sabia', 7, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-8',
    memberSlug: 'nicholas-scalise',
    filter: 'challenges',
    caption: '30-min EMOM finisher 💀 cooled down with Berry Radiance. Who’s in next week?',
    moodKey: 'neonDumbbells',
    can: false,
    time: '11h',
    likes: classScaleLikes(8, 'nicholas-scalise'),
    imageAlt: 'Neon dumbbells workout',
    comments: buildClassComments('nicholas-scalise', 8, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-9',
    memberSlug: 'isaac-oden',
    filter: 'recipes',
    caption: 'Matcha + Tropical Shine mocktail — recipe in highlights.',
    moodKey: 'matchaPour',
    can: false,
    time: '16h',
    likes: classScaleLikes(9, 'isaac-oden'),
    imageAlt: 'Matcha pour aesthetic',
    comments: buildClassComments('isaac-oden', 9, COMMENTS_PER_BASE_POST),
  }),
  buildPost({
    id: 'p-10',
    memberSlug: 'victoria-madailperez',
    filter: 'all',
    caption: 'Pilates princess era but make it electrolytes.',
    moodKey: 'pilatesMat',
    can: false,
    time: '18h',
    likes: classScaleLikes(10, 'victoria-madailperez'),
    imageAlt: 'Pilates mat workout',
    comments: buildClassComments('victoria-madailperez', 10, COMMENTS_PER_BASE_POST),
  }),
]

const generated = Array.from({ length: 54 }, (_, i) => {
  const author = ROTATING_AUTHORS[i % ROTATING_AUTHORS.length]
  let caption = ROTATING_CAPTIONS[i % ROTATING_CAPTIONS.length]
  const moodKey = MOOD_KEYS[i % MOOD_KEYS.length]
  const filter = ROTATING_FILTERS[i % ROTATING_FILTERS.length]
  const time = ROTATING_TIMES[i % ROTATING_TIMES.length]
  const useCan = i % 7 === 0
  if (i >= ROTATING_CAPTIONS.length) {
    caption = `${caption} · part ${i + 1}`
  }

  const commentCount = Math.min(MAX_PEER_ENGAGEMENT, 10 + (i % 6))

  return buildPost({
    id: `p-gen-${i + 1}`,
    memberSlug: author,
    filter,
    caption,
    moodKey,
    can: useCan,
    time,
    likes: classScaleLikes(100 + i, author),
    imageAlt: useCan ? 'GlowFuel sparkling recovery can' : 'Community mood photo',
    comments: buildClassComments(author, 200 + i, commentCount),
  })
})

export const SEED_POSTS = [...baseThreads, ...generated]