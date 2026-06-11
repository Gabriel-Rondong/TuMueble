import { useState } from 'react'

const CLIENTES = [
  { id:1, nombre:'María González', rut:'12.345.678-9', email:'maria@mail.com', telefono:'+56 9 1234 5678', tipo:'persona_natural', ordenes:3 },
  { id:2, nombre:'Constructora Andina SpA', rut:'77.123.456-7', email:'contacto@andina.cl', telefono:'+56 2 2345 6789', tipo:'empresa', ordenes:8 },
  { id:3, nombre:'Hotel Andes', rut:'76.987.654-3', email:'compras@hotelandes.cl', telefono:'+56 2 9876 5432', tipo:'empresa', ordenes:2 },
  { id:4, nombre:'Familia Soto Pérez', rut:'9.876.543-2', email:'soto@gmail.com', telefono:'+56 9 8765 4321', tipo:'persona_natural', ordenes:1 },
]

export default function ClientesPage() {
  const [buscar, setBuscar] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nombre:'', rut:'', email:'', telefono:'', tipo:'persona_natural' })

  const filtrados = CLIENTES.filter(c =>
    c.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    c.rut.includes(buscar) || c.email.includes(buscar)
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Clientes</h1>
          <p className="text-tm-muted text-sm mt-1">{CLIENTES.length} clientes registrados</p>
        </div>
        <div className="flex gap-3">
          <input placeholder="Buscar por nombre, RUT o email..." className="input-field w-72 text-sm"
            value={buscar} onChange={e => setBuscar(e.target.value)} />
          <button className="btn-gold text-sm" onClick={() => setModal(true)}>+ Nuevo cliente</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-tm-border bg-tm-surface">
              {['Cliente','RUT','Email','Teléfono','Tipo','Órdenes','Acciones'].map(h => (
                <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(c => (
              <tr key={c.id} className="border-b border-tm-border/50 hover:bg-tm-card/50">
                <td className="px-4 py-3 font-medium text-tm-text">{c.nombre}</td>
                <td className="px-4 py-3 text-tm-muted font-mono text-xs">{c.rut}</td>
                <td className="px-4 py-3 text-tm-muted text-xs">{c.email}</td>
                <td className="px-4 py-3 text-tm-muted text-xs">{c.telefono}</td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs ${c.tipo === 'empresa' ? 'bg-blue-500/15 text-blue-400' : 'bg-tm-surface text-tm-muted'}`}>
                    {c.tipo === 'empresa' ? 'Empresa' : 'Persona'}
                  </span>
                </td>
                <td className="px-4 py-3 text-tm-text text-xs text-center">{c.ordenes}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-tm-gold text-xs hover:underline">Editar</button>
                    <button className="text-tm-muted text-xs hover:underline">Ver órdenes</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="card w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-tm-text font-semibold">Nuevo Cliente</h2>
              <button onClick={() => setModal(false)} className="text-tm-muted hover:text-tm-text">✕</button>
            </div>
            <div className="space-y-3">
              {[['nombre','Nombre completo'],['rut','RUT'],['email','Email'],['telefono','Teléfono']].map(([k,l]) => (
                <div key={k}>
                  <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
                  <input className="input-field text-sm" value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} />
                </div>
              ))}
              <div>
                <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Tipo</label>
                <select className="input-field text-sm" value={form.tipo} onChange={e => setForm(f => ({...f,tipo:e.target.value}))}>
                  <option value="persona_natural">Persona Natural</option>
                  <option value="empresa">Empresa</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="btn-gold flex-1 text-sm">Guardar</button>
              <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}