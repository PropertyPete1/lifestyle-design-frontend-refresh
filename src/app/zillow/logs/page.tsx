'use client'

export default function ZillowLogs() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Logs</h1>
      <div className="flex items-center gap-3">
        <input className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Search address" />
        <button className="px-3 py-2 rounded-lg border border-white/20">Export to Google Sheets</button>
      </div>
      <div className="mt-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-white/70">
              <th className="py-2">Address</th><th>Owner</th><th>Status</th><th>Response</th><th>Date Sent</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-white/10 text-white/80">
              <td className="py-2">—</td><td>—</td><td>—</td><td>—</td><td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

