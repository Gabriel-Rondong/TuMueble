import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import Badge from '../../components/ui/Badge'

const REPORTES = [
  { id:'productos-vendidos', nombre:'Productos más vendidos', icon:'🏆', cat:'Ventas' },
  { id:'rentabilidad', nombre:'Rentabilidad por producto', icon:'💰', cat:'Finanzas' },
  { id:'perdida', nombre:'Productos con pérdida', icon:'📉', cat:'Finanzas' },
  { id:'stock', nombre:'Stock actual', icon:'📦', cat:'Bodega' },
  { id:'stock-critico', nombre:'Stock crítico', icon:'⚠️', cat:'Bodega' },
  { id:'movimientos', nombre:'Movimientos de bodega', icon:'🔄', cat:'Bodega' },
  { id:'trazabilidad-orden', nombre:'Trazabilidad por orden', icon:'🔍', cat:'Producción' },
  { id:'trazabilidad-lote', nombre:'Trazabilidad por lote', icon:'🏷️', cat:'Producción' },
  { id:'ordenes-atrasadas', nombre:'Órdenes atrasadas', icon:'⏰', cat:'Producción' },
  { id:'no-conformidades', nombre:'No conformidades', icon:'🚨', cat:'Calidad' },
  { id:'merma', nombre:'Merma por etapa', icon:'♻️', cat:'Calidad' },
  { id:'proveedores', nombre:'Evaluación proveedores', icon:'🚚', cat:'Compras' },
  { id:'facturas-compra', nombre:'Facturas de compra', icon:'🧾', cat:'Finanzas' },
  { id:'facturas-venta', nombre:'Facturas de venta', icon:'📄', cat:'Finanzas' },
  { id:'auditoria', nombre:'Auditoría de cambios', icon:'🔐', cat:'Sistema' },
]

const RENTABILIDAD = [
  { producto:'Closet Corredera', ingresos:12, costos:7.2, margen:40 },
  { producto:'Cocina Integral', ingresos:28, costos:18.5, margen:33.9 },
  { producto:'Mesa Comedor', ingresos:8.9, costos:4.2, margen:52.8 },
  { producto:'Velador Flotante', ingresos:2.8, costos:1.9, margen:32.1 },
  { producto:'Archivero', ingresos:4.8, costos:3.1, margen:35.4 },
]

const CATS = ['Todos','Ventas','Finanzas','Bodega','Producción','Calidad','Compras','Sistema']

export default function ReportesPage() {
  const [catFiltro, setCatFiltro] = useState('Todos')
  const [seleccionado, setSeleccionado] = useState(null)
  const [fechaInicio, setFechaInicio] = useState('2026-01-01')
  const [fechaFin, setFechaFin] = useState('2026-06-30')

  const filtrados = REPORTES.filter(r => catFiltro === 'Todos' || r.cat === catFiltro)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Centro de Reportes</h1>
          <p className="text-tm-muted text-sm mt-1">{REPORTES.length} reportes disponibles · Exportación PDF y Excel</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
              className="input-field text-xs w-36" />
            <span className="text-tm-muted text-xs">→</span>
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)}
              className="input-field text-xs w-36" />
          </div>
        </div>
      </div>

      {/* Filtros categoría */}
      <div className="flex gap-2 flex-wrap">
        {CATS.map(c => (
          <button key={c} onClick={() => setCatFiltro(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catFiltro === c ? 'bg-tm-gold text-tm-dark' : 'bg-tm-surface text-tm-muted hover:text-tm-text border border-tm-border'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {filtrados.map(r => (
          <div key={r.id}
            onClick={() => setSeleccionado(seleccionado === r.id ? null : r.id)}
            className={`card cursor-pointer transition-all hover:border-tm-gold/40 ${seleccionado === r.id ? 'border-tm-gold/60 bg-tm-gold/5' : ''}`}>
            <div className="text-2xl mb-2">{r.icon}</div>
            <div className="text-tm-text font-medium text-sm mb-1">{r.nombre}</div>
            <Badge variante="gray">{r.cat}</Badge>
          </div>
        ))}
      </div>

      {seleccionado && (
        <div className="card">
          {seleccionado === 'rentabilidad' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-tm-text">Rentabilidad por Producto (CLP millones)</h3>
                <div className="flex gap-2">
                  <button className="btn-ghost text-xs border border-tm-border py-1.5">📄 Exportar PDF</button>
                  <button className="btn-gold text-xs py-1.5">📊 Exportar Excel</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={RENTABILIDAD} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3240" />
                  <XAxis dataKey="producto" tick={{ fill: '#7A8099', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#7A8099', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#21252F', border: '1px solid #2D3240', borderRadius: 8 }} />
                  <Bar dataKey="ingresos" fill="#C9963A" radius={[4,4,0,0]} name="Ingresos" />
                  <Bar dataKey="costos" fill="#3B82F6" radius={[4,4,0,0]} name="Costos" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 overflow-hidden rounded-lg border border-tm-border">
                <table className="w-full text-sm">
                  <thead className="bg-tm-surface">
                    <tr>{['Producto','Ingresos','Costos','Utilidad','Margen'].map(h => (
                      <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-2.5 uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {RENTABILIDAD.map(r => (
                      <tr key={r.producto} className="border-t border-tm-border/50">
                        <td className="px-4 py-2.5 text-tm-text">{r.producto}</td>
                        <td className="px-4 py-2.5 font-mono text-tm-text">${r.ingresos}M</td>
                        <td className="px-4 py-2.5 font-mono text-tm-muted">${r.costos}M</td>
                        <td className="px-4 py-2.5 font-mono text-green-400">${(r.ingresos - r.costos).toFixed(1)}M</td>
                        <td className="px-4 py-2.5 font-semibold text-tm-gold">{r.margen}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {seleccionado !== 'rentabilidad' && (
            <div className="text-center py-12 text-tm-muted">
              <div className="text-4xl mb-3">{REPORTES.find(r=>r.id===seleccionado)?.icon}</div>
              <div className="font-medium text-tm-text mb-1">{REPORTES.find(r=>r.id===seleccionado)?.nombre}</div>
              <p className="text-sm">Reporte disponible — conectar con API para cargar datos reales.</p>
              <div className="flex justify-center gap-3 mt-4">
                <button className="btn-ghost text-xs border border-tm-border py-2 px-4">📄 Exportar PDF</button>
                <button className="btn-gold text-xs py-2 px-4">📊 Exportar Excel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}