'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { API_ENDPOINTS } from '@/utils/api'

export default function ActivityHeatmap() {
  const [platform, setPlatform] = useState<'instagram' | 'youtube'>(() => (typeof window !== 'undefined' && (localStorage.getItem('heatmapPlatform') as any)) || 'instagram')
  const [grid, setGrid] = useState<Array<Array<{ score: number; reach: number; level: string; count: number }>>>([])
  const [summary, setSummary] = useState<string>('')
  const [optimal, setOptimal] = useState<string[]>([])
  const [bestToday, setBestToday] = useState<number | null>(null)
  const dayNames = useMemo(() => ['SUN','MON','TUE','WED','THU','FRI','SAT'], [])

  useEffect(() => {
    const fetchData = async () => {
      // Use weekly heatmap per spec
      const res = await fetch(API_ENDPOINTS.heatmapWeekly())
      if (res.ok) {
        const data = await res.json()
        setGrid(data.grid || [])
        // Compute today's best hour
        const today = new Date().getDay()
        const row = (data.grid || [])[today] || []
        let bestHour = 0; let bestReach = -1
        for (let h = 0; h < row.length; h++) {
          if ((row[h]?.reach || 0) > bestReach) { bestReach = row[h].reach; bestHour = h }
        }
        setBestToday(bestHour)
      }
    }
    const fetchSummary = async () => {
      // Optional summary not required in spec; keep graceful fallback
      setSummary('')
    }
    const fetchOptimal = async () => {
      const res = await fetch(API_ENDPOINTS.heatmapOptimalTimes())
      if (res.ok) {
        const data = await res.json();
        const list: string[] = []
        const ig = (data?.slots || []).filter((s:any)=>s.platform==='instagram').slice(0,3)
        const yt = (data?.slots || []).filter((s:any)=>s.platform==='youtube').slice(0,3)
        const fmt = (s:any)=> (s?.localLabel) || new Date(s.iso).toLocaleString('en-US',{ timeZone:'America/Chicago', hour:'numeric', minute:'2-digit', hour12:true }) + ' CT'
        if (ig.length) list.push(...ig.map(fmt))
        if (yt.length) list.push(...yt.map(fmt))
        setOptimal(list)
      }
    }
    fetchData(); fetchSummary(); fetchOptimal();
    localStorage.setItem('heatmapPlatform', platform)
  }, [platform])

  return (
    <div className="activity-tracker-container">
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button onClick={() => setPlatform('instagram')} style={{ padding: '6px 10px', borderRadius: 8, border: platform==='instagram' ? '1px solid #ff7ab6' : '1px solid rgba(255,255,255,0.2)', background: platform==='instagram' ? 'rgba(255,105,180,0.15)' : 'transparent', color: '#fff' }}>Instagram</button>
        <button onClick={() => setPlatform('youtube')} style={{ padding: '6px 10px', borderRadius: 8, border: platform==='youtube' ? '1px solid #ff6b6b' : '1px solid rgba(255,255,255,0.2)', background: platform==='youtube' ? 'rgba(255,0,0,0.15)' : 'transparent', color: '#fff' }}>YouTube</button>
      </div>
      <div className="activity-heatmap">
        {/* Controls */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div></div>
          <div style={{ display: 'flex', gap: 8 }}>
            {optimal.map((t) => (
              <span key={t} style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', color: '#9bd', fontSize: 12 }}>⏱ {t}</span>
            ))}
          </div>
          <button
            onClick={async () => {
              const res = await fetch(API_ENDPOINTS.schedulerAutofill(platform), { method: 'POST' })
              if (res.ok) {
                try {
                  const { toast } = await import('./NotificationSystem')
                  toast.show('Smart Scheduler filled optimized time slots.', 'success')
                } catch {
                  // no-op fallback
                }
              }
            }}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.18))', color: '#fff' }}
          >
            AutoFill Smart Times
          </button>
        </div>
        <div className="heatmap-container">
          <div className="heatmap-labels">
            <div className="time-labels">
              <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
            <div className="day-labels">
              {dayNames.map((d, idx) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          <div className="heatmap-grid">
            {grid.length === 7 && grid.map((row, dIdx) => (
              <div className="day-row" key={`d-${dIdx}`}>
                {[0,1,2,3].map((blockIdx) => {
                  const start = blockIdx * 6
                  const end = start + 6
                  // Average reach for 6-hour block
                  const cells = row.slice(start, end)
                  const sum = cells.reduce((a,c) => a + (c?.reach || 0), 0)
                  const avg = Math.round(sum / (cells.length || 1))
                  // Determine level by majority cell level
                  const levels = cells.map(c => c.level)
                  const level = levels.sort((a,b) => levels.filter(v=>v===a).length - levels.filter(v=>v===b).length).pop() || 'minimal'
                  const label = `${start}-${end}`
                  const now = new Date();
                  const isCurrentRow = dIdx === now.getDay();
                  const isCurrentBlock = Math.floor(now.getHours() / 6) === blockIdx;
                  const isBestTodayBlock = isCurrentRow && bestToday !== null && Math.floor(bestToday / 6) === blockIdx;
                  const style: React.CSSProperties = {
                    ...(isCurrentRow && isCurrentBlock ? { boxShadow: '0 0 0 2px rgba(148,163,184,0.6), 0 0 24px rgba(99,102,241,0.45)' } : {}),
                    ...(isBestTodayBlock ? { outline: '2px solid rgba(34,197,94,0.55)', filter: 'brightness(1.08)' } : {})
                  };
                  return (
                    <div className={`activity-cell ${level}`} style={style} data-hour={label} title={`Avg reach: ${avg}`} key={`d-${dIdx}-b-${blockIdx}`}></div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="activity-legend">
          <span className="legend-title">Activity Level</span>
          <div className="legend-scale">
            <div className="legend-item minimal">
              <div className="legend-color"></div>
              <span>Minimal</span>
            </div>
            <div className="legend-item low">
              <div className="legend-color"></div>
              <span>Low</span>
            </div>
            <div className="legend-item medium">
              <div className="legend-color"></div>
              <span>Medium</span>
            </div>
            <div className="legend-item high">
              <div className="legend-color"></div>
              <span>High</span>
            </div>
            <div className="legend-item very-high">
              <div className="legend-color"></div>
              <span>Very High</span>
            </div>
            <div className="legend-item extreme">
              <div className="legend-color"></div>
              <span>Peak</span>
            </div>
          </div>
        </div>

        <div className="activity-insights">
          <div className="insight-item">
            <span className="insight-label">Peak Time:</span>
            <span className="insight-value">Thu-Fri 12-18h</span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Optimal Posting:</span>
            <span className="insight-value">Weekdays 14:30</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .activity-tracker-container { position: relative; }
        .activity-heatmap { 
          --cell-h: clamp(28px, 4.2vw, 38px);
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          padding: 2rem 1rem; width: min(1100px, 100vw - 32px); margin: 0 auto; overflow-x: hidden; 
        }
        .heatmap-container { display: flex; gap: 0; align-items: flex-start; background: rgba(15, 23, 42, 0.3); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(59, 130, 246, 0.2); width: 100%; overflow-x: hidden; margin: 0 auto; }
        .heatmap-labels { display: flex; flex-direction: column; gap: 0; }
        .time-labels { display: flex; justify-content: space-between; width: 320px; margin-bottom: 1rem; margin-left: 80px; padding: 0 10px; min-width: 320px; box-sizing: border-box; }
        .time-labels span { font-size: 0.8rem; color: #60a5fa; font-weight: 600; letter-spacing: 1px; text-shadow: 0 0 10px rgba(96, 165, 250, 0.5); }
        .day-labels { display: flex; flex-direction: column; gap: 0; width: 70px; margin-right: 10px; flex: 0 0 70px; }
        .day-labels span { height: 40px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; color: rgba(255, 255, 255, 0.9); letter-spacing: 1px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin-bottom: 2px; border: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 0 8px rgba(96, 165, 250, 0.3); transition: all 0.3s ease; }
        .day-labels span:hover { background: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.4); transform: translateX(3px); }
        .heatmap-grid { display: flex; flex-direction: column; gap: 2px; width: 100%; margin-top: calc(var(--cell-h) + 2px); }
        .day-row { display: flex; gap: 2px; align-items: center; }
        .activity-cell { width: clamp(48px, 8vw, 75px); height: var(--cell-h); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15); position: relative; transition: all 0.3s ease; cursor: pointer; animation: cell-pulse 4s ease-in-out infinite; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 600; color: rgba(255, 255, 255, 0.8); }
        .activity-cell::after { content: attr(data-hour); font-size: 0.65rem; opacity: 0.7; font-weight: 500; }
        .activity-cell:hover { transform: scale(1.05); z-index: 10; border-color: rgba(255, 255, 255, 0.4); }
        .activity-cell.minimal { background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6)); border-color: rgba(71, 85, 105, 0.4); box-shadow: inset 0 0 15px rgba(30, 41, 59, 0.7); }
        .activity-cell.minimal::after { color: rgba(255, 255, 255, 0.5); }
        .activity-cell.low { background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(96, 165, 250, 0.2)); border-color: rgba(59, 130, 246, 0.5); box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.4), 0 0 8px rgba(59, 130, 246, 0.3); }
        .activity-cell.medium { background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(196, 181, 253, 0.3)); border-color: rgba(168, 85, 247, 0.6); box-shadow: inset 0 0 20px rgba(168, 85, 247, 0.5), 0 0 10px rgba(168, 85, 247, 0.4); }
        .activity-cell.high { background: linear-gradient(135deg, rgba(236, 72, 153, 0.5), rgba(244, 114, 182, 0.4)); border-color: rgba(236, 72, 153, 0.7); box-shadow: inset 0 0 25px rgba(236, 72, 153, 0.6), 0 0 15px rgba(236, 72, 153, 0.5); }
        .activity-cell.very-high { background: linear-gradient(135deg, rgba(239, 68, 68, 0.6), rgba(248, 113, 113, 0.5)); border-color: rgba(239, 68, 68, 0.8); box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.7), 0 0 18px rgba(239, 68, 68, 0.6); }
        .activity-cell.extreme { background: radial-gradient(circle, rgba(220, 38, 38, 0.9), rgba(239, 68, 68, 0.7)); border-color: rgba(220, 38, 38, 1); box-shadow: inset 0 0 35px rgba(220, 38, 38, 0.8), 0 0 25px rgba(220, 38, 38, 0.7), 0 0 50px rgba(220, 38, 38, 0.4); animation: extreme-pulse 2s ease-in-out infinite; }
        .activity-cell.extreme::after { color: rgba(255, 255, 255, 1); text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); }
        @keyframes cell-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes extreme-pulse { 0%, 100% { box-shadow: inset 0 0 30px rgba(220, 38, 38, 0.7), 0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3);} 50% { box-shadow: inset 0 0 40px rgba(220, 38, 38, 0.9), 0 0 30px rgba(220, 38, 38, 0.8), 0 0 60px rgba(220, 38, 38, 0.5);} }
        .activity-legend { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; align-items: center; width: 100%; }
        .legend-title { font-size: 0.85rem; font-weight: 600; color: rgba(255, 255, 255, 0.8); letter-spacing: 1px; margin-bottom: 0.25rem; }
        .legend-scale { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; justify-content: center; }
        .legend-item { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
        .legend-color { width: 20px; height: 12px; border-radius: 3px; border: 1px solid rgba(255, 255, 255, 0.2); }
        .legend-item.minimal .legend-color { background: rgba(30, 41, 59, 0.6); }
        .legend-item.low .legend-color { background: rgba(59, 130, 246, 0.4); box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
        .legend-item.medium .legend-color { background: rgba(168, 85, 247, 0.5); box-shadow: 0 0 5px rgba(168, 85, 247, 0.4); }
        .legend-item.high .legend-color { background: rgba(236, 72, 153, 0.6); box-shadow: 0 0 8px rgba(236, 72, 153, 0.4); }
        .legend-item.very-high .legend-color { background: rgba(239, 68, 68, 0.7); box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
        .legend-item.extreme .legend-color { background: radial-gradient(circle, rgba(220, 38, 38, 0.9), rgba(239, 68, 68, 0.7)); box-shadow: 0 0 15px rgba(220, 38, 38, 0.6); }
        .legend-item span { font-size: 0.7rem; color: rgba(255, 255, 255, 0.6); font-weight: 500; }
        .activity-insights { margin-top: 1.5rem; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
        .insight-item { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
        .insight-label { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); font-weight: 500; letter-spacing: 1px; }
        .insight-value { font-size: 0.9rem; color: #60a5fa; font-weight: 600; text-shadow: 0 0 10px rgba(96, 165, 250, 0.5); }
        @media (max-width: 900px) {
          .time-labels { margin-left: 70px; }
        }
        @media (max-width: 640px) {
          .activity-heatmap { --cell-h: clamp(24px, 6.2vw, 30px); }
          .activity-heatmap { padding: 1rem 0.5rem; width: 100%; margin-left: 0; margin-right: 0; }
          .heatmap-container { max-width: 100%; padding: 0.75rem; transform: translateX(0); }
          .day-labels { width: 54px; flex: 0 0 54px; }
          .time-labels { margin-left: 54px; width: calc(100% - 54px); min-width: 0; padding: 0 6px; }
          .day-labels span { height: 30px; font-size: 0.7rem; }
          .day-row { gap: 1px; }
          .activity-cell { width: clamp(36px, 14vw, 52px); font-size: 0.62rem; }
          .activity-cell::after { font-size: 0.58rem; }
          .legend-scale { gap: 0.6rem; }
          .activity-insights { gap: 0.8rem; }
        }
        @media (max-width: 380px) {
          .activity-heatmap { --cell-h: clamp(20px, 6vw, 28px); }
          .time-labels { margin-left: 50px; }
          .day-labels { width: 50px; flex-basis: 50px; }
          .activity-cell { width: clamp(32px, 15vw, 46px); }
        }
      `}</style>
      {summary && (
        <div style={{
          marginTop: '12px',
          width: 'min(1100px, 100vw - 32px)',
          marginLeft: 'auto',
          marginRight: 'auto',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '12px 14px',
          color: 'rgba(255,255,255,0.86)'
        }} className="audience-summary-card">
          🧠 {summary}
        </div>
      )}
    </div>
  )
}

