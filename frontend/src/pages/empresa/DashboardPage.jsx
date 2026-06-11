import { useAuth } from '../../contexts/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const kpis = [
  { label: 'Órdenes activas', value: '24', delta: '+3 esta semana', color: '#C9963A', icon: '📋' },
  { label: 'Órdenes atrasadas', value: '3', delta: '2 críticas', color: '#EF4444', icon: '⚠️' },
  { label: 'Ingresos del mes', value: '$18.4M', delta: '+12% vs mes anterior', color: '#22C55E', icon: '💰' },
  { label: 'Utilidad estimada', value: '$4.2M', delta: 'Margen 22.8%', color: '#3B82F6', icon: '📈' },
]
const ventasMes = [
  {mes:'Ene',ventas:12.4,utilidad:2.8},{mes:'Feb',ventas:14.1,utilidad:3.1},
  {mes:'Mar',ventas:11.8,utilidad:2.4},{mes:'Abr',ventas:16.3,utilidad:3.9},
  {mes:'May',ventas:15.7,utilidad:3.5},{mes:'Jun',ventas:18.4,utilidad:4.2},
]
const ordenesEstado = [
  {name:'En producción',value:10,color:'#3B82F6'},{name:'En terminaciones',value:5,color:'#C9963A'},
  {name:'Listo despacho',value:4,color:'#22C55E'},{name:'Control calidad',value:3,color:'#8B5CF6'},
]
const stockCritico = [
  {material:'Bisagras 35mm',stock:12,minimo:50,unidad:'un'},
  {material:'Canto PVC Blanco',stock:8,minimo:20,unidad:'m'},
  {material:'Tornillos 4x40',stock:145,minimo:500,unidad:'un'},
]

export default function DashboardPage() {
  const { usuario } = useAuth()
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Hola, {usuario?.nombre} 👋</h1>
          <p className="text-tm-muted text-sm mt-1">Dashboard gerencial</p>
        </div>
        <button className="btn-gold text-sm">+ Nueva Orden</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{k.icon}</span>
              <span className="text-xs text-tm-muted">Hoy</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-text text-sm font-medium mt-1">{k.label}</div>
            <div className="text-tm-muted text-xs mt-1">{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h3 className="text-sm font-semibold text-tm-text mb-4">Ventas y Utilidad — últimos 6 meses (CLP millones)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ventasMes} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3240" />
              <XAxis dataKey="mes" tick={{ fill: '#7A8099', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7A8099', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#21252F', border: '1px solid #2D3240', borderRadius: 8 }} />
              <Bar dataKey="ventas" fill="#C9963A" radius={[4,4,0,0]} name="Ventas" />
              <Bar dataKey="utilidad" fill="#22C55E" radius={[4,4,0,0]} name="Utilidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-tm-text mb-4">Órdenes por estado</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ordenesEstado} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                {ordenesEstado.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#21252F', border: '1px solid #2D3240', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {ordenesEstado.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                  <span className="text-tm-muted">{e.name}</span>
                </div>
                <span className="text-tm-text font-medium">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-tm-text mb-4">⚠️ Stock Crítico</h3>
          <div className="space-y-3">
            {stockCritico.map(s => (
              <div key={s.material}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-tm-text">{s.material}</span>
                  <span className="text-red-400 font-medium">{s.stock} / {s.minimo} {s.unidad}</span>
                </div>
                <div className="h-1.5 bg-tm-border rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: (Math.min((s.stock/s.minimo)*100,100)) + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-tm-text mb-4">🕐 Órdenes Atrasadas</h3>
          <div className="space-y-2">
            {[
              {num:'OP-01-00234',cliente:'María González',dias:-3,producto:'Closet Corredera'},
              {num:'OP-01-00228',cliente:'Constructora Andina',dias:-1,producto:'Kit Cocina'},
              {num:'OP-01-00219',cliente:'Hotel Andes',dias:-5,producto:'Mesa Comedor'},
            ].map(o => (
              <div key={o.num} className="flex items-center justify-between py-2 border-b border-tm-border/50 last:border-0">
                <div>
                  <div className="text-xs font-mono text-tm-gold">{o.num}</div>
                  <div className="text-xs text-tm-text">{o.cliente} · {o.producto}</div>
                </div>
                <span className="badge bg-red-500/15 text-red-400">{o.dias} días</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}