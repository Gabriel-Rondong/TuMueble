import { useState } from "react"
import clsx from "clsx"

const TABS = ["Empresa", "Etapas productivas", "Estados cliente", "Unidades de medida", "Roles y permisos"]

const ETAPAS = [
  { id:1, nombre:"Dimensionado", codigo:"DIM", orden:1, visible_cliente:false, activo:true },
  { id:2, nombre:"Corte", codigo:"COR", orden:2, visible_cliente:false, activo:true },
  { id:3, nombre:"Enchapado", codigo:"ENC", orden:3, visible_cliente:false, activo:true },
  { id:4, nombre:"Mecanizado / Perforado", codigo:"MEC", orden:4, visible_cliente:true, activo:true },
  { id:5, nombre:"Armado", codigo:"ARM", orden:5, visible_cliente:true, activo:true },
  { id:6, nombre:"Barnizado / Terminaciones", codigo:"BAR", orden:6, visible_cliente:true, activo:true },
  { id:7, nombre:"Embalaje", codigo:"EMB", orden:7, visible_cliente:false, activo:true },
  { id:8, nombre:"Control de Calidad", codigo:"QC", orden:8, visible_cliente:false, activo:true },
  { id:9, nombre:"Despacho", codigo:"DES", orden:9, visible_cliente:true, activo:true },
  { id:10, nombre:"Instalación", codigo:"INS", orden:10, visible_cliente:true, activo:true },
]

const ROLES_PERMISOS = [
  { rol:"Administrador", permisos:["Ver todo","Crear","Editar","Eliminar","Aprobar","Exportar","Anular","Cerrar","Administrar"] },
  { rol:"Gerente", permisos:["Ver todo","Exportar"] },
  { rol:"Bodega", permisos:["Ver materiales","Crear entradas","Crear salidas","Ver stock"] },
  { rol:"Producción", permisos:["Ver órdenes","Editar etapas","Asignar responsables"] },
  { rol:"Operario", permisos:["Ver propias órdenes","Iniciar etapa","Finalizar etapa","Reportar problema"] },
  { rol:"Ventas", permisos:["Ver clientes","Crear clientes","Ver órdenes (básico)"] },
  { rol:"Finanzas", permisos:["Ver documentos","Crear documentos","Ver costos","Exportar"] },
]

export default function ConfiguracionPage() {
  const [tab, setTab] = useState(0)
  const [empresa, setEmpresa] = useState({
    nombre:"TuMueble", razon_social:"TuMueble SpA", rut:"77.000.001-K",
    giro:"Fabricación de muebles y artículos de madera",
    direccion:"Av. Artesanos 1234, Pudahuel", telefono:"+56 2 2345 6789",
    email:"contacto@tumueble.cl", ciudad:"Santiago", plan:"Profesional",
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-tm-text">Configuración</h1>
        <p className="text-tm-muted text-sm mt-1">Ajustes generales del sistema TuMueble ERP</p>
      </div>

      <div className="flex gap-1 border-b border-tm-border">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={clsx("px-4 py-2 text-sm font-medium border-b-2 transition-colors", {
              "border-tm-gold text-tm-gold": tab === i,
              "border-transparent text-tm-muted hover:text-tm-text": tab !== i
            })}>
            {t}
          </button>
        ))}
      </div>

      {/* Datos empresa */}
      {tab === 0 && (
        <div className="max-w-2xl space-y-4">
          <div className="card">
            <h3 className="font-semibold text-tm-text mb-4">Datos de la empresa</h3>
            <div className="grid grid-cols-2 gap-3">
              {[["nombre","Nombre comercial"],["razon_social","Razón social"],["rut","RUT"],
                ["giro","Giro"],["direccion","Dirección"],["ciudad","Ciudad"],
                ["telefono","Teléfono"],["email","Email de contacto"]].map(([k,l]) => (
                <div key={k} className={k === "giro" || k === "direccion" ? "col-span-2" : ""}>
                  <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
                  <input className="input-field text-sm" value={empresa[k]} onChange={e => setEmpresa(f => ({...f,[k]:e.target.value}))} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button className="btn-gold text-sm" onClick={handleSave}>Guardar cambios</button>
              {saved && <span className="text-green-400 text-sm">✓ Guardado correctamente</span>}
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-tm-text mb-3">Plan actual</h3>
            <div className="flex items-center gap-3">
              <div className="text-tm-gold text-2xl">🏆</div>
              <div>
                <div className="text-tm-text font-bold">{empresa.plan}</div>
                <div className="text-tm-muted text-xs">24 módulos habilitados · Usuarios ilimitados</div>
              </div>
              <span className="ml-auto badge bg-tm-gold/15 text-tm-gold border border-tm-gold/20">Activo</span>
            </div>
          </div>
        </div>
      )}

      {/* Etapas productivas */}
      {tab === 1 && (
        <div className="max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <p className="text-tm-muted text-sm">Define el flujo de fabricación. El orden determina la secuencia de producción.</p>
            <button className="btn-gold text-sm">+ Nueva etapa</button>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tm-border bg-tm-surface">
                  {["#","Nombre","Código","Orden","Visible cliente","Estado","Acciones"].map(h => (
                    <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ETAPAS.map(e => (
                  <tr key={e.id} className="border-b border-tm-border/50 hover:bg-tm-card/50">
                    <td className="px-4 py-3 text-tm-muted text-xs">{e.id}</td>
                    <td className="px-4 py-3 text-tm-text font-medium">{e.nombre}</td>
                    <td className="px-4 py-3 font-mono text-tm-gold text-xs">{e.codigo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="text-tm-muted hover:text-tm-text px-1">↑</button>
                        <span className="text-tm-muted text-xs w-4 text-center">{e.orden}</span>
                        <button className="text-tm-muted hover:text-tm-text px-1">↓</button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={clsx("w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center px-0.5",
                        e.visible_cliente ? "bg-tm-gold" : "bg-tm-border")}>
                        <div className={clsx("w-4 h-4 rounded-full bg-white shadow transition-transform",
                          e.visible_cliente ? "translate-x-5" : "translate-x-0")} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx("text-xs font-medium", e.activo ? "text-green-400" : "text-tm-muted")}>
                        {e.activo ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-tm-gold text-xs hover:underline">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estados cliente */}
      {tab === 2 && (
        <div className="max-w-2xl space-y-3">
          <p className="text-tm-muted text-sm">Define cómo se muestran los estados al cliente en el portal público.</p>
          {[
            { interno:"pedido_recibido, materiales_pendientes", visible:"📦 Pedido recibido" },
            { interno:"materiales_preparados", visible:"🔧 Materiales en preparación" },
            { interno:"en_produccion", visible:"🏭 En fabricación" },
            { interno:"en_terminaciones", visible:"✨ En terminaciones" },
            { interno:"control_calidad", visible:"🔍 En revisión de calidad" },
            { interno:"listo_despacho", visible:"🚚 Listo para despacho" },
            { interno:"despachado, instalado, cerrado", visible:"✅ Entregado" },
          ].map((m, i) => (
            <div key={i} className="card flex items-center gap-4">
              <div className="flex-1">
                <div className="text-xs text-tm-muted mb-1">Estados internos</div>
                <div className="font-mono text-xs text-tm-gold bg-tm-surface rounded px-2 py-1">{m.interno}</div>
              </div>
              <div className="text-tm-muted text-lg">→</div>
              <div className="flex-1">
                <div className="text-xs text-tm-muted mb-1">Visible para el cliente</div>
                <input className="input-field text-sm" defaultValue={m.visible} />
              </div>
            </div>
          ))}
          <button className="btn-gold text-sm" onClick={handleSave}>Guardar mapeo</button>
          {saved && <span className="text-green-400 text-sm ml-3">✓ Guardado</span>}
        </div>
      )}

      {/* Unidades */}
      {tab === 3 && (
        <div className="max-w-xl">
          <div className="flex justify-between items-center mb-4">
            <p className="text-tm-muted text-sm">Unidades de medida disponibles en el sistema.</p>
            <button className="btn-gold text-sm">+ Nueva unidad</button>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tm-border bg-tm-surface">
                  {["Nombre","Abreviatura","Tipo"].map(h => (
                    <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[["Metro","m","longitud"],["Metro cuadrado","m²","area"],["Unidad","un","unidad"],
                  ["Kilogramo","kg","peso"],["Litro","L","volumen"],["Centímetro","cm","longitud"],
                  ["Plancha","pla","unidad"],["Rollo","rol","unidad"],["Caja","caj","unidad"]].map(([n,a,t]) => (
                  <tr key={n} className="border-b border-tm-border/50 hover:bg-tm-card/50">
                    <td className="px-4 py-2.5 text-tm-text">{n}</td>
                    <td className="px-4 py-2.5 font-mono text-tm-gold text-xs">{a}</td>
                    <td className="px-4 py-2.5 text-tm-muted text-xs capitalize">{t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles y permisos */}
      {tab === 4 && (
        <div className="grid grid-cols-2 gap-4 max-w-4xl">
          {ROLES_PERMISOS.map(r => (
            <div key={r.rol} className="card">
              <div className="font-semibold text-tm-text mb-3">{r.rol}</div>
              <div className="flex flex-wrap gap-1.5">
                {r.permisos.map(p => (
                  <span key={p} className="badge bg-tm-surface text-tm-muted border border-tm-border text-xs">{p}</span>
                ))}
              </div>
              <button className="text-tm-gold text-xs mt-3 hover:underline">Editar permisos</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}