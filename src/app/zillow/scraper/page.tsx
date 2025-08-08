'use client'

export default function ZillowScraper() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Scraper</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Target city or ZIP" />
        <button className="px-3 py-2 rounded-lg border border-[#53d2ff]/40 text-[#9be8ff] hover:bg-[#0e3a4a]/40">Start Zillow Search</button>
        <button className="px-3 py-2 rounded-lg border border-[#53d2ff]/40 text-[#9be8ff] hover:bg-[#0e3a4a]/40">Scrape Latest For-Rent</button>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" /> Skip "Already Rented"</label>
        <label className="flex items-center gap-2"><input type="checkbox" /> Skip "No Agents"</label>
        <label className="flex items-center gap-2"><input type="checkbox" /> Skip duplicate photos</label>
      </div>
      <div className="mt-3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-white/70">
              <th className="py-2">Address</th><th>Price</th><th>Bedrooms</th><th>Link</th><th>Owner</th><th>Notes</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-white/10 text-white/80">
              <td className="py-2">—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td>
              <td><button className="px-2 py-1 rounded-md border border-white/20">Message</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

