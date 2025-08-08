'use client'

export default function ZillowTest() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Test Mode</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="text-sm text-white/60 mb-2">Sample Listing</div>
          <div className="h-40 bg-white/10 rounded-lg" />
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="text-sm text-white/60 mb-2">Preview Generated Message</div>
          <div className="h-40 bg-white/5 rounded-lg border border-white/10 p-3 text-sm">—</div>
          <div className="mt-3 flex gap-3">
            <button className="px-3 py-2 rounded-lg border border-[#53d2ff]/40 text-[#9be8ff] hover:bg-[#0e3a4a]/40">Simulate Message</button>
            <button className="px-3 py-2 rounded-lg border border-white/20">Test Message Flow</button>
          </div>
        </div>
      </div>
    </div>
  )
}

