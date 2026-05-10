import { useEffect, useRef, useState } from 'react'
import { MOOD_IMG, CAN_IMG } from '../data/media'
import { useCommunityFeed } from '../context/useCommunityFeed'

const FILTERS = [
  { id: 'all', label: 'All Posts' },
  { id: 'challenges', label: 'Challenge' },
  { id: 'results', label: 'Results' },
  { id: 'recipes', label: 'Recipe' },
]

const PRESETS = [
  { id: 'can', label: 'Product can', src: CAN_IMG, useCan: true, moodKey: null },
  { id: 'abstractAurora', label: 'Aurora', src: MOOD_IMG.abstractAurora, useCan: false, moodKey: 'abstractAurora' },
  { id: 'strengthTraining', label: 'Training', src: MOOD_IMG.strengthTraining, useCan: false, moodKey: 'strengthTraining' },
  { id: 'yogaStudio', label: 'Studio', src: MOOD_IMG.yogaStudio, useCan: false, moodKey: 'yogaStudio' },
  { id: 'nightRUN', label: 'Night run', src: MOOD_IMG.nightRUN, useCan: false, moodKey: 'nightRUN' },
  { id: 'macroBerries', label: 'Berries', src: MOOD_IMG.macroBerries, useCan: false, moodKey: 'macroBerries' },
  { id: 'cityNightLights', label: 'City glow', src: MOOD_IMG.cityNightLights, useCan: false, moodKey: 'cityNightLights' },
  { id: 'marbleDark', label: 'Marble', src: MOOD_IMG.marbleDark, useCan: false, moodKey: 'marbleDark' },
]

export function PostComposerModal({ open, onClose }) {
  const { addPost } = useCommunityFeed()
  const fileInputRef = useRef(null)
  const [caption, setCaption] = useState('')
  const [filter, setFilter] = useState('all')
  const [presetId, setPresetId] = useState('can')
  const [customImageUrl, setCustomImageUrl] = useState(null)

  function releasePreviewUrl(url) {
    if (url && typeof url === 'string' && url.startsWith('blob:')) URL.revokeObjectURL(url)
  }

  function revokeCustomUrl() {
    setCustomImageUrl((prev) => {
      releasePreviewUrl(prev)
      return null
    })
  }

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  useEffect(() => {
    if (open) return
    setCustomImageUrl((prev) => {
      releasePreviewUrl(prev)
      return null
    })
  }, [open])

  if (!open) return null

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]
  const previewSrc = customImageUrl ?? preset.src

  function closeAndReset() {
    setCaption('')
    setFilter('all')
    setPresetId('can')
    revokeCustomUrl()
    onClose()
  }

  function selectPreset(p) {
    revokeCustomUrl()
    setPresetId(p.id)
  }

  function onPickFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    revokeCustomUrl()
    const reader = new FileReader()
    reader.onload = () => setCustomImageUrl(reader.result)
    reader.readAsDataURL(file)
  }

  function submit() {
    addPost({
      caption,
      filter,
      moodKey: customImageUrl ? 'abstractAurora' : preset.moodKey ?? 'abstractAurora',
      useCan: !customImageUrl && preset.useCan,
      imageUrl: customImageUrl ?? undefined,
    })
    closeAndReset()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="composer-title"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onPickFile}
      />
      <button
        type="button"
        className="absolute inset-0 bg-[#0A0A2E]/82 backdrop-blur-sm"
        aria-label="Close composer"
        onClick={closeAndReset}
      />
      <div className="relative z-[1] mx-auto w-full max-w-[390px] rounded-t-[28px] border border-white/10 gf-glass px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-[0_-20px_60px_rgba(0,0,0,0.45)] sm:rounded-[28px]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="composer-title" className="text-lg font-bold text-white">
              Post Your Glow
            </h2>
            <p className="mt-1 text-xs font-light text-[#FFB3D1]">Share the sip, the sweat, or the setup.</p>
          </div>
          <button
            type="button"
            onClick={closeAndReset}
            className="gf-glow-hover flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-lg leading-none text-[#FFB3D1]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">
          Caption
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          placeholder="What’s glowing today? Tag #GlowFuelGirls…"
          className="mt-2 w-full resize-none rounded-[20px] border border-white/10 bg-[#1A0A3E]/85 px-4 py-3 text-sm font-light text-white placeholder:text-[#FFB3D1]/45 focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/35"
        />

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">Category</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.id
                  ? 'bg-gradient-to-r from-[#E91E8C] to-[#7B2FBE] text-white shadow-[0_0_16px_rgba(233,30,140,0.35)]'
                  : 'bg-white/5 text-[#FFB3D1] ring-1 ring-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#C9A96E]">Cover image</p>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[18px] ring-2 transition ${
              customImageUrl ? 'ring-[#C9A96E] shadow-[0_0_20px_rgba(201,169,110,0.35)]' : 'ring-transparent'
            } bg-white/10 text-[9px] font-semibold leading-tight text-white`}
          >
            {customImageUrl ? (
              <img src={customImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            ) : (
              <>
                <span className="text-lg leading-none">＋</span>
                <span className="px-1 text-center">From device</span>
              </>
            )}
          </button>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPreset(p)}
              className={`relative shrink-0 overflow-hidden rounded-[18px] ring-2 transition ${
                !customImageUrl && presetId === p.id
                  ? 'ring-[#C9A96E] shadow-[0_0_20px_rgba(201,169,110,0.35)]'
                  : 'ring-transparent'
              }`}
            >
              <img src={p.src} alt="" className="h-16 w-16 object-cover" loading="lazy" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 py-1 text-[9px] font-semibold text-white">
                {p.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex justify-center">
          <img
            src={previewSrc}
            alt="Preview"
            className="h-28 max-w-full rounded-[20px] object-cover ring-1 ring-white/15"
          />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!caption.trim()}
          className="gf-magenta-btn mt-5 w-full rounded-[20px] py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Publish to the feed
        </button>
      </div>
    </div>
  )
}
