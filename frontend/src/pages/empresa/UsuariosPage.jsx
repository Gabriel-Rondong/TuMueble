import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Table, Tr, Td } from '../../components/ui/Table'

const USUARIOS = [
  { id:1, nombre:'Carlos Rodríguez', apellido:'Muñoz', email:'carlos@tumueble.cl', rol:'Encargado de Bodega', activo:true, ultimo:'2026-06-10 09:15' },
  { id:2, nombre:'Ana', apellido:'Muñoz', email:'ana@tumueble.cl', rol:'Encargada de Producción', activo:true, ultimo:'2026-06-10 08:30' },
  { id:3, nombre:'Pedro', apellido:'Silva', email:'pedro@tumueble.cl', rol:'Operario de Proceso', activo:true, ultimo:'2026-06-09 17:45' },
  { id:4, nombre:'Laura', apellido:'Vera', email:'laura@tumueble.cl', rol:'Operaria de Proceso', activo:true, ultimo:'2026-06-09 17:00' },
  { id:5, nombre:'Jorge', apellido:'Pérez', email:'jorge@tumueble.cl', rol:'Ventas', activo:true, ultimo:'2026-06-10 10:00' },
  { id:6, nombre:'María', apellido:'Gonzálvez', email:'mgt@tumueble.cl', rol:'Gerente', activo:true, ultimo:'2026-06-10 07:50' },
  { id:7, nombre:'Roberto', apellido:'Campos', email:'roberto@tumueble.cl', rol:'Finanzas', activo:false, ultimo:'2026-05-28 14:20' },
]

const ROLES = ['Administrador','Gerente','Encargado de Bodega','Encargado de Producción','Operario de Proceso','Ventas','Finanzas','Solo Lectura']

export default function UsuariosPage() {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nombre:'', apellido:'', email:'', rol:'', password:'' })
  const [buscar, setBuscar] = useState('')

  const filtrados = USUARIOS.filter(u =>
    (u.nombre + ' ' + u.apellido + ' ' + u.email).toLowerCase().includes(buscar.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Usuarios y Roles</h1>
          <p className="text-tm-muted text-sm mt-1">{USUARIOS.filter(u=>u.activo).length} activos · {USUARIOS.length} total</p>
        </div>
        <div className="flex gap-3">
          <input placeholder="Buscar usuario..." className="input-field w-56 text-sm"
            value={buscar} onChange={e => setBuscar(e.target.value)} />
          <button className="btn-gold text-sm" onClick={() => setModal(true)}>+ Nuevo usuario</button>
        </div>
      </div>

      <Table headers={['Usuario','Email','Rol','Último acceso','Estado','Acciones']}>
        {filtrados.map(u => (
          <Tr key={u.id}>
            <Td>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tm-gold/20 flex items-center justify-center text-tm-gold text-xs font-bold flex-shrink-0">
                  {u.nombre[0]}{u.apellido[0]}
                </div>
                <div>
                  <div className="text-tm-text font-medium text-sm">{u.nombre} {u.apellido}</div>
                </div>
              </div>
            </Td>
            <Td><span className="text-tm-muted text-xs">{u.email}</span></Td>
            <Td><Badge variante="blue">{u.rol}</Badge></Td>
            <Td><span className="text-tm-muted text-xs">{u.ultimo}</span></Td>
            <Td><Badge variante={u.activo ? 'green' : 'gray'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge></Td>
            <Td>
              <div className="flex gap-2">
                <button className="text-tm-gold text-xs hover:underline">Editar</button>
                <button className={u.activo ? 'text-red-400 text-xs hover:underline' : 'text-green-400 text-xs hover:underline'}>
                  {u.activo ? 'Desactivar' : 'Activar'}
                </button>
                <button className="text-tm-muted text-xs hover:underline">Contraseña</button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo Usuario" size="md">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[['nombre','Nombre'],['apellido','Apellido']].map(([k,l]) => (
              <div key={k}>
                <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
                <input className="input-field text-sm" value={form[k]} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} />
              </div>
            ))}
          </div>
          {[['email','Email'],['password','Contraseña inicial']].map(([k,l]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              <input className="input-field text-sm" type={k === 'password' ? 'password' : 'text'}
                value={form[k]} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} />
            </div>
          ))}
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Rol</label>
            <select className="input-field text-sm" value={form.rol} onChange={e => setForm(f=>({...f,rol:e.target.value}))}>
              <option value="">Seleccionar rol...</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="bg-tm-surface rounded-lg p-3 text-xs text-tm-muted">
            El usuario recibirá acceso según el rol asignado. Podrás modificar los permisos específicos desde la sección de Roles.
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Crear usuario</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModal(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}