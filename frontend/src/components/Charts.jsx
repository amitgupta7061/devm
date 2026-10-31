import React from 'react';

// ==============================================================
// Custom Lightweight SVG Charts & Data Visualizations
// Zero external dependencies, GPU-accelerated CSS, high aesthetic
// ==============================================================

/**
 * Donut Chart with center metric and category legend
 */
export function DonutChart({ data = [], totalLabel = "Total", size = 180, strokeWidth = 24 }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Slices */}
          {total > 0 && data.map((item, index) => {
            const percent = (item.value / total) * 100;
            const strokeDashoffset = circumference - (circumference * percent) / 100;
            const rotation = (accumulatedPercent * 3.6);
            accumulatedPercent += percent;

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transformOrigin: '50% 50%',
                  transform: `rotate(${rotation}deg)`,
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-800 tracking-tight leading-none">
            {total}
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {totalLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 flex-1 w-full">
        {data.map((item, index) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{item.value}</span>
                <span className="text-[11px] text-slate-400 font-mono">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Horizontal Progress Bar Group
 */
export function ProgressBarGroup({ items = [] }) {
  const max = Math.max(...items.map(i => i.value), 1);

  return (
    <div className="space-y-3.5">
      {items.map((item, idx) => {
        const percent = Math.round((item.value / max) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <span className="font-bold text-slate-900">{item.value} tickets</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${percent}%`,
                  background: item.gradient || item.color || '#3b82f6'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Smooth SVG Area Sparkline Chart (Simulating 7-Day Velocity)
 */
export function VelocityAreaChart({ data = [12, 18, 14, 25, 22, 30, 28], labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], height = 120 }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const width = 500;
  const padding = 20;

  const points = data.map((val, idx) => {
    const x = padding + (idx * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((val - min) / (max - min || 1)) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ');
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Fill Area */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Line Stroke */}
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Dots */}
        {data.map((val, idx) => {
          const [cx, cy] = points[idx].split(',');
          return (
            <g key={idx} className="group">
              <circle
                cx={cx}
                cy={cy}
                r="4"
                className="fill-white stroke-blue-600 stroke-2 hover:r-6 transition-all cursor-pointer"
              />
            </g>
          );
        })}
      </svg>

      {/* X-axis Labels */}
      <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-2 mt-1">
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Radial Performance Gauge
 */
export function RadialGauge({ value = 94, label = "SLA Compliance", color = "#10b981", size = 110 }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * value) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black text-slate-800">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-bold text-slate-600 mt-2 text-center">{label}</span>
    </div>
  );
}

