import React from 'react';

export type HeatSlot = { dayIndex: number; hour: number; score: number };

export type HeatmapMeta = {
  scale: { min: number; max: number };
  generatedAt: string;
  method: 'weighted' | 'viewerOnly' | 'performanceOnly';
  weights: { viewerActivity: number; postPerformance: number };
};

export default function HeatmapWeekly({
  matrix,
  meta,
  topSlots,
  viewerMatrix,
  performanceMatrix
}: {
  matrix: number[][]; // [7][24]
  meta: HeatmapMeta;
  topSlots: HeatSlot[];
  viewerMatrix?: number[][] | null;
  performanceMatrix?: number[][] | null;
}) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ marginBottom: 8, color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
        Smart Scheduler uses the brightest cells. Cool = lower opportunity, Hot = higher opportunity.
        Weighted by viewer activity & post performance.
      </div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', color: '#999', fontWeight: 500 }}></th>
            {Array.from({ length: 24 }, (_, h) => (
              <th key={h} style={{ color: '#999', fontWeight: 500, fontSize: 10, padding: 2 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, d) => (
            <tr key={d}>
              <td style={{ color: '#ccc', fontSize: 12, paddingRight: 6 }}>{days[d]}</td>
              {row.map((cell, h) => {
                const pct = Math.max(0, Math.min(100, cell));
                // pink-red gradient
                const bg = `linear-gradient(180deg, rgba(255,105,180,${pct/120}) 0%, rgba(255,0,0,${pct/120}) 100%)`;
                const isTop = topSlots.some(s => s.dayIndex === d && s.hour === h);
                const viewerPct = viewerMatrix && viewerMatrix[d] ? viewerMatrix[d][h] : null;
                const perfPct = performanceMatrix && performanceMatrix[d] ? performanceMatrix[d][h] : null;
                const title = `${days[d]} ${String(h).padStart(2,'0')}:00 CT • Heat ${pct}` +
                  (viewerPct != null ? ` • Viewer ${viewerPct}` : '') +
                  (perfPct != null ? ` • Perf ${perfPct}` : '');
                return (
                  <td key={h} title={`${days[d]} ${String(h).padStart(2,'0')}:00 CT • Heat ${pct}`}
                      style={{ width: 18, height: 18, background: bg, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    {isTop && (
                      <div style={{ position: 'absolute', top: 2, right: 2, fontSize: 9, color: '#fff' }}>★</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
        Generated {new Date(meta.generatedAt).toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT • Method: {meta.method}
      </div>
    </div>
  );
}


