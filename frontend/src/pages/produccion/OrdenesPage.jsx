import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import SearchBar from "../../components/ui/SearchBar"
import Pagination from "../../components/ui/Pagination"
import { Table, Tr, Td } from "../../components/ui/Table"
import StatsBar from "../../components/ui/StatsBar"
import clsx from "clsx"

const ESTADO_V = {
  pedido_recibido:"gray", materiales_pendientes:"orange",
  materiales_preparados:"blue", en_produccion:"purple",
  en_terminaciones:"orange", control_calidad:"cyan",
  listo_despacho:"green", despachado:"green",
  instalado:"green", cerrado:"gray", cancelado:"red",
}
const ESTADO_L = {
  pedido_recibido:"Pedido recibido", materiales_pendientes:"Mat. pendientes",
  materiales_preparados:"Mat. preparados", en_produccion:"En producción",
  en_terminaciones:"En terminaciones", control_calidad:"Control calidad",
  listo_despacho:"Listo despacho", despachado:"Despachado",
  instalado:"Instalado", cerrado:"Cerrado", cancelado:"Cancelado",
}
const PRIO_COLOR = { urgente:"text-red-400", alta:"text-orange-400", normal:"text-tm-muted", baja:"text-slate-500" }

const ORDENES_DEMO = [
  { id:1, numero_orden:"OP-01-00234", cliente_nombre:"María González", producto_nombre:"Closet 3 Cuerpos Corredera", cantidad:1, estado_general:"en_produccion", etapa_actual_nombre:"Enchapado", avance_porcentaje:65, prioridad:"urgente", responsable_nombre:"Ana Muñoz", fecha_entrega_estimada:"2026-06-12", esta_atrasado:true, dias_restantes:-1, estado_pago:"parcial", costo_estimado:680000, ingreso_total:1200000 },
  { id:2, numero_orden:"OP-01-00235", cliente_nombre:"Constructora Andina SpA", producto_nombre:"Cocina Integral Modular", cantidad:1, estado_general:"materiales_preparados", etapa_actual_nombre:"Dimensionado", avance_porcentaje:20, prioridad:"alta", responsable_nombre:"Pedro Silva", fecha_entrega_estimada:"2026-06-20", esta_atrasado:false, dias_restantes:9, estado_pago:"pendiente", costo_estimado:1900000, ingreso_total:3500000 },
  { id:3, numero_orden:"OP-01-00236", cliente_nombre:"Hotel Andes", producto_nombre:"Mesa Comedor 10 personas", cantidad:1, estado_general:"control_calidad", etapa_actual_nombre:"Control Calidad", avance_porcentaje:90, prioridad:"normal", responsable_nombre:"Ana Muñoz", fecha_entrega_estimada:"2026-06-12", esta_atrasado:false, dias_restantes:1, estado_pago:"parcial", costo_estimado:420000, ingreso_total:890000 },
  { id:4, numero_orden:"OP-01-00237", cliente_nombre:"Familia Soto Pérez", producto_nombre:"Velador Flotante x2", cantidad:2, estado_general:"en_terminaciones", etapa_actual_nombre:"Barnizado", avance_porcentaje:80, prioridad:"baja", responsable_nombre:"Laura Vera", fecha_entrega_estimada:"2026-06-15", esta_atrasado:false, dias_restantes:4, estado_pago:"pagado", costo_estimado:260000, ingreso_total:560000 },
  { id:5, numero_orden:"OP-01-00238", cliente_nombre:"Clínica Santa María", producto_nombre:"Archivero 4 Cajones x5", cantidad:5, estado_general:"listo_despacho", etapa_actual_nombre:"Despacho", avance_porcentaje:100, prioridad:"alta", responsable_nombre:"Carlos Rodríguez", fecha_entrega_estimada:"2026-06-11", esta_atrasado:false, dias_restantes:0, estado_pago:"pagado", costo_estimado:2325000, ingreso_total:4750000 },
  { id:6, numero_orden:"OP-01-00239", cliente_nombre:"Jorge Mena", producto_nombre:"Closet 2 Cuerpos", cantidad:1, estado_general:"pedido_recibido", etapa_actual_nombre:"—", avance_porcentaje:0, prioridad:"normal", responsable_nombre:"—", fecha_entrega_estimada:"2026-06-28", esta_atrasado:false, dias_restantes:17, estado_pago:"pendiente", costo_estimado:480000, ingreso_total:850000 },
]

const PAGO_V = { pendiente:"orange", parcial:"blue", pagado:"green", vencido:"red" }
const fmt = v => "$" + Number(v).toLocaleString("es-CL")

export default function OrdenesPage() {
  const navigate = useNavigate()
  const [buscar, setBuscar] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [filtroPrioridad, setFiltroPrioridad] = useState("")
  const [soloAtrasadas, setSoloAtrasadas] = useState(false)
  const [page, setPage] = useState(1)
  const POR_PAGINA = 10

  const handleSearch = useCallback(v => { setBuscar(v); setPage(1) }, [])

  const filtradas = ORDENES_DEMO.filter(o => {
    if (soloAtrasadas && !o.esta_atrasado) return false
    if (filtroEstado && o.estado_general !== filtroEstado) return false
    if (filtroPrioridad && o.prioridad !== filtroPrioridad) return false
    if (buscar) {
      const q = buscar.toLowerCase()
      return o.numero_orden.toLowerCase().includes(q) ||
             o.cliente_nombre.toLowerCase().includes(q) ||
             o.producto_nombre.toLowerCase().includes(q)
    }
    return true
  })

  const paginadas = filtradas.slice((page - 1) * POR_PAGINA, page * POR_PAGINA)
  const totalPages = Math.ceil(filtradas.length / POR_PAGINA)

  const atrasadas = ORDENES_DEMO.filter(o => o.esta_atrasado).length
  const enProd = ORDENES_DEMO.filter(o => o.estado_general === "en_produccion").length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Órdenes de Producción</h1>
          <p className="text-tm-muted text-sm mt-1">
            {ORDENES_DEMO.length} órdenes · {atrasadas > 0 && <span className="text-red-400">{atrasadas} atrasadas · </span>}
            {enProd} en producción
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/app/estado-productos")}
            className="btn-ghost text-sm border border-tm-border"
          >
            📊 Vista Kanban
          </button>
          <button
            onClick={() => navigate("/app/ordenes/nueva")}
            className="btn-gold text-sm"
          >
            + Nueva orden
          </button>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label:"Total activas", value:ORDENES_DEMO.filter(o => !["cerrado","cancelado"].includes(o.estado_general)).length, color:"#C9963A" },
          { label:"Atrasadas", value:atrasadas, color:"#EF4444" },
          { label:"En producción", value:enProd, color:"#8B5CF6" },
          { label:"Listas despacho", value:ORDENES_DEMO.filter(o => o.estado_general === "listo_despacho").length, color:"#22C55E" },
          { label:"Pagos pendientes", value:ORDENES_DEMO.filter(o => o.estado_pago === "pendiente").length, color:"#F97316" },
        ].map(k => (
          <div key={k.label} className="card py-3">
            <div className="text-xl font-bold" style={{ color:k.color }}>{k.value}</div>
            <div className="text-tm-muted text-xs mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar onSearch={handleSearch} placeholder="Buscar por orden, cliente o producto..." className="w-72" />
        <select
          className="input-field w-44 text-sm"
          value={filtroEstado}
          onChange={e => { setFiltroEstado(e.target.value); setPage(1) }}
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADO_L).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select
          className="input-field w-36 text-sm"
          value={filtroPrioridad}
          onChange={e => { setFiltroPrioridad(e.target.value); setPage(1) }}
        >
          <option value="">Prioridad</option>
          {["urgente","alta","normal","baja"].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-tm-muted cursor-pointer">
          <input type="checkbox" checked={soloAtrasadas} onChange={e => { setSoloAtrasadas(e.target.checked); setPage(1) }} className="accent-red-500" />
          <span className="text-red-400 font-medium">Solo atrasadas</span>
        </label>
        {(buscar || filtroEstado || filtroPrioridad || soloAtrasadas) && (
          <button
            onClick={() => { setBuscar(""); setFiltroEstado(""); setFiltroPrioridad(""); setSoloAtrasadas(false); setPage(1) }}
            className="text-tm-muted text-xs hover:text-tm-gold transition-colors"
          >
            ✕ Limpiar filtros
          </button>
        )}
        <span className="text-tm-muted text-xs ml-auto">{filtradas.length} resultados</span>
      </div>

      {/* Tabla */}
      <Table headers={["Orden","Cliente","Producto","Estado","Avance","Responsable","Entrega","Ingreso","Pago","Prioridad"]}>
        {paginadas.map(o => (
          <Tr key={o.id} onClick={() => navigate(`/app/ordenes/${o.id}`)}>
            <Td>
              <div className="flex items-center gap-1.5">
                {o.esta_atrasado && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"/>}
                <span className="font-mono text-tm-gold text-xs">{o.numero_orden}</span>
              </div>
            </Td>
            <Td><span className="text-tm-text text-sm">{o.cliente_nombre}</span></Td>
            <Td>
              <div className="text-tm-text text-sm truncate max-w-[160px]">{o.producto_nombre}</div>
              {o.cantidad > 1 && <div className="text-tm-muted text-xs">×{o.cantidad}</div>}
            </Td>
            <Td>
              <div>
                <Badge variante={ESTADO_V[o.estado_general] || "gray"} className="text-xs">
                  {ESTADO_L[o.estado_general]}
                </Badge>
                {o.etapa_actual_nombre && o.etapa_actual_nombre !== "—" && (
                  <div className="text-tm-muted text-xs mt-0.5">{o.etapa_actual_nombre}</div>
                )}
              </div>
            </Td>
            <Td>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-14 bg-tm-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: o.avance_porcentaje + "%",
                      background: o.avance_porcentaje === 100 ? "#22C55E" : o.esta_atrasado ? "#EF4444" : "#C9963A"
                    }}
                  />
                </div>
                <span className="text-xs text-tm-muted">{o.avance_porcentaje}%</span>
              </div>
            </Td>
            <Td><span className="text-tm-text text-xs">{o.responsable_nombre || "—"}</span></Td>
            <Td>
              <span className={clsx("text-xs", o.esta_atrasado ? "text-red-400 font-semibold" : o.dias_restantes <= 2 ? "text-orange-400" : "text-tm-muted")}>
                {o.esta_atrasado ? `⚠ ${o.dias_restantes}d` : o.dias_restantes === 0 ? "Hoy" : `${o.dias_restantes}d`}
              </span>
              <div className="text-tm-muted text-xs">{new Date(o.fecha_entrega_estimada).toLocaleDateString("es-CL")}</div>
            </Td>
            <Td><span className="font-mono text-xs text-tm-text">{fmt(o.ingreso_total)}</span></Td>
            <Td><Badge variante={PAGO_V[o.estado_pago]}>{o.estado_pago}</Badge></Td>
            <Td>
              <span className={clsx("text-xs font-semibold capitalize", PRIO_COLOR[o.prioridad])}>
                {o.prioridad}
              </span>
            </Td>
          </Tr>
        ))}
      </Table>

      {filtradas.length === 0 && (
        <div className="text-center py-12 text-tm-muted">
          <div className="text-4xl mb-3">🔍</div>
          <div>No se encontraron órdenes con los filtros aplicados.</div>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}