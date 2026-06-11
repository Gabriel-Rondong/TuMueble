import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Table, Tr, Td } from '../../components/ui/Table'
import clsx from 'clsx'

const TIPO_TABS = ['Todos','Facturas venta','Facturas compra','Cotizaciones','Guías despacho']
const TIPO_BADGE = {
  factura_venta: 'green', factura_compra: 'orange',
  cotizacion: 'blue', guia_despacho: 'gray', boleta: 'cyan'
}
const TIPO_LABEL = {
  factura_venta:'Factura Venta', factura_compra:'Factura Compra',
  cotizacion:'Cotización', guia_despacho:'Guía Despacho', boleta:'Boleta'
}

const DOCS = [
  { id:1, tipo:'factura_venta', numero:'FV-2026-001', contraparte:'María González', orden:'OP-01-00234', neto:1008403, iva:191597, total:1200000, estado_pago:'pagado', fecha:'2026-06-08' },
  { id:2, tipo:'factura_compra', numero:'FC-2026-045', contraparte:'Melaminas Andinas SA', orden:null, neto:671429, iva:127571, total:799000, estado_pago:'pendiente', fecha:'2026-06-05' },
  { id:3, tipo:'cotizacion', numero:'COT-2026-012', contraparte:'Constructora Andina SpA', orden:'OP-01-00235', neto:2941177, iva:558823, total:3500000, estado_pago:'pendiente', fecha:'2026-06-03' },
  { id:4, tipo:'guia_despacho', numero:'GD-2026-007', contraparte:'Hotel Andes', orden:'OP-01-00236', neto:747899, iva:142101, total:890000, estado_pago:'parcial', fecha:'2026-06-01' },
  { id:5, tipo:'factura_compra', numero:'FC-2026-041', contraparte:'Herrajes Nacional Ltda', orden:null, neto:252101, iva:47899, total:300000, estado_pago:'pagado', fecha:'2026-05-28' },
]

const PAGO_V = { pendiente:'orange', parcial:'blue', pagado:'green', vencido:'red', anulado:'gray' }
const fmt = v => '$' + Number(v).toLocaleString('es-CL')

export default function DocumentosPage() {
  const [tabTipo, setTabTipo] = useState(0)
  const [buscar, setBuscar] = useState('')
  const [modal, setModal] = useState(false)
  const [detalle, setDetalle] = useState(null)

  const FILTROS_TIPO = ['todos','factura_venta','factura_compra','cotizacion','guia_despacho']
  const filtrados = DOCS.filter(d => {
    if (tabTipo > 0 && d.tipo !== FILTROS_TIPO[tabTipo]) return false
    return d.numero.toLowerCase().includes(buscar.toLowerCase()) || d.contraparte.toLowerCase().includes(buscar.toLowerCase())
  })

  const doc = DOCS.find(d => d.id === detalle)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Documentos y Facturas</h1>
          <p className="text-tm-muted text-sm mt-1">{DOCS.length} documentos registrados</p>
        </div>
        <div className="flex gap-3">
          <input placeholder="Buscar número o contraparte..." className="input-field w-64 text-sm"
            value={buscar} onChange={e => setBuscar(e.target.value)} />
          <button className="btn-gold text-sm" onClick={() => setModal(true)}>+ Nuevo documento</button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Facturas venta', value:DOCS.filter(d=>d.tipo==='factura_venta').length, color:'#22C55E', icon:'📄' },
          { label:'Facturas compra', value:DOCS.filter(d=>d.tipo==='factura_compra').length, color:'#F97316', icon:'🧾' },
          { label:'Pagos pendientes', value:DOCS.filter(d=>d.estado_pago==='pendiente').length, color:'#F59E0B', icon:'⏳' },
          { label:'Total facturado', value:'$6.69M', color:'#C9963A', icon:'💵' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="text-xl mb-2">{k.icon}</div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-text text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tipo tabs */}
      <div className="flex gap-1 border-b border-tm-border">
        {TIPO_TABS.map((t, i) => (
          <button key={t} onClick={() => setTabTipo(i)}
            className={clsx('px-4 py-2 text-sm font-medium border-b-2 transition-colors', {
              'border-tm-gold text-tm-gold': tabTipo === i,
              'border-transparent text-tm-muted hover:text-tm-text': tabTipo !== i
            })}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className={clsx('transition-all', detalle ? 'w-3/5' : 'w-full')}>
          <Table headers={['Tipo','Número','Contraparte','Orden','Neto','IVA','Total','Estado','Fecha']}>
            {filtrados.map(d => (
              <Tr key={d.id} onClick={() => setDetalle(detalle === d.id ? null : d.id)}
                className={detalle === d.id ? 'bg-tm-gold/5 border-l-2 border-l-tm-gold' : ''}>
                <Td><Badge variante={TIPO_BADGE[d.tipo] || 'gray'}>{TIPO_LABEL[d.tipo]}</Badge></Td>
                <Td><span className="font-mono text-tm-gold text-xs">{d.numero}</span></Td>
                <Td><span className="text-tm-text text-sm">{d.contraparte}</span></Td>
                <Td><span className="font-mono text-xs text-tm-muted">{d.orden || '—'}</span></Td>
                <Td><span className="font-mono text-xs text-tm-muted">{fmt(d.neto)}</span></Td>
                <Td><span className="font-mono text-xs text-tm-muted">{fmt(d.iva)}</span></Td>
                <Td><span className="font-mono text-sm font-semibold text-tm-text">{fmt(d.total)}</span></Td>
                <Td><Badge variante={PAGO_V[d.estado_pago]}>{d.estado_pago}</Badge></Td>
                <Td><span className="text-tm-muted text-xs">{d.fecha}</span></Td>
              </Tr>
            ))}
          </Table>
        </div>

        {doc && (
          <div className="w-2/5">
            <div className="card space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variante={TIPO_BADGE[doc.tipo]}>{TIPO_LABEL[doc.tipo]}</Badge>
                  <div className="text-tm-gold font-mono font-bold text-lg mt-1">{doc.numero}</div>
                  <div className="text-tm-text">{doc.contraparte}</div>
                </div>
                <button onClick={() => setDetalle(null)} className="text-tm-muted hover:text-tm-text">✕</button>
              </div>
              <div className="border border-tm-border rounded-lg overflow-hidden text-sm">
                {[['Fecha',doc.fecha],['Monto neto',fmt(doc.neto)],['IVA (19%)',fmt(doc.iva)],['Total',fmt(doc.total)],
                  ['Estado pago',doc.estado_pago],['Orden asociada',doc.orden||'—']].map(([k,v]) => (
                  <div key={k} className="flex justify-between px-4 py-2.5 border-b border-tm-border/50 last:border-0">
                    <span className="text-tm-muted">{k}</span>
                    <span className="text-tm-text font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-gold text-xs py-2">Ver PDF</button>
                <button className="btn-ghost text-xs py-2 border border-tm-border">Adjuntar PDF</button>
                {doc.estado_pago !== 'pagado' && (
                  <button className="bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg text-xs py-2 col-span-2">
                    Registrar pago
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo Documento" size="lg">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Tipo de documento</label>
            <select className="input-field text-sm">
              {Object.entries(TIPO_LABEL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {[['numero_documento','N° Documento'],['fecha_emision','Fecha de emisión'],
            ['monto_neto','Monto neto (CLP)'],['observacion','Observaciones']].map(([k,l]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              <input className="input-field text-sm" type={k.includes('fecha') ? 'date' : 'text'} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Guardar documento</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModal(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}