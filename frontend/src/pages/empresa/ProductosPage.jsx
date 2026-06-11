import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Table, Tr, Td } from '../../components/ui/Table'
import clsx from 'clsx'

const PRODUCTOS = [
  { id:1, nombre:'Closet 3 Cuerpos Corredera', codigo:'CL-003', cat:'Closets', precio:1200000, costo:680000, tiempo:40, materiales:8, activo:true },
  { id:2, nombre:'Cocina Integral Modular', codigo:'CO-INT', cat:'Cocinas', precio:3500000, costo:1900000, tiempo:80, materiales:14, activo:true },
  { id:3, nombre:'Mesa Comedor Madera Maciza', codigo:'ME-COM', cat:'Mesas', precio:890000, costo:420000, tiempo:24, materiales:5, activo:true },
  { id:4, nombre:'Velador Flotante', codigo:'VE-FLO', cat:'Dormitorio', precio:280000, costo:130000, tiempo:8, materiales:4, activo:true },
  { id:5, nombre:'Archivero 4 Cajones', codigo:'AR-004', cat:'Oficina', precio:480000, costo:240000, tiempo:16, materiales:6, activo:true },
]

const BOM_EJEMPLO = [
  { material:'Melamina Blanca 18mm', cantidad:4, unidad:'pla', costo_unit:28500, merma:5 },
  { material:'Canto PVC Blanco 22mm', cantidad:80, unidad:'m', costo_unit:450, merma:10 },
  { material:'Bisagra Clip 35mm', cantidad:16, unidad:'un', costo_unit:1200, merma:0 },
  { material:'Riel Telescópico 45cm', cantidad:6, unidad:'un', costo_unit:4800, merma:0 },
  { material:'Tornillo Confirmat 6x50', cantidad:120, unidad:'un', costo_unit:85, merma:2 },
]

const ETAPAS_EJEMPLO = ['Dimensionado (4h)','Corte (6h)','Enchapado (8h)','Mecanizado (4h)','Armado (10h)','Barnizado (6h)','Embalaje (2h)']

const fmt = v => '$' + Number(v).toLocaleString('es-CL')
const margen = (p, c) => p > 0 ? Math.round((p-c)/p*100) : 0

export default function ProductosPage() {
  const [buscar, setBuscar] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [modalNuevo, setModalNuevo] = useState(false)
  const [vistaDetalle, setVistaDetalle] = useState('bom')

  const filtrados = PRODUCTOS.filter(p => p.nombre.toLowerCase().includes(buscar.toLowerCase()) || p.codigo.includes(buscar))
  const producto = PRODUCTOS.find(p => p.id === seleccionado)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Productos y BOM</h1>
          <p className="text-tm-muted text-sm mt-1">Fichas técnicas y listas de materiales</p>
        </div>
        <div className="flex gap-3">
          <input placeholder="Buscar producto o código..." className="input-field w-60 text-sm"
            value={buscar} onChange={e => setBuscar(e.target.value)} />
          <button className="btn-gold text-sm" onClick={() => setModalNuevo(true)}>+ Nuevo producto</button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Lista */}
        <div className={clsx('transition-all', seleccionado ? 'w-5/12' : 'w-full')}>
          <Table headers={['Producto','Código','Categoría','Precio venta','Costo est.','Margen','Tiempo','']}>
            {filtrados.map(p => (
              <Tr key={p.id} onClick={() => setSeleccionado(seleccionado === p.id ? null : p.id)}
                className={seleccionado === p.id ? 'bg-tm-gold/5 border-l-2 border-l-tm-gold' : ''}>
                <Td>
                  <div className="font-medium text-tm-text text-sm">{p.nombre}</div>
                  <div className="text-tm-muted text-xs mt-0.5">{p.materiales} materiales en BOM</div>
                </Td>
                <Td><span className="font-mono text-tm-gold text-xs">{p.codigo}</span></Td>
                <Td><Badge variante="gray">{p.cat}</Badge></Td>
                <Td><span className="font-mono text-sm text-tm-text">{fmt(p.precio)}</span></Td>
                <Td><span className="font-mono text-xs text-tm-muted">{fmt(p.costo)}</span></Td>
                <Td>
                  <span className={clsx('font-semibold text-sm', margen(p.precio,p.costo) > 30 ? 'text-green-400' : margen(p.precio,p.costo) > 15 ? 'text-tm-gold' : 'text-red-400')}>
                    {margen(p.precio,p.costo)}%
                  </span>
                </Td>
                <Td><span className="text-tm-muted text-xs">{p.tiempo}h</span></Td>
                <Td><Badge variante={p.activo ? 'green' : 'gray'}>{p.activo ? 'Activo' : 'Inactivo'}</Badge></Td>
              </Tr>
            ))}
          </Table>
        </div>

        {/* Detalle BOM */}
        {producto && (
          <div className="w-7/12 space-y-4">
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-tm-gold font-mono text-xs">{producto.codigo}</div>
                  <div className="text-tm-text font-bold text-base">{producto.nombre}</div>
                  <div className="text-tm-muted text-xs mt-1">{producto.cat} · {producto.tiempo}h estimadas</div>
                </div>
                <button onClick={() => setSeleccionado(null)} className="text-tm-muted hover:text-tm-text">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-tm-surface rounded-lg p-3">
                  <div className="text-tm-gold font-bold">{fmt(producto.precio)}</div>
                  <div className="text-tm-muted text-xs">Precio venta</div>
                </div>
                <div className="bg-tm-surface rounded-lg p-3">
                  <div className="text-tm-text font-bold">{fmt(producto.costo)}</div>
                  <div className="text-tm-muted text-xs">Costo estimado</div>
                </div>
                <div className="bg-tm-surface rounded-lg p-3">
                  <div className="text-green-400 font-bold">{margen(producto.precio,producto.costo)}%</div>
                  <div className="text-tm-muted text-xs">Margen</div>
                </div>
              </div>
            </div>

            {/* Tabs BOM / Etapas */}
            <div className="flex gap-1 border-b border-tm-border">
              {['bom','etapas'].map(v => (
                <button key={v} onClick={() => setVistaDetalle(v)}
                  className={clsx('px-4 py-2 text-sm font-medium border-b-2 transition-colors', {
                    'border-tm-gold text-tm-gold': vistaDetalle === v,
                    'border-transparent text-tm-muted': vistaDetalle !== v
                  })}>
                  {v === 'bom' ? '📋 Lista de materiales' : '🔄 Etapas de producción'}
                </button>
              ))}
            </div>

            {vistaDetalle === 'bom' && (
              <div className="card p-0 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-tm-border bg-tm-surface">
                      {['Material','Cantidad','Unidad','Merma','Costo est.'].map(h => (
                        <th key={h} className="text-left text-xs text-tm-muted font-medium px-3 py-2 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BOM_EJEMPLO.map((b, i) => (
                      <tr key={i} className="border-b border-tm-border/50 hover:bg-tm-card/50">
                        <td className="px-3 py-2 text-tm-text">{b.material}</td>
                        <td className="px-3 py-2 text-tm-text font-medium">{b.cantidad}</td>
                        <td className="px-3 py-2 text-tm-muted">{b.unidad}</td>
                        <td className="px-3 py-2 text-tm-muted">{b.merma}%</td>
                        <td className="px-3 py-2 font-mono text-tm-muted">{fmt(b.cantidad * b.costo_unit)}</td>
                      </tr>
                    ))}
                    <tr className="bg-tm-surface">
                      <td className="px-3 py-2 font-bold text-tm-text" colSpan={4}>Total estimado materiales</td>
                      <td className="px-3 py-2 font-bold text-tm-gold font-mono">
                        {fmt(BOM_EJEMPLO.reduce((s,b) => s + b.cantidad*b.costo_unit, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {vistaDetalle === 'etapas' && (
              <div className="space-y-2">
                {ETAPAS_EJEMPLO.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 bg-tm-surface rounded-lg px-4 py-3">
                    <div className="w-6 h-6 rounded-full bg-tm-gold/20 text-tm-gold text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</div>
                    <span className="text-tm-text text-sm">{e}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-gold text-xs py-2">+ Crear orden de producción</button>
              <button className="btn-ghost text-xs py-2 border border-tm-border">Editar producto</button>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo Producto" size="lg">
        <div className="grid grid-cols-2 gap-3">
          {[['nombre','Nombre del producto'],['codigo','Código interno'],['categoria','Categoría'],
            ['precio_venta_estimado','Precio de venta (CLP)'],['costo_estimado','Costo estimado (CLP)'],
            ['tiempo_estimado_horas','Tiempo estimado (horas)']].map(([k,l]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              <input className="input-field text-sm" />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Descripción</label>
          <textarea className="input-field text-sm resize-none h-20" />
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Guardar producto</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModalNuevo(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}