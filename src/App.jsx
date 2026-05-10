import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CommunityFeedProvider } from './context/CommunityFeedProvider'
import { AppLayout } from './layout/AppLayout'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { Checkout } from './pages/Checkout'
import { Community } from './pages/Community'
import { Messages } from './pages/Messages'
import { Chat } from './pages/Chat'
import { Profile } from './pages/Profile'
import { CommunityPostDetail } from './pages/CommunityPostDetail'
import { MemberProfile } from './pages/MemberProfile'
import { Welcome } from './pages/Welcome'
import { FollowingProvider } from './context/FollowingProvider'
import { HomeActivityProvider } from './context/HomeActivityProvider'
import { MessagingProvider } from './context/MessagingProvider'
import { useUserSession, UserSessionProvider } from './context/UserSessionProvider'

function BootScreen() {
  return (
    <div className="gf-app-bg fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4">
      <div className="gf-spinner" role="status" aria-label="Loading" />
      <p className="text-sm font-light text-[#FFB3D1]">Crafting your glow…</p>
    </div>
  )
}

function ChatRoute() {
  const { id } = useParams()
  return <Chat key={id} />
}

function RequireMember() {
  const { ready, memberSlug } = useUserSession()
  if (!ready) return <BootScreen />
  if (!memberSlug) return <Navigate to="/welcome" replace />
  return <Outlet />
}

function WelcomeRoute() {
  const { ready, memberSlug } = useUserSession()
  if (!ready) return <BootScreen />
  if (memberSlug) return <Navigate to="/" replace />
  return <Welcome />
}

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  if (booting) return <BootScreen />

  return (
    <CartProvider>
      <UserSessionProvider>
        <CommunityFeedProvider>
          <MessagingProvider>
            <FollowingProvider>
              <HomeActivityProvider>
                <Routes>
                  <Route path="/welcome" element={<WelcomeRoute />} />
                  <Route element={<RequireMember />}>
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/community/post/:postId" element={<CommunityPostDetail />} />
                      <Route path="/community/user/:handle" element={<MemberProfile />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/messages/:id" element={<ChatRoute />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Route>
                </Routes>
              </HomeActivityProvider>
            </FollowingProvider>
          </MessagingProvider>
        </CommunityFeedProvider>
      </UserSessionProvider>
    </CartProvider>
  )
}
