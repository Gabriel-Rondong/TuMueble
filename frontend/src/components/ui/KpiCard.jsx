export default function KpiCard({ label, value, delta, color = '#C9963A', icon, trend }) {
  const trendColor = trend === 'up' ? '#22C55E' : trend === 'down' ? '#EF4444' : '#7A8099'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{icon}</span>
        {trend && <span style={{ color: trendColor }} className="text-xs font-semibold">{trendIcon}</span>}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color }}>{value}</div>
      <div className="text-tm-text text-sm font-medium">{label}</div>
      {delta && <div className="text-tm-muted text-xs mt-1">{delta}</div>}
    </div>
  )
}