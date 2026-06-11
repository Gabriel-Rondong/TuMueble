import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../components/ui/Toast"
import clsx from "clsx"

const CLIENTES = [
  { id:1, nombre:"María González", rut:"12.345.678-9" },
  { id:2, nombre:"Constructora Andina SpA", rut:"77.123.456-7" },
  { id:3, nombre:"Hotel Andes", rut:"76.987.654-3" },
  { id:4, nombre:"Familia Soto Pérez", rut:"9.876.543-2" },
]

const PRODUCTOS = [
  { id:1, nombre:"Closet 3 Cuerpos Corredera", codigo:"CL-003", precio:1200000, tiempo:40 },
  { id:2, nombre:"Cocina Integral Modular", codigo:"CO-INT", precio:3500000, tiempo:80 },
  { id:3, nombre:"Mesa Comedor Madera Maciza", codigo:"ME-COM", precio:890000, tiempo:24 },
  { id:4, nombre:"Velador Flotante", codigo:"VE-FLO", precio:280000, tiempo:8 },
  { id:5, nombre:"Archivero 4 Cajones", codigo:"AR-004", precio:480000, tiempo:16 },
]

const USUARIOS = [
  { id:1, nombre:"Ana Muñoz" },
  { id:2, nombre:"Carlos Rodríguez" },
  { id:3, nombre:"Pedro Silva" },
]

const PASOS = ["Cliente y Producto", "Detalles de la Orden", "Revisión y Crear"]

export default function NuevaOrdenPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [paso, setPaso] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    cliente_id: "",
    producto_id: "",
    cantidad: 1,
    fecha_entrega_estimada: "",
    prioridad: "normal",
    responsable_id: "",
    precio_venta: "",
    observaciones: "",
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const clienteSel = CLIENTES.find(c => c.id === +form.cliente_id)
  const productoSel = PRODUCTOS.find(p => p.id === +form.producto_id)
  const fmtCLP = v => v ? "$" + Number(v).toLocaleString("es-CL") : "—"

  const puedeAvanzar = () => {
    if (paso === 0) return form.cliente_id && form.producto_id
    if (paso === 1) return form.fecha_entrega_estimada && form.prioridad
    return true
  }

  const crearOrden = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success("Orden de producción creada correctamente")
    setLoading(false)
    navigate("/app/ordenes")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/app/ordenes")}
          className="text-tm-muted hover:text-tm-gold transition-colors text-sm flex items-center gap-1"
        >
          ← Volver
        </button>
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Nueva Orden de Producción</h1>
          <p className="text-tm-muted text-sm">Paso {paso + 1} de {PASOS.length}</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {PASOS.map((p, i) => (
          <div key={p} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={clsx(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                i < paso ? "bg-green-500 text-white" :
                i === paso ? "bg-tm-gold text-tm-dark" :
                "bg-tm-border text-tm-muted"
              )}>
                {i < paso ? "✓" : i + 1}
              </div>
              <span className={clsx(
                "text-sm hidden sm:block",
                i === paso ? "text-tm-gold font-medium" : "text-tm-muted"
              )}>
                {p}
              </span>
            </div>
            {i < PASOS.length - 1 && (
              <div className={clsx("flex-1 h-0.5 mx-3 transition-colors", i < paso ? "bg-green-500" : "bg-tm-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Paso 0: Cliente y Producto */}
      {paso === 0 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-tm-text text-base">Seleccionar cliente y producto</h2>

          <div>
            <label className="block text-tm-muted text-xs mb-2 uppercase tracking-wider">Cliente *</label>
            <div className="space-y-2">
              {CLIENTES.map(c => (
                <label
                  key={c.id}
                  className={clsx(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    +form.cliente_id === c.id
                      ? "border-tm-gold/50 bg-tm-gold/5"
                      : "border-tm-border hover:border-tm-gold/30 hover:bg-tm-card"
                  )}
                >
                  <input
                    type="radio"
                    name="cliente"
                    value={c.id}
                    checked={+form.cliente_id === c.id}
                    onChange={() => set("cliente_id", c.id)}
                    className="accent-tm-gold"
                  />
                  <div className="flex-1">
                    <div className="text-tm-text font-medium text-sm">{c.nombre}</div>
                    <div className="text-tm-muted text-xs">{c.rut}</div>
                  </div>
                  {+form.cliente_id === c.id && <span className="text-tm-gold text-sm">✓</span>}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-tm-muted text-xs mb-2 uppercase tracking-wider">Producto / Mueble *</label>
            <div className="space-y-2">
              {PRODUCTOS.map(p => (
                <label
                  key={p.id}
                  className={clsx(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    +form.producto_id === p.id
                      ? "border-tm-gold/50 bg-tm-gold/5"
                      : "border-tm-border hover:border-tm-gold/30 hover:bg-tm-card"
                  )}
                >
                  <input
                    type="radio"
                    name="producto"
                    value={p.id}
                    checked={+form.producto_id === p.id}
                    onChange={() => set("producto_id", p.id)}
                    className="accent-tm-gold"
                  />
                  <div className="flex-1">
                    <div className="text-tm-text font-medium text-sm">{p.nombre}</div>
                    <div className="text-tm-muted text-xs">{p.codigo} · {p.tiempo}h estimadas</div>
                  </div>
                  <div className="text-right">
                    <div className="text-tm-gold font-mono text-sm font-semibold">{fmtCLP(p.precio)}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paso 1: Detalles */}
      {paso === 1 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-tm-text text-base">Detalles de la orden</h2>

          {/* Resumen selección */}
          <div className="bg-tm-surface rounded-lg p-3 flex gap-4 text-sm">
            <div>
              <div className="text-tm-muted text-xs">Cliente</div>
              <div className="text-tm-text font-medium">{clienteSel?.nombre}</div>
            </div>
            <div className="border-l border-tm-border pl-4">
              <div className="text-tm-muted text-xs">Producto</div>
              <div className="text-tm-text font-medium">{productoSel?.nombre}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-tm-muted text-xs mb-1.5 uppercase tracking-wider">Cantidad *</label>
              <input
                type="number" min="1"
                className="input-field text-sm"
                value={form.cantidad}
                onChange={e => set("cantidad", +e.target.value)}
              />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1.5 uppercase tracking-wider">Precio de venta (CLP)</label>
              <input
                type="number"
                className="input-field text-sm"
                value={form.precio_venta || productoSel?.precio || ""}
                onChange={e => set("precio_venta", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-tm-muted text-xs mb-1.5 uppercase tracking-wider">Fecha de entrega estimada *</label>
              <input
                type="date"
                className="input-field text-sm"
                value={form.fecha_entrega_estimada}
                onChange={e => set("fecha_entrega_estimada", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1.5 uppercase tracking-wider">Prioridad *</label>
              <select
                className="input-field text-sm"
                value={form.prioridad}
                onChange={e => set("prioridad", e.target.value)}
              >
                {[["baja","Baja"],["normal","Normal"],["alta","Alta"],["urgente","Urgente"]].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-tm-muted text-xs mb-1.5 uppercase tracking-wider">Responsable</label>
            <select
              className="input-field text-sm"
              value={form.responsable_id}
              onChange={e => set("responsable_id", e.target.value)}
            >
              <option value="">Sin asignar</option>
              {USUARIOS.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-tm-muted text-xs mb-1.5 uppercase tracking-wider">Observaciones</label>
            <textarea
              className="input-field text-sm resize-none h-24"
              placeholder="Instrucciones especiales, detalles del cliente, acabados específicos..."
              value={form.observaciones}
              onChange={e => set("observaciones", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Paso 2: Revisión */}
      {paso === 2 && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-tm-text text-base mb-4">Revisión de la orden</h2>
            <div className="space-y-3">
              {[
                ["Cliente", clienteSel?.nombre],
                ["RUT", clienteSel?.rut],
                ["Producto", productoSel?.nombre],
                ["Código", productoSel?.codigo],
                ["Cantidad", form.cantidad],
                ["Precio de venta", fmtCLP(form.precio_venta || productoSel?.precio)],
                ["Fecha entrega estimada", form.fecha_entrega_estimada],
                ["Prioridad", form.prioridad],
                ["Responsable", USUARIOS.find(u => u.id === +form.responsable_id)?.nombre || "Sin asignar"],
                ["Tiempo estimado producción", productoSel ? productoSel.tiempo + " horas" : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-tm-border/50 last:border-0 text-sm">
                  <span className="text-tm-muted">{k}</span>
                  <span className="text-tm-text font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {form.observaciones && (
            <div className="card bg-tm-surface">
              <div className="text-xs text-tm-muted mb-1">Observaciones</div>
              <p className="text-tm-text text-sm">{form.observaciones}</p>
            </div>
          )}

          <div className="card bg-tm-gold/5 border-tm-gold/25">
            <div className="text-xs text-tm-gold font-semibold mb-2 uppercase tracking-wider">Al crear la orden</div>
            <div className="space-y-1 text-xs text-tm-muted">
              <div>✓ Se generará un número de orden automático (ej: 01-00240)</div>
              <div>✓ Se creará un código de seguimiento único para el cliente</div>
              <div>✓ Se crearán las etapas de producción según la ficha del producto</div>
              <div>✓ Se reservarán los materiales disponibles en bodega</div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación pasos */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => paso > 0 ? setPaso(p => p - 1) : navigate("/app/ordenes")}
          className="btn-ghost text-sm border border-tm-border"
        >
          {paso === 0 ? "Cancelar" : "← Anterior"}
        </button>

        {paso < PASOS.length - 1 ? (
          <button
            onClick={() => setPaso(p => p + 1)}
            disabled={!puedeAvanzar()}
            className="btn-gold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={crearOrden}
            disabled={loading}
            className="btn-gold text-sm min-w-40 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-tm-dark/30 border-t-tm-dark rounded-full animate-spin" />
                Creando orden...
              </span>
            ) : "✓ Crear orden de producción"}
          </button>
        )}
      </div>
    </div>
  )
}