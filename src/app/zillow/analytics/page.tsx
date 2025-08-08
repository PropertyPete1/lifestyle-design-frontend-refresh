'use client'

export default function ZillowAnalytics() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Messages Sent per Day" />
        <Card title="Owner Response Rate" />
        <Card title="Top Performing Zip Codes" />
      </div>
      <Card title="Smart Suggestions">
        <ul className="text-sm text-white/75 list-disc pl-5">
          <li>—</li>
        </ul>
      </Card>
    </div>
  )
}

function Card({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="h-40 bg-white/5 rounded-lg border border-white/10" />
      {children}
    </div>
  )
}

