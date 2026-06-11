import { useState, useCallback } from "react"
import Modal from "../../components/ui/Modal"
import Badge from "../../components/ui/Badge"
import SearchBar from "../../components/ui/SearchBar"
import Pagination from "../../components/ui/Pagination"
import ConfirmDialog from "../../components/ui/ConfirmDialog"
import { Table, Tr, Td } from "../../components/ui/Table"
import { useToast } from "../../components/ui/Toast"
import StatsBar from "../../components/ui/StatsBar"

const CLIENTES_DEMO = [
  { id:1, nombre:"María González", rut:"12.345.678-9", email:"maria@mail.com", telefono:"+56 9 1234 5678", tipo_cliente:"persona_natural", activo:true, ordenes:3, ultima_orden:"2026-05-20" },
  { id:2, nombre:"Constructora Andina SpA", rut:"77.123.456-7", email:"contacto@andina.cl", telefono:"+56 2 2345 6789", tipo_cliente:"empresa", activo:true, ordenes:8, ultima_orden:"2026-06-03" },
  { id:3, nombre:"Hotel Andes", rut:"76.987.654-3", email:"compras@hotelandes.cl", telefono:"+56 2 9876 5432", tipo_cliente:"empresa", activo:true, ordenes:2, ultima_orden:"2026-05-10" },
  { id:4, nombre:"Familia Soto Pérez", rut:"9.876.543-2", email:"soto@gmail.com", telefono:"+56 9 8765 4321", tipo_cliente:"persona_natural", activo:true, ordenes:1, ultima_orden:"2026-06-08" },
  { id:5, nombre:"Clínica Santa María", rut:"71.234.567-8", email:"adquisiciones@clinica.cl", telefono:"+56 2 3344 5566", tipo_cliente:"empresa", activo:true, ordenes:5, ultima_orden:"2026-04-22" },
  { id:6, nombre:"Jorge Mena Contreras", rut:"14.567.890-1", email:"jmena@outlook.com", telefono:"+56 9 7654 3210", tipo_cliente:"persona_natural", activo:false, ordenes:0, ultima_orden:null },
]

const FORM_INIT = { nombre:"", rut:"", email:"", telefono:"", direccion:"", comuna:"", ciudad:"", tipo_cliente:"persona_natural", observaciones:"" }

export default function ClientesPage() {
  const toast = useToast()
  const [clientes, setClientes] = useState(CLIENTES_DEMO)
  const [buscar, setBuscar] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("")
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_INIT)
  const [confirmElim, setConfirmElim] = useState(null)
  const [page, setPage] = useState(1)
  const POR_PAGINA = 8
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSearch = useCallback(v => { setBuscar(v); setPage(1) }, [])

  const filtrados = clientes.filter(c => {
    if (filtroTipo && c.tipo_cliente !== filtroTipo) return false
    if (buscar) {
      const q = buscar.toLowerCase()
      return c.nombre.toLowerCase().includes(q) || c.rut.includes(q) || c.email.toLowerCase().includes(q)
    }
    return true
  })

  const paginados = filtrados.slice((page - 1) * POR_PAGINA, page * POR_PAGINA)
  const totalPages = Math.ceil(filtrados.length / POR_PAGINA)

  const abrirNuevo = () => { setForm(FORM_INIT); setEditando(null); setModal(true) }
  const abrirEditar = (c) => {
    setForm({ nombre:c.nombre, rut:c.rut, email:c.email, telefono:c.telefono,
               direccion:"", comuna:"", ciudad:"", tipo_cliente:c.tipo_cliente, observaciones:"" })
    setEditando(c)
    setModal(true)
  }

  const guardar = () => {
    if (!form.nombre.trim()) { toast.error("El nombre es obligatorio"); return }
    if (editando) {
      setClientes(cs => cs.map(c => c.id === editando.id ? { ...c, ...form } : c))
      toast.success("Cliente actualizado correctamente")
    } else {
      const nuevo = { ...form, id: Date.now(), activo:true, ordenes:0, ultima_orden:null }
      setClientes(cs => [nuevo, ...cs])
      toast.success("Cliente creado correctamente")
    }
    setModal(false)
  }

  const eliminar = (c) => {
    setClientes(cs => cs.filter(x => x.id !== c.id))
    toast.success(`${c.nombre} eliminado`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Clientes</h1>
          <p className="text-tm-muted text-sm mt-1">
            {clientes.filter(c => c.activo).length} activos · {clientes.length} total
          </p>
        </div>
        <button className="btn-gold text-sm" onClick={abrirNuevo}>+ Nuevo cliente</button>
      </div>

      <StatsBar stats={[
        { label:"Total clientes", value:clientes.length, icon:"🤝", color:"#C9963A" },
        { label:"Empresas", value:clientes.filter(c => c.tipo_cliente === "empresa").length, icon:"🏢", color:"#3B82F6" },
        { label:"Personas naturales", value:clientes.filter(c => c.tipo_cliente === "persona_natural").length, icon:"👤", color:"#8B5CF6" },
        { label:"Sin órdenes activas", value:clientes.filter(c => c.ordenes === 0).length, icon:"💤", color:"#64748B" },
      ]} />

      <div className="flex items-center gap-3">
        <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre, RUT o email..." className="flex-1 max-w-sm" />
        <select className="input-field w-44 text-sm" value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value); setPage(1) }}>
          <option value="">Todos los tipos</option>
          <option value="persona_natural">Persona natural</option>
          <option value="empresa">Empresa</option>
        </select>
        <span className="text-tm-muted text-xs ml-auto">{filtrados.length} resultados</span>
      </div>

      <Table headers={["Cliente","RUT","Contacto","Tipo","Órdenes","Última orden","Estado","Acciones"]}>
        {paginados.map(c => (
          <Tr key={c.id}>
            <Td>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-tm-gold/15 flex items-center justify-center text-tm-gold text-xs font-bold flex-shrink-0">
                  {c.nombre.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
                <span className="text-tm-text font-medium text-sm">{c.nombre}</span>
              </div>
            </Td>
            <Td><span className="font-mono text-tm-muted text-xs">{c.rut}</span></Td>
            <Td>
              <div className="text-xs text-tm-text">{c.email}</div>
              <div className="text-xs text-tm-muted">{c.telefono}</div>
            </Td>
            <Td>
              <Badge variante={c.tipo_cliente === "empresa" ? "blue" : "gray"}>
                {c.tipo_cliente === "empresa" ? "Empresa" : "Persona"}
              </Badge>
            </Td>
            <Td>
              <div className="flex items-center gap-1">
                <span className="text-tm-text font-semibold text-sm">{c.ordenes}</span>
                <span className="text-tm-muted text-xs">órd.</span>
              </div>
            </Td>
            <Td><span className="text-tm-muted text-xs">{c.ultima_orden || "Sin órdenes"}</span></Td>
            <Td><Badge variante={c.activo ? "green" : "gray"}>{c.activo ? "Activo" : "Inactivo"}</Badge></Td>
            <Td>
              <div className="flex gap-2">
                <button onClick={() => abrirEditar(c)} className="text-tm-gold text-xs hover:underline">Editar</button>
                <button onClick={() => setConfirmElim(c)} className="text-red-400 text-xs hover:underline">Eliminar</button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {filtrados.length === 0 && (
        <div className="text-center py-12 text-tm-muted">
          <div className="text-4xl mb-3">🔍</div>
          <div>No se encontraron clientes con los filtros aplicados.</div>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Modal crear / editar */}
      <Modal open={modal} onClose={() => setModal(false)} title={editando ? "Editar Cliente" : "Nuevo Cliente"} size="md">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Nombre completo / Razón social *</label>
              <input className="input-field text-sm" value={form.nombre} onChange={e => set("nombre", e.target.value)} autoFocus />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">RUT</label>
              <input className="input-field text-sm" value={form.rut} onChange={e => set("rut", e.target.value)} placeholder="12.345.678-9" />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Tipo</label>
              <select className="input-field text-sm" value={form.tipo_cliente} onChange={e => set("tipo_cliente", e.target.value)}>
                <option value="persona_natural">Persona natural</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Email</label>
              <input className="input-field text-sm" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Teléfono</label>
              <input className="input-field text-sm" value={form.telefono} onChange={e => set("telefono", e.target.value)} placeholder="+56 9 XXXX XXXX" />
            </div>
            <div className="col-span-2">
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Dirección</label>
              <input className="input-field text-sm" value={form.direccion} onChange={e => set("direccion", e.target.value)} />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Comuna</label>
              <input className="input-field text-sm" value={form.comuna} onChange={e => set("comuna", e.target.value)} />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Ciudad</label>
              <input className="input-field text-sm" value={form.ciudad} onChange={e => set("ciudad", e.target.value)} defaultValue="Santiago" />
            </div>
            <div className="col-span-2">
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Observaciones</label>
              <textarea className="input-field text-sm resize-none h-16" value={form.observaciones} onChange={e => set("observaciones", e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={guardar} className="btn-gold flex-1 text-sm">
            {editando ? "Actualizar cliente" : "Crear cliente"}
          </button>
          <button onClick={() => setModal(false)} className="btn-ghost flex-1 text-sm border border-tm-border">
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmDialog
        open={!!confirmElim}
        onClose={() => setConfirmElim(null)}
        onConfirm={() => eliminar(confirmElim)}
        title="Eliminar cliente"
        message={`¿Estás seguro de que quieres eliminar a "${confirmElim?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
      />
    </div>
  )
}