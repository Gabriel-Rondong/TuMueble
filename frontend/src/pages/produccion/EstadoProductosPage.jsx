import { useState } from 'react'
import clsx from 'clsx'

const ORDENES = [
  { id:1, num:'OP-01-00234', cliente:'María González', producto:'Closet 3 Cuerpos Corredera', estado:'en_produccion', etapa:'Enchapado', avance:65, responsable:'Carlos Rojo', fechaEst:'2026-06-12', atrasado:true, prioridad:'urgente' },
  { id:2, num:'OP-01-00235', cliente:'Constructora Andina', producto:'Kit Cocina Integral', estado:'materiales_preparados', etapa:'Dimensionado', avance:20, responsable:'Ana Muñoz', fechaEst:'2026-06-20', atrasado:false, prioridad:'alta' },
  { id:3, num:'OP-01-00236', cliente:'Hotel Andes', producto:'Mesa Comedor 10 personas', estado:'control_calidad', etapa:'Control de Calidad', avance:90, responsable:'Pedro Silva', fechaEst:'2026-06-10', atrasado:false, prioridad:'normal' },
  { id:4, num:'OP-01-00237', cliente:'Familia Soto', producto:'Velador Flotante', estado:'en_terminaciones', etapa:'Barnizado', avance:80, responsable:'Laura Vera', fechaEst:'2026-06-15', atrasado:false, prioridad:'baja' },
  { id:5, num:'OP-01-00238', cliente:'Clínica Santa María', producto:'Archivero 4 Cajones', estado:'listo_despacho', etapa:'Despacho', avance:100, responsable:'Carlos Rojo', fechaEst:'2026-06-09', atrasado:false, prioridad:'alta' },
]

const ESTADO_CONFIG = {
  pedido_recibido: { label:'Pedido recibido', color:'#64748B', bg:'bg-slate-500/15 text-slate-400' },
  materiales_pendientes: { label:'Mat. pendientes', color:'#F59E0B', bg:'bg-amber-500/15 text-amber-400' },
  materiales_preparados: { label:'Mat. preparados', color:'#3B82F6', bg:'bg-blue-500/15 text-blue-400' },
  en_produccion: { label:'En producción', color:'#8B5CF6', bg:'bg-violet-500/15 text-violet-400' },
  en_terminaciones: { label:'En terminaciones', color:'#F97316', bg:'bg-orange-500/15 text-orange-400' },
  control_calidad: { label:'Control calidad', color:'#06B6D4', bg:'bg-cyan-500/15 text-cyan-400' },
  listo_despacho: { label:'Listo despacho', color:'#22C55E', bg:'bg-green-500/15 text-green-400' },
  despachado: { label:'Despachado', color:'#10B981', bg:'bg-emerald-500/15 text-emerald-400' },
}

const PRIORIDAD_COLOR = { urgente:'text-red-400', alta:'text-orange-400', normal:'text-tm-muted', baja:'text-slate-500' }

const TIMELINE = ['Dimensionado','Corte','Enchapado','Mecanizado','Armado','Barnizado','Embalaje','Control calidad','Despacho']

export default function EstadoProductosPage() {
  const [seleccionada, setSeleccionada] = useState(null)
  const [filtro, setFiltro] = useState('')

  const filtradas = ORDENES.filter(o =>
    o.num.toLowerCase().includes(filtro.toLowerCase()) ||
    o.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
    o.producto.toLowerCase().includes(filtro.toLowerCase())
  )

  const orden = ORDENES.find(o => o.id === seleccionada)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Estado de Productos</h1>
          <p className="text-tm-muted text-sm mt-1">Seguimiento en tiempo real de todos los productos en fabricación</p>
        </div>
        <input placeholder="Buscar orden, cliente, producto..."
          className="input-field w-64 text-sm"
          value={filtro} onChange={e => setFiltro(e.target.value)} />
      </div>

      <div className="flex gap-4">
        {/* Tabla */}
        <div className={clsx('card p-0 overflow-hidden transition-all', seleccionada ? 'w-3/5' : 'w-full')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tm-border bg-tm-surface">
                {['Orden','Cliente / Producto','Estado','Etapa','Avance','Responsable','Entrega','Prioridad'].map(h => (
                  <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(o => {
                const cfg = ESTADO_CONFIG[o.estado] || {}
                return (
                  <tr key={o.id}
                    onClick={() => setSeleccionada(seleccionada === o.id ? null : o.id)}
                    className={clsx(
                      'border-b border-tm-border/50 cursor-pointer transition-colors',
                      seleccionada === o.id ? 'bg-tm-gold/5 border-l-2 border-l-tm-gold' : 'hover:bg-tm-card/50'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {o.atrasado && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                        <span className="font-mono text-tm-gold text-xs">{o.num}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-tm-text font-medium text-xs">{o.cliente}</div>
                      <div className="text-tm-muted text-xs">{o.producto}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('badge text-xs', cfg.bg)}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-tm-muted">{o.etapa}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-tm-border rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: o.avance + '%', background: o.avance === 100 ? '#22C55E' : '#C9963A' }} />
                        </div>
                        <span className="text-xs text-tm-muted">{o.avance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-tm-text">{o.responsable}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('text-xs', o.atrasado ? 'text-red-400 font-medium' : 'text-tm-muted')}>
                        {o.atrasado ? '⚠️ ' : ''}{new Date(o.fechaEst).toLocaleDateString('es-CL')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('text-xs font-medium capitalize', PRIORIDAD_COLOR[o.prioridad])}>{o.prioridad}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Panel detalle */}
        {orden && (
          <div className="w-2/5 space-y-4">
            <div className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-tm-gold font-mono text-sm">{orden.num}</div>
                  <div className="text-tm-text font-semibold">{orden.producto}</div>
                  <div className="text-tm-muted text-xs">{orden.cliente}</div>
                </div>
                <button onClick={() => setSeleccionada(null)} className="text-tm-muted hover:text-tm-text text-lg">✕</button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-tm-muted">Responsable</span><span className="text-tm-text">{orden.responsable}</span></div>
                <div className="flex justify-between"><span className="text-tm-muted">Avance</span><span className="text-tm-gold font-medium">{orden.avance}%</span></div>
                <div className="flex justify-between"><span className="text-tm-muted">Entrega estimada</span><span className={orden.atrasado ? 'text-red-400' : 'text-tm-text'}>{orden.fechaEst}</span></div>
              </div>
            </div>

            {/* Línea de tiempo */}
            <div className="card">
              <h3 className="text-xs font-semibold text-tm-text mb-4 uppercase tracking-wider">Línea de tiempo</h3>
              <div className="relative">
                {TIMELINE.map((etapa, i) => {
                  const completada = i < TIMELINE.indexOf(orden.etapa)
                  const actual = etapa === orden.etapa
                  return (
                    <div key={etapa} className="flex items-start gap-3 mb-3 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={clsx(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0',
                          completada ? 'bg-tm-gold border-tm-gold text-tm-dark' :
                          actual ? 'border-tm-gold bg-tm-gold/20 text-tm-gold animate-pulse' :
                          'border-tm-border text-tm-muted'
                        )}>
                          {completada ? '✓' : i + 1}
                        </div>
                        {i < TIMELINE.length - 1 && <div className={clsx('w-0.5 h-5 mt-0.5', completada ? 'bg-tm-gold' : 'bg-tm-border')} />}
                      </div>
                      <div className={clsx('text-xs pt-0.5', actual ? 'text-tm-gold font-medium' : completada ? 'text-tm-text' : 'text-tm-muted')}>
                        {etapa} {actual && <span className="ml-1">← actual</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-gold text-xs py-2">Cambiar estado</button>
              <button className="btn-ghost text-xs py-2 border border-tm-border">Ver trazabilidad</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}