'use client'

export default function ZillowMessages() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Messaging</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="text-sm text-white/60 mb-2">Selected Listing</div>
          <div className="h-40 bg-white/10 rounded-lg" />
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="text-sm text-white/60 mb-2">Message</div>
          <textarea className="w-full h-40 p-3 rounded-lg bg-white/5 border border-white/10" placeholder="Personalized opener..." />
          <div className="mt-3 flex items-center gap-3">
            <button className="px-3 py-2 rounded-lg border border-[#53d2ff]/40 text-[#9be8ff] hover:bg-[#0e3a4a]/40">Send</button>
            <button className="px-3 py-2 rounded-lg border border-white/20">Regenerate</button>
            <span className="text-sm text-white/60">Status: —</span>
          </div>
        </div>
      </div>
    </div>
  )
}

