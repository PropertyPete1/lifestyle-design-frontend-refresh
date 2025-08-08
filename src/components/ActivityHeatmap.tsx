'use client'

import React from 'react'

export default function ActivityHeatmap() {
  return (
    <div className="activity-tracker-container">
      <div className="activity-heatmap">
        <div className="heatmap-container">
          <div className="heatmap-labels">
            <div className="time-labels">
              <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
            <div className="day-labels">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>
          </div>

          <div className="heatmap-grid">
            <div className="day-row" data-day="mon">
              <div className="activity-cell low" data-hour="0-6"></div>
              <div className="activity-cell medium" data-hour="6-12"></div>
              <div className="activity-cell high" data-hour="12-18"></div>
              <div className="activity-cell very-high" data-hour="18-24"></div>
            </div>
            <div className="day-row" data-day="tue">
              <div className="activity-cell low" data-hour="0-6"></div>
              <div className="activity-cell high" data-hour="6-12"></div>
              <div className="activity-cell very-high" data-hour="12-18"></div>
              <div className="activity-cell medium" data-hour="18-24"></div>
            </div>
            <div className="day-row" data-day="wed">
              <div className="activity-cell minimal" data-hour="0-6"></div>
              <div className="activity-cell medium" data-hour="6-12"></div>
              <div className="activity-cell very-high" data-hour="12-18"></div>
              <div className="activity-cell high" data-hour="18-24"></div>
            </div>
            <div className="day-row" data-day="thu">
              <div className="activity-cell low" data-hour="0-6"></div>
              <div className="activity-cell high" data-hour="6-12"></div>
              <div className="activity-cell extreme" data-hour="12-18"></div>
              <div className="activity-cell very-high" data-hour="18-24"></div>
            </div>
            <div className="day-row" data-day="fri">
              <div className="activity-cell minimal" data-hour="0-6"></div>
              <div className="activity-cell medium" data-hour="6-12"></div>
              <div className="activity-cell extreme" data-hour="12-18"></div>
              <div className="activity-cell extreme" data-hour="18-24"></div>
            </div>
            <div className="day-row" data-day="sat">
              <div className="activity-cell low" data-hour="0-6"></div>
              <div className="activity-cell low" data-hour="6-12"></div>
              <div className="activity-cell high" data-hour="12-18"></div>
              <div className="activity-cell very-high" data-hour="18-24"></div>
            </div>
            <div className="day-row" data-day="sun">
              <div className="activity-cell minimal" data-hour="0-6"></div>
              <div className="activity-cell low" data-hour="6-12"></div>
              <div className="activity-cell medium" data-hour="12-18"></div>
              <div className="activity-cell high" data-hour="18-24"></div>
            </div>
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
        .activity-heatmap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1rem; width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); }
        .heatmap-container { display: flex; gap: 0; align-items: flex-start; background: rgba(15, 23, 42, 0.3); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(59, 130, 246, 0.2); max-width: 1100px; width: 100%; overflow-x: auto; margin: 0 auto; transform: translateX(24px); }
        .heatmap-labels { display: flex; flex-direction: column; gap: 0; }
        .time-labels { display: flex; justify-content: space-between; width: 320px; margin-bottom: 1rem; margin-left: 80px; padding: 0 10px; min-width: 320px; }
        .time-labels span { font-size: 0.8rem; color: #60a5fa; font-weight: 600; letter-spacing: 1px; text-shadow: 0 0 10px rgba(96, 165, 250, 0.5); }
        .day-labels { display: flex; flex-direction: column; gap: 0; width: 70px; margin-right: 10px; flex: 0 0 70px; }
        .day-labels span { height: 40px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; color: rgba(255, 255, 255, 0.9); letter-spacing: 1px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin-bottom: 2px; border: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 0 8px rgba(96, 165, 250, 0.3); transition: all 0.3s ease; }
        .day-labels span:hover { background: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.4); transform: translateX(3px); }
        .heatmap-grid { display: flex; flex-direction: column; gap: 2px; width: 100%; }
        .day-row { display: flex; gap: 2px; align-items: center; }
        .activity-cell { width: clamp(48px, 8vw, 75px); height: clamp(28px, 4.2vw, 38px); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15); position: relative; transition: all 0.3s ease; cursor: pointer; animation: cell-pulse 4s ease-in-out infinite; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 600; color: rgba(255, 255, 255, 0.8); }
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
          .activity-heatmap { padding: 1rem 0.5rem; }
          .heatmap-container { transform: translateX(0); }
          .time-labels { margin-left: 62px; width: 260px; }
          .day-labels span { height: 34px; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  )
}

