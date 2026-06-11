import { useState } from "react"
import Badge from "../../components/ui/Badge"
import Modal from "../../components/ui/Modal"
import { Table, Tr, Td } from "../../components/ui/Table"

const ADMINS = [
  { id:1, nombre:"Roberto", apellido:"Fuentes", email:"admin@tumueble.cl", empresa:"TuMueble SpA", activo:true, ultimo:"2026-06-10 09:15", ordenes_empresa:24 },
  { id:2, nombre:"Carmen", apellido:"Reyes", email:"admin@mueblesdelsur.cl", empresa:"Muebles del Sur Ltda", activo:true, ultimo:"2026-06-09 16:30", ordenes_empresa:7 },
  { id:3, nombre:"Diego", apellido:"Morales", email:"admin@carpinteria.cl", empresa:"Carpintería Andina", activo:false, ultimo:"2026-04-15 11:00", ordenes_empresa:0 },
]

const EMPRESAS = ["TuMueble SpA", "Muebles del Sur Ltda", "Carpintería Andina"]

export default function AdministradoresPage() {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nombre:"", apellido:"", email:"", empresa:"", password:"" })
  const [admins, setAdmins] = useState(ADMINS)
  const [buscar, setBuscar] = useState("")
  const [confirmReset, setConfirmReset] = useState(null)

  const filtrados = admins.filter(a =>
    (a.nombre + " " + a.apellido + " " + a.email + " " + a.empresa)
      .toLowerCase().includes(buscar.toLowerCase())
  )

  const toggleActivo = (id) => {
    setAdmins(a => a.map(admin => admin.id === id ? { ...admin, activo: !admin.activo } : admin))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Administradores de Empresa</h1>
          <p className="text-tm-muted text-sm mt-1">
            {admins.filter(a => a.activo).length} activos · {admins.length} total
          </p>
        </div>
        <div className="flex gap-3">
          <input
            placeholder="Buscar administrador o empresa..."
            className="input-field w-64 text-sm"
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
          />
          <button className="btn-gold text-sm" onClick={() => setModal(true)}>+ Nuevo administrador</button>
        </div>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-3 gap-4">
        {EMPRESAS.map((empresa, i) => {
          const admin = admins.find(a => a.empresa === empresa)
          return (
            <div key={empresa} className="card">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-tm-gold/15 rounded-xl flex items-center justify-center text-tm-gold font-bold text-lg flex-shrink-0">
                  {empresa[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-tm-text font-semibold text-sm truncate">{empresa}</div>
                  {admin ? (
                    <>
                      <div className="text-tm-muted text-xs truncate">{admin.nombre} {admin.apellido}</div>
                      <div className="text-tm-muted text-xs truncate">{admin.email}</div>
                    </>
                  ) : (
                    <div className="text-tm-muted text-xs italic">Sin administrador asignado</div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variante={admin?.activo ? "green" : "gray"}>
                  {admin?.activo ? "Activo" : "Inactivo"}
                </Badge>
                <span className="text-tm-muted text-xs">{admin?.ordenes_empresa || 0} órdenes</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabla */}
      <Table headers={["Administrador", "Empresa", "Email", "Último acceso", "Órdenes", "Estado", "Acciones"]}>
        {filtrados.map(a => (
          <Tr key={a.id}>
            <Td>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tm-gold/20 flex items-center justify-center text-tm-gold text-xs font-bold flex-shrink-0">
                  {a.nombre[0]}{a.apellido[0]}
                </div>
                <div>
                  <div className="text-tm-text font-medium text-sm">{a.nombre} {a.apellido}</div>
                  <div className="text-tm-muted text-xs">Administrador de empresa</div>
                </div>
              </div>
            </Td>
            <Td>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-tm-gold/15 rounded flex items-center justify-center text-tm-gold text-xs font-bold">{a.empresa[0]}</div>
                <span className="text-tm-text text-sm">{a.empresa}</span>
              </div>
            </Td>
            <Td><span className="text-tm-muted text-xs font-mono">{a.email}</span></Td>
            <Td><span className="text-tm-muted text-xs">{a.activo ? a.ultimo : "—"}</span></Td>
            <Td><span className="text-tm-text text-sm text-center block">{a.ordenes_empresa}</span></Td>
            <Td>
              <Badge variante={a.activo ? "green" : "gray"}>
                {a.activo ? "Activo" : "Inactivo"}
              </Badge>
            </Td>
            <Td>
              <div className="flex gap-2 flex-wrap">
                <button className="text-tm-gold text-xs hover:underline">Editar</button>
                <button
                  className={a.activo ? "text-red-400 text-xs hover:underline" : "text-green-400 text-xs hover:underline"}
                  onClick={() => toggleActivo(a.id)}
                >
                  {a.activo ? "Desactivar" : "Activar"}
                </button>
                <button
                  className="text-tm-muted text-xs hover:text-tm-gold hover:underline"
                  onClick={() => setConfirmReset(a)}
                >
                  Restablecer pwd
                </button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {/* Modal nuevo administrador */}
      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo Administrador de Empresa" size="md">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[["nombre", "Nombre"], ["apellido", "Apellido"]].map(([k, l]) => (
              <div key={k}>
                <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
                <input className="input-field text-sm" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Email</label>
            <input className="input-field text-sm" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Empresa asignada</label>
            <select className="input-field text-sm" value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))}>
              <option value="">Seleccionar empresa...</option>
              {EMPRESAS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Contraseña inicial</label>
            <input className="input-field text-sm" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mín. 8 caracteres" />
          </div>
          <div className="bg-tm-surface rounded-lg p-3 text-xs text-tm-muted">
            Este usuario tendrá acceso completo a la empresa asignada como Administrador. Podrá crear usuarios, gestionar módulos y acceder a todos los datos de su empresa.
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Crear administrador</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModal(false)}>Cancelar</button>
        </div>
      </Modal>

      {/* Modal confirmar reset password */}
      <Modal open={!!confirmReset} onClose={() => setConfirmReset(null)} title="Restablecer contraseña" size="sm">
        <div className="space-y-3">
          <p className="text-tm-text text-sm">
            ¿Deseas restablecer la contraseña de <strong className="text-tm-gold">{confirmReset?.nombre} {confirmReset?.apellido}</strong>?
          </p>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Nueva contraseña</label>
            <input className="input-field text-sm" type="password" placeholder="Mín. 8 caracteres" />
          </div>
          <p className="text-tm-muted text-xs">El usuario deberá usar esta contraseña en su próximo inicio de sesión.</p>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Restablecer</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setConfirmReset(null)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}