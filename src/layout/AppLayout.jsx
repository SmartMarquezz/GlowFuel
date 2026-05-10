import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuroraBackground } from '../components/AuroraBackground'
import { BottomNav } from '../components/BottomNav'

export function AppLayout() {
  const location = useLocation()
  const hideNav = /^\/messages\/.+/.test(location.pathname)

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#0A0A2E]">
      <AuroraBackground />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[390px] flex-col shadow-[0_0_80px_rgba(0,0,0,0.45)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            role="presentation"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-0 min-h-dvh flex-1 flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  )
}
