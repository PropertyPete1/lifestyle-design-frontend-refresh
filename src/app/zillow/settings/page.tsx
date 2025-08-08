'use client'

export default function ZillowSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email" placeholder="user@example.com" />
        <Input label="Google Sheet URL (Logs)" placeholder="https://docs.google.com/..." />
        <Input label="Max Price" placeholder="e.g., 2500" />
        <Input label="Min Bedrooms" placeholder="e.g., 2" />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Filters</h2>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Auto-detect Red Flags</label>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Scheduler</h2>
        <Input label="Message Frequency (per day)" placeholder="5" />
        <Input label="Message Time Range" placeholder="10:00–18:00" />
      </section>
      <button className="px-3 py-2 rounded-lg border border-[#53d2ff]/40 text-[#9be8ff] hover:bg-[#0e3a4a]/40">Save Settings</button>
    </div>
  )
}

function Input({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="text-sm text-white/80">
      <div className="mb-1 text-white/60">{label}</div>
      <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder={placeholder} />
    </label>
  )
}

