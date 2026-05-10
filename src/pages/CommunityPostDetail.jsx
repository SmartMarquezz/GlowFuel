import { Link, useNavigate, useParams } from 'react-router-dom'
import { CommunityPostCard } from '../components/CommunityPostCard'
import { useCommunityFeed } from '../context/useCommunityFeed'

export function CommunityPostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { getPostById } = useCommunityFeed()
  const post = getPostById(postId)

  if (!post) {
    return (
      <div className="scroll-stable flex min-h-dvh flex-col items-center justify-center gap-4 px-6 pb-28 pt-10 text-center">
        <p className="text-5xl" aria-hidden="true">
          ✦
        </p>
        <p className="text-lg font-semibold text-white">Post not found</p>
        <p className="text-sm font-light text-[#FFB3D1]">It may have been removed or the link is outdated.</p>
        <Link to="/community" className="gf-magenta-btn rounded-[20px] px-6 py-3 text-sm font-semibold text-white">
          Back to Community
        </Link>
      </div>
    )
  }

  return (
    <div className="scroll-stable flex min-h-dvh flex-col gap-4 overflow-y-auto px-4 pb-28 pt-4">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="gf-glow-hover flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-[#FFB3D1]"
          aria-label="Back"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Post</p>
          <p className="truncate text-xs font-light text-[#FFB3D1]/85">@{post.memberSlug}</p>
        </div>
      </header>
      <CommunityPostCard post={post} />
    </div>
  )
}
