'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotificationSystem from '../../components/NotificationSystem'

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
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white flex">
      <NotificationSystem />
      <aside className="w-64 hidden md:flex flex-col gap-2 p-4 border-r border-white/10 bg-gradient-to-b from-[#0b0f14] to-[#0e131a]">
        <div className="text-xl font-semibold tracking-wide mb-4 text-[#6ee7ff]">Zillow Assistant</div>
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-[#0e3a4a]/60 border border-[#53d2ff]/40 shadow-[0_0_18px_rgba(83,210,255,0.25)]' : 'hover:bg-white/5 border border-transparent'}`}>
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </aside>
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}

