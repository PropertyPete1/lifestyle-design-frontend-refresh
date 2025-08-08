'use client'

export default function ZillowDashboard() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat title="Zillow Scraper Status" value="Idle" accent="#53d2ff" />
        <Stat title="Last Run" value="—" />
        <Stat title="Total Listings Found" value="0" />
        <Stat title="Messages Sent Today" value="0" />
      </div>

      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Scheduler Summary</h2>
          <button className="px-3 py-2 rounded-lg border border-[#53d2ff]/40 text-[#9be8ff] hover:bg-[#0e3a4a]/40">Re-Run Scraper</button>
        </div>
        <div className="text-sm text-white/70">Next Auto Message: — • Daily Limit: — • Auto Message: OFF</div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Weekly Analytics</h2>
        <div className="h-40 bg-white/5 rounded-lg border border-white/10" />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Smart Activity Feed</h2>
        <ul className="text-sm text-white/75 space-y-2">
          <li>—</li>
        </ul>
      </Card>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-4 rounded-xl border border-white/10 bg-white/5 ${className}`}>{children}</div>
}

function Stat({ title, value, accent = '#7dd3fc' }: { title: string; value: string; accent?: string }) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
      <div className="text-xs uppercase tracking-wide text-white/60">{title}</div>
      <div className="mt-2 text-2xl font-bold" style={{ color: accent }}>{value}</div>
    </div>
  )
}

