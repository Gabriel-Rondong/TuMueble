import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Table, Tr, Td } from '../../components/ui/Table'
import clsx from 'clsx'

const TABS = ['Stock actual', 'Lotes', 'Entradas', 'Salidas', 'Ubicaciones']

const STOCK = [
  { id:1, nombre:'Melamina Blanca 18mm', sku:'MEL-BL-18', cat:'Tableros', stock:45.5, min:20, reservado:12, unidad:'pla', costo:28500, ubicacion:'Bodega A-01' },
  { id:2, nombre:'Canto PVC Blanco 22mm', sku:'CAN-PVC-22', cat:'Cantos', stock:8, min:20, reservado:5, unidad:'m', costo:450, ubicacion:'Bodega B-03' },
  { id:3, nombre:'Bisagra Clip 35mm', sku:'BIS-35', cat:'Herrajes', stock:12, min:50, reservado:0, unidad:'un', costo:1200, ubicacion:'Bodega B-01' },
  { id:4, nombre:'Riel Telescópico 45cm', sku:'RIE-45', cat:'Herrajes', stock:34, min:20, reservado:8, unidad:'un', costo:4800, ubicacion:'Bodega B-02' },
  { id:5, nombre:'Tornillo Confirmat 6x50', sku:'TOR-CON-50', cat:'Fijaciones', stock:1200, min:500, reservado:200, unidad:'un', costo:85, ubicacion:'Bodega C-01' },
  { id:6, nombre:'MDF 9mm', sku:'MDF-09', cat:'Tableros', stock:22, min:15, reservado:6, unidad:'pla', costo:18900, ubicacion:'Bodega A-02' },
]

const LOTES = [
  { id:1, material:'Melamina Blanca 18mm', lote:'LOT-2026-001', proveedor:'Melaminas Andinas SA', ingreso:'2026-05-15', inicial:60, disponible:45.5, costo:28500 },
  { id:2, material:'Canto PVC Blanco 22mm', lote:'LOT-2026-002', proveedor:'Maderas del Sur SpA', ingreso:'2026-05-20', inicial:50, disponible:8, costo:450 },
  { id:3, material:'Bisagra Clip 35mm', lote:'LOT-2026-003', proveedor:'Herrajes Nacional Ltda', ingreso:'2026-06-01', inicial:100, disponible:12, costo:1200 },
]

const MOVIMIENTOS = [
  { id:1, tipo:'entrada', material:'Melamina Blanca 18mm', cantidad:20, usuario:'Ana Bodega', fecha:'2026-06-08 09:15', doc:'FAC-001' },
  { id:2, tipo:'salida', material:'Bisagra Clip 35mm', cantidad:5, usuario:'Carlos Prod', fecha:'2026-06-08 10:30', doc:'OP-01-00234' },
  { id:3, tipo:'reserva', material:'Canto PVC Blanco 22mm', cantidad:3, usuario:'Sistema', fecha:'2026-06-07 14:00', doc:'OP-01-00235' },
  { id:4, tipo:'consumo', material:'Tornillo Confirmat 6x50', cantidad:80, usuario:'Pedro Operario', fecha:'2026-06-07 16:45', doc:'OP-01-00231' },
]

const TIPO_COLOR = { entrada:'green', salida:'orange', reserva:'blue', consumo:'purple', ajuste_positivo:'cyan', ajuste_negativo:'red' }
const fmt = v => '$' + Number(v).toLocaleString('es-CL')

export default function BodegaPage() {
  const [tab, setTab] = useState(0)
  const [buscar, setBuscar] = useState('')
  const [modalEntrada, setModalEntrada] = useState(false)

  const criticos = STOCK.filter(s => s.stock <= s.min)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Bodega e Inventario</h1>
          <p className="text-tm-muted text-sm mt-1">
            {STOCK.length} materiales · <span className="text-red-400">{criticos.length} con stock crítico</span>
          </p>
        </div>
        <div className="flex gap-3">
          <input placeholder="Buscar..." className="input-field w-52 text-sm"
            value={buscar} onChange={e => setBuscar(e.target.value)} />
          <button className="btn-gold text-sm" onClick={() => setModalEntrada(true)}>+ Registrar entrada</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Materiales', value:STOCK.length, color:'#C9963A', icon:'📦' },
          { label:'Stock crítico', value:criticos.length, color:'#EF4444', icon:'⚠️' },
          { label:'Lotes activos', value:LOTES.length, color:'#3B82F6', icon:'🏷️' },
          { label:'Valor stock (est.)', value:'$4.2M', color:'#22C55E', icon:'💰' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="flex justify-between mb-2"><span>{k.icon}</span></div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-text text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-tm-border">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={clsx('px-4 py-2 text-sm font-medium border-b-2 transition-colors', {
              'border-tm-gold text-tm-gold': tab === i,
              'border-transparent text-tm-muted hover:text-tm-text': tab !== i
            })}>
            {t}
          </button>
        ))}
      </div>

      {/* Stock actual */}
      {tab === 0 && (
        <Table headers={['Material','SKU','Categoría','Disponible','Reservado','Mínimo','Costo unit.','Ubicación','Estado']}>
          {STOCK.filter(s => s.nombre.toLowerCase().includes(buscar.toLowerCase())).map(s => {
            const alerta = s.stock <= s.min
            const disponible = s.stock - s.reservado
            return (
              <Tr key={s.id}>
                <Td><div className="font-medium text-tm-text text-sm">{s.nombre}</div></Td>
                <Td><span className="font-mono text-tm-gold text-xs">{s.sku}</span></Td>
                <Td><span className="text-tm-muted text-xs">{s.cat}</span></Td>
                <Td>
                  <div className={clsx('font-semibold text-sm', alerta ? 'text-red-400' : 'text-tm-text')}>
                    {disponible} {s.unidad}
                  </div>
                  <div className="h-1 w-16 bg-tm-border rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: Math.min((s.stock/s.min)*100,100)+'%',
                      background: alerta ? '#EF4444' : '#22C55E'
                    }} />
                  </div>
                </Td>
                <Td><span className="text-tm-muted text-xs">{s.reservado} {s.unidad}</span></Td>
                <Td><span className="text-tm-muted text-xs">{s.min} {s.unidad}</span></Td>
                <Td><span className="font-mono text-xs text-tm-muted">{fmt(s.costo)}</span></Td>
                <Td><span className="text-xs text-tm-muted">{s.ubicacion}</span></Td>
                <Td><Badge variante={alerta ? 'red' : 'green'}>{alerta ? 'Crítico' : 'Normal'}</Badge></Td>
              </Tr>
            )
          })}
        </Table>
      )}

      {/* Lotes */}
      {tab === 1 && (
        <Table headers={['N° Lote','Material','Proveedor','Ingreso','Inicial','Disponible','Costo unit.']}>
          {LOTES.map(l => (
            <Tr key={l.id}>
              <Td><span className="font-mono text-tm-gold text-xs">{l.lote}</span></Td>
              <Td><span className="text-tm-text text-sm">{l.material}</span></Td>
              <Td><span className="text-tm-muted text-xs">{l.proveedor}</span></Td>
              <Td><span className="text-tm-muted text-xs">{l.ingreso}</span></Td>
              <Td><span className="text-tm-text text-xs">{l.inicial}</span></Td>
              <Td><span className="text-tm-text font-semibold text-xs">{l.disponible}</span></Td>
              <Td><span className="font-mono text-xs text-tm-muted">{fmt(l.costo)}</span></Td>
            </Tr>
          ))}
        </Table>
      )}

      {/* Entradas / Salidas */}
      {(tab === 2 || tab === 3) && (
        <Table headers={['Tipo','Material','Cantidad','Usuario','Documento','Fecha']}>
          {MOVIMIENTOS.filter(m => tab === 2 ? m.tipo === 'entrada' : m.tipo !== 'entrada').map(m => (
            <Tr key={m.id}>
              <Td><Badge variante={TIPO_COLOR[m.tipo] || 'gray'}>{m.tipo}</Badge></Td>
              <Td><span className="text-tm-text text-sm">{m.material}</span></Td>
              <Td><span className="text-tm-text text-sm font-medium">{m.cantidad}</span></Td>
              <Td><span className="text-tm-muted text-xs">{m.usuario}</span></Td>
              <Td><span className="font-mono text-tm-gold text-xs">{m.doc}</span></Td>
              <Td><span className="text-tm-muted text-xs">{m.fecha}</span></Td>
            </Tr>
          ))}
        </Table>
      )}

      {/* Ubicaciones */}
      {tab === 4 && (
        <div className="grid grid-cols-3 gap-4">
          {['Bodega A-01','Bodega A-02','Bodega B-01','Bodega B-02','Bodega B-03','Bodega C-01'].map(u => (
            <div key={u} className="card flex items-center gap-3">
              <div className="text-2xl">📍</div>
              <div>
                <div className="text-tm-text font-medium">{u}</div>
                <div className="text-tm-muted text-xs">Zona activa</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Entrada */}
      <Modal open={modalEntrada} onClose={() => setModalEntrada(false)} title="Registrar Entrada de Material" size="md">
        <div className="space-y-3">
          {[
            ['material','Material'],['lote','N° Lote'],['proveedor','Proveedor'],
            ['cantidad','Cantidad'],['costo_unitario','Costo unitario (CLP)'],['ubicacion','Ubicación'],
          ].map(([k,l]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              <input className="input-field text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Factura de compra</label>
            <input className="input-field text-sm" placeholder="N° factura del proveedor" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Registrar entrada</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModalEntrada(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}