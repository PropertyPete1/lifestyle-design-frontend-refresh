'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotificationSystem from '../../components/NotificationSystem'
import { useState } from 'react'

const nav = [
  { href: '/zillow', label: 'Dashboard', icon: '🏠' },
  { href: '/zillow/scraper', label: 'Scraper', icon: '🔍' },
  { href: '/zillow/messages', label: 'Messages', icon: '📨' },
  { href: '/zillow/logs', label: 'Logs', icon: '🗂️' },
  { href: '/zillow/settings', label: 'Settings', icon: '⚙️' },
  { href: '/zillow/test', label: 'Test Mode', icon: '🧪' },
  { href: '/zillow/analytics', label: 'Analytics', icon: '📊' },
]

export default function ZillowLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white flex">
      <NotificationSystem />

      {/* Mobile top bar */}
      <div className="fixed md:hidden top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#0b0f14]/95 backdrop-blur z-40">
        <button onClick={() => setOpen(true)} className="px-3 py-1 rounded-lg border border-white/15">☰</button>
        <div className="text-base font-semibold tracking-wide text-[#6ee7ff]">Zillow Assistant</div>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside className={`w-64 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static top-0 left-0 h-full md:h-auto md:flex flex-col gap-2 p-4 border-r border-white/10 bg-gradient-to-b from-[#0b0f14] to-[#0e131a] transition-transform duration-300 z-50`}>
        <div className="hidden md:block text-xl font-semibold tracking-wide mb-4 text-[#6ee7ff]">Zillow Assistant</div>
        <button onClick={() => setOpen(false)} className="md:hidden mb-3 px-3 py-1 rounded-lg border border-white/15 w-min">✕</button>
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-[#0e3a4a]/60 border border-[#53d2ff]/40 shadow-[0_0_18px_rgba(83,210,255,0.25)]' : 'hover:bg-white/5 border border-transparent'}`}>
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </aside>

      <main className="flex-1 p-4 md:p-6 md:ml-0 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  )
}

