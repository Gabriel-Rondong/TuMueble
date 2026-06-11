import { useState } from "react"
import Badge from "../../components/ui/Badge"
import Modal from "../../components/ui/Modal"

const MODULOS = [
  { id:1, codigo:"dashboard", nombre:"Dashboard Gerencial", descripcion:"KPIs, gráficos de ventas, producción y stock", icono:"📈", orden:1, activo:true, empresas_activas:2 },
  { id:2, codigo:"produccion", nombre:"Órdenes de Producción", descripcion:"Flujo completo de fabricación, etapas y trazabilidad", icono:"🏭", orden:2, activo:true, empresas_activas:2 },
  { id:3, codigo:"bodega", nombre:"Bodega e Inventario", descripcion:"Stock, entradas, salidas, lotes y alertas", icono:"📦", orden:3, activo:true, empresas_activas:2 },
  { id:4, codigo:"productos", nombre:"Productos / BOM", descripcion:"Fichas técnicas y lista de materiales por producto", icono:"🪑", orden:4, activo:true, empresas_activas:2 },
  { id:5, codigo:"clientes", nombre:"Clientes", descripcion:"Registro y seguimiento de clientes", icono:"🤝", orden:5, activo:true, empresas_activas:2 },
  { id:6, codigo:"proveedores", nombre:"Proveedores", descripcion:"Gestión de proveedores y evaluación de calidad", icono:"🚚", orden:6, activo:true, empresas_activas:1 },
  { id:7, codigo:"documentos", nombre:"Documentos y Facturas", descripcion:"Cotizaciones, facturas, guías de despacho", icono:"🧾", orden:7, activo:true, empresas_activas:2 },
  { id:8, codigo:"costos", nombre:"Costos e Ingresos", descripcion:"Rentabilidad por orden, márgenes y saldos", icono:"💰", orden:8, activo:true, empresas_activas:2 },
  { id:9, codigo:"calidad", nombre:"Control de Calidad / NC", descripcion:"No conformidades, acciones correctivas y estadísticas", icono:"✅", orden:9, activo:true, empresas_activas:1 },
  { id:10, codigo:"reportes", nombre:"Reportes y Exportación", descripcion:"Centro de reportes con exportación PDF/Excel", icono:"📄", orden:10, activo:true, empresas_activas:2 },
  { id:11, codigo:"auditoria", nombre:"Auditoría y Logs", descripcion:"Historial completo de acciones del sistema", icono:"🔍", orden:11, activo:true, empresas_activas:2 },
  { id:12, codigo:"portal_cliente", nombre:"Portal del Cliente", descripcion:"Vista pública de estado del pedido con token seguro", icono:"🌐", orden:12, activo:true, empresas_activas:2 },
  { id:13, codigo:"operario", nombre:"Vista Operario", descripcion:"Interfaz simplificada para operarios de proceso", icono:"🔧", orden:13, activo:true, empresas_activas:2 },
  { id:14, codigo:"usuarios", nombre:"Usuarios y Roles", descripcion:"Gestión de usuarios, roles y permisos granulares", icono:"👥", orden:14, activo:true, empresas_activas:2 },
  { id:15, codigo:"configuracion", nombre:"Configuración", descripcion:"Parámetros de empresa, etapas y ajustes del sistema", icono:"⚙️", orden:15, activo:true, empresas_activas:2 },
]

const EMPRESAS = ["TuMueble SpA", "Muebles del Sur Ltda", "Carpintería Andina"]

export default function ModulosPage() {
  const [modulos, setModulos] = useState(MODULOS)
  const [modal, setModal] = useState(false)
  const [modalAsignar, setModalAsignar] = useState(null)
  const [buscar, setBuscar] = useState("")
  const [saved, setSaved] = useState(false)

  const toggle = (id) => {
    setModulos(m => m.map(mod => mod.id === id ? { ...mod, activo: !mod.activo } : mod))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const filtrados = modulos.filter(m =>
    m.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    m.codigo.toLowerCase().includes(buscar.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Módulos del Sistema</h1>
          <p className="text-tm-muted text-sm mt-1">
            {modulos.filter(m => m.activo).length} módulos activos de {modulos.length} disponibles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Buscar módulo..."
            className="input-field w-56 text-sm"
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
          />
          <button className="btn-gold text-sm" onClick={() => setModal(true)}>+ Nuevo módulo</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total módulos", value: modulos.length, color: "#C9963A", icon: "📦" },
          { label: "Módulos activos", value: modulos.filter(m => m.activo).length, color: "#22C55E", icon: "✅" },
          { label: "Módulos inactivos", value: modulos.filter(m => !m.activo).length, color: "#64748B", icon: "⏸" },
          { label: "Empresas usando", value: 2, color: "#3B82F6", icon: "🏢" },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="text-xl mb-2">{k.icon}</div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-text text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabla de módulos */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-tm-border bg-tm-surface">
          <span className="text-xs font-semibold text-tm-muted uppercase tracking-wider">Módulos del sistema</span>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-gold text-xs py-1.5 px-4">
              Guardar cambios
            </button>
            {saved && <span className="text-green-400 text-xs flex items-center">✓ Guardado</span>}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-tm-border">
              {["#", "Módulo", "Descripción", "Empresas activas", "Estado global", "Acciones"].map(h => (
                <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(m => (
              <tr key={m.id} className="border-b border-tm-border/50 hover:bg-tm-card/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="w-7 h-7 rounded-lg bg-tm-surface border border-tm-border flex items-center justify-center text-sm">
                    {m.icono}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-tm-text text-sm">{m.nombre}</div>
                  <div className="font-mono text-tm-muted text-xs mt-0.5">{m.codigo}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-tm-muted text-xs">{m.descripcion}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < m.empresas_activas ? "bg-green-400" : "bg-tm-border"}`}
                        title={i < m.empresas_activas ? "Habilitado" : "No habilitado"}
                      />
                    ))}
                    <span className="text-tm-muted text-xs ml-1">{m.empresas_activas}/3</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggle(m.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${m.activo ? "bg-tm-gold" : "bg-tm-border"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${m.activo ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setModalAsignar(m)}
                    className="text-tm-gold text-xs hover:underline"
                  >
                    Asignar empresas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal nuevo módulo */}
      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo Módulo" size="md">
        <div className="space-y-3">
          {[["nombre", "Nombre del módulo"], ["codigo", "Código único"], ["descripcion", "Descripción"]].map(([k, l]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              {k === "descripcion"
                ? <textarea className="input-field text-sm resize-none h-16" />
                : <input className="input-field text-sm" />
              }
            </div>
          ))}
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Ícono (emoji)</label>
            <input className="input-field text-sm" placeholder="📦" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Crear módulo</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModal(false)}>Cancelar</button>
        </div>
      </Modal>

      {/* Modal asignar empresas */}
      <Modal open={!!modalAsignar} onClose={() => setModalAsignar(null)} title={`Asignar empresas — ${modalAsignar?.nombre}`} size="sm">
        <p className="text-tm-muted text-xs mb-4">Selecciona las empresas que tendrán acceso a este módulo.</p>
        <div className="space-y-3">
          {EMPRESAS.map((e, i) => (
            <label key={e} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-tm-surface cursor-pointer hover:bg-tm-card transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-tm-gold/20 rounded-lg flex items-center justify-center text-tm-gold text-xs font-bold">{e[0]}</div>
                <span className="text-tm-text text-sm">{e}</span>
              </div>
              <input type="checkbox" defaultChecked={i < 2} className="accent-tm-gold w-4 h-4" />
            </label>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Guardar asignación</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModalAsignar(null)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}