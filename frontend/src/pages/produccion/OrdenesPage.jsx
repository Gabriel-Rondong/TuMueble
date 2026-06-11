import { useState } from 'react'
import clsx from 'clsx'

const ORDENES_DATA = [
  { id:1, num:'OP-01-00234', cliente:'María González', producto:'Closet 3 Cuerpos Corredera', estado:'en_produccion', avance:65, prioridad:'urgente', fechaEst:'2026-06-12', costoEst:850000, ingresos:1200000, atrasado:true },
  { id:2, num:'OP-01-00235', cliente:'Constructora Andina', producto:'Kit Cocina Integral', estado:'materiales_preparados', avance:20, prioridad:'alta', fechaEst:'2026-06-20', costoEst:2100000, ingresos:3200000, atrasado:false },
  { id:3, num:'OP-01-00236', cliente:'Hotel Andes', producto:'Mesa Comedor 10 personas', estado:'control_calidad', avance:90, prioridad:'normal', fechaEst:'2026-06-10', costoEst:540000, ingresos:890000, atrasado:false },
  { id:4, num:'OP-01-00237', cliente:'Familia Soto', producto:'Velador Flotante x2', estado:'en_terminaciones', avance:80, prioridad:'baja', fechaEst:'2026-06-15', costoEst:180000, ingresos:280000, atrasado:false },
  { id:5, num:'OP-01-00238', cliente:'Clínica Santa María', producto:'Archivero 4 Cajones x5', estado:'listo_despacho', avance:100, prioridad:'alta', fechaEst:'2026-06-09', costoEst:620000, ingresos:950000, atrasado:false },
]

const ESTADO_LABELS = {
  pedido_recibido:'Pedido recibido',materiales_pendientes:'Mat. pendientes',
  materiales_preparados:'Mat. preparados',en_produccion:'En producción',
  en_terminaciones:'En terminaciones',control_calidad:'Control calidad',
  listo_despacho:'Listo despacho',despachado:'Despachado',cerrado:'Cerrado',
}

const fmtCLP = v => '$' + Number(v).toLocaleString('es-CL')

export default function OrdenesPage() {
  const [filtroEstado, setFiltroEstado] = useState('')
  const filtradas = ORDENES_DATA.filter(o => !filtroEstado || o.estado === filtroEstado)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Órdenes de Producción</h1>
          <p className="text-tm-muted text-sm mt-1">{ORDENES_DATA.length} órdenes totales · {ORDENES_DATA.filter(o=>o.atrasado).length} atrasadas</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-field w-48 text-sm" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.entries(ESTADO_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button className="btn-gold text-sm">+ Nueva orden</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-tm-border bg-tm-surface">
              {['#Orden','Cliente','Producto','Estado','Avance','Costo est.','Ingreso','Prioridad','Entrega'].map(h => (
                <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.map(o => {
              const margen = o.ingresos > 0 ? ((o.ingresos - o.costoEst) / o.ingresos * 100).toFixed(1) : 0
              return (
                <tr key={o.id} className="border-b border-tm-border/50 hover:bg-tm-card/50 cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {o.atrasado && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />}
                      <span className="font-mono text-tm-gold text-xs">{o.num}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-tm-text">{o.cliente}</td>
                  <td className="px-4 py-3 text-xs text-tm-muted max-w-32 truncate">{o.producto}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-tm-surface text-tm-muted text-xs">{ESTADO_LABELS[o.estado]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 bg-tm-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: o.avance+'%', background: o.avance===100?'#22C55E':'#C9963A' }} />
                      </div>
                      <span className="text-xs text-tm-muted">{o.avance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-tm-muted font-mono">{fmtCLP(o.costoEst)}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-tm-text font-mono">{fmtCLP(o.ingresos)}</div>
                    <div className="text-xs text-green-400">{margen}% margen</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-xs font-medium capitalize',
                      o.prioridad==='urgente'?'text-red-400':o.prioridad==='alta'?'text-orange-400':'text-tm-muted'
                    )}>{o.prioridad}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-xs', o.atrasado?'text-red-400':'text-tm-muted')}>
                      {o.atrasado?'⚠️ ':''}{new Date(o.fechaEst).toLocaleDateString('es-CL')}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}