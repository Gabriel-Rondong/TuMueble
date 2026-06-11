export default function StatsBar({ stats }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map(s => (
        <div key={s.label} className="card py-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl">{s.icon}</span>
            {s.trend && (
              <span className={`text-xs font-semibold ${s.trend > 0 ? "text-green-400" : "text-red-400"}`}>
                {s.trend > 0 ? "↑" : "↓"} {Math.abs(s.trend)}%
              </span>
            )}
          </div>
          <div className="text-2xl font-bold" style={{ color: s.color || "#C9963A" }}>{s.value}</div>
          <div className="text-tm-text text-sm font-medium mt-0.5">{s.label}</div>
          {s.sub && <div className="text-tm-muted text-xs mt-0.5">{s.sub}</div>}
        </div>
      ))}
    </div>
  )
}