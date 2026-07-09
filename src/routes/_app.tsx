'use client'

import { Outlet, useLocation, createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { AppSidebar } from '~/components/layout/AppSidebar'
import { AppNavbar } from '~/components/layout/AppNavbar'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppNavbar />
        <main className="flex-1 px-4 py-6 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-7xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
