import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import { Table, Tr, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'

const PROVEEDORES = [
  { id:1, nombre:'Maderas del Sur SpA', rut:'76.111.222-3', giro:'Comercio de maderas', email:'ventas@maderasdelsur.cl', telefono:'+56 2 2211 3344', activo:true, nc:0 },
  { id:2, nombre:'Herrajes Nacional Ltda', rut:'77.444.555-6', giro:'Distribución herrajes', email:'comercial@herrajesnacional.cl', telefono:'+56 2 3344 5566', activo:true, nc:2 },
  { id:3, nombre:'Melaminas Andinas SA', rut:'76.777.888-9', giro:'Fabricación tableros melamina', email:'pedidos@melaminas.cl', telefono:'+56 2 5566 7788', activo:true, nc:0 },
  { id:4, nombre:'Pinturas y Barnices Chile', rut:'12.333.444-5', giro:'Distribución pinturas', email:'info@pbchile.cl', telefono:'+56 9 6677 8899', activo:false, nc:1 },
]

const CAMPOS = [['nombre','Nombre o razón social'],['rut','RUT'],['giro','Giro'],['email','Email'],['telefono','Teléfono'],['contacto_nombre','Nombre de contacto']]

export default function ProveedoresPage() {
  const [buscar, setBuscar] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({})

  const filtrados = PROVEEDORES.filter(p =>
    p.nombre.toLowerCase().includes(buscar.toLowerCase()) || p.rut.includes(buscar)
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Proveedores</h1>
          <p className="text-tm-muted text-sm mt-1">{PROVEEDORES.filter(p=>p.activo).length} activos · {PROVEEDORES.length} total</p>
        </div>
        <div className="flex gap-3">
          <input placeholder="Buscar proveedor o RUT..." className="input-field w-64 text-sm"
            value={buscar} onChange={e => setBuscar(e.target.value)} />
          <button className="btn-gold text-sm" onClick={() => setModal(true)}>+ Nuevo proveedor</button>
        </div>
      </div>

      <Table headers={['Proveedor','RUT','Giro','Contacto','NC','Estado','Acciones']}>
        {filtrados.map(p => (
          <Tr key={p.id}>
            <Td><div className="font-medium text-tm-text">{p.nombre}</div></Td>
            <Td><span className="font-mono text-tm-muted text-xs">{p.rut}</span></Td>
            <Td><span className="text-tm-muted text-xs">{p.giro}</span></Td>
            <Td>
              <div className="text-xs text-tm-text">{p.email}</div>
              <div className="text-xs text-tm-muted">{p.telefono}</div>
            </Td>
            <Td>
              {p.nc > 0
                ? <Badge variante="red">{p.nc} NC</Badge>
                : <span className="text-tm-muted text-xs">—</span>}
            </Td>
            <Td><Badge variante={p.activo ? 'green' : 'gray'}>{p.activo ? 'Activo' : 'Inactivo'}</Badge></Td>
            <Td>
              <div className="flex gap-2">
                <button className="text-tm-gold text-xs hover:underline">Editar</button>
                <button className="text-tm-muted text-xs hover:underline">Ver NC</button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo Proveedor" size="md">
        <div className="space-y-3">
          {CAMPOS.map(([k,l]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              <input className="input-field text-sm" value={form[k]||''} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Guardar</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModal(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}