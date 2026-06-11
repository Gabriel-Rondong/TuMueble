import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Badge from "../../components/ui/Badge"
import Modal from "../../components/ui/Modal"
import clsx from "clsx"

const ORDEN = {
  id:1, num:"OP-01-00234", cliente:"María González", producto:"Closet 3 Cuerpos Corredera",
  cantidad:1, estado_general:"en_produccion", etapa_actual:"Enchapado",
  avance:65, prioridad:"urgente", responsable:"Ana Muñoz",
  fecha_creacion:"2026-05-20", fecha_entrega:"2026-06-12",
  costo_estimado:680000, costo_real:412000, ingreso_total:1200000,
  utilidad:788000, margen_porcentaje:65.7, estado_pago:"parcial",
  codigo_seguimiento:"AB12CD34",
  observaciones:"Cliente solicita entrega urgente. Requiere embalaje reforzado.",
  etapas:[
    { etapa:"Dimensionado", estado:"completada", responsable:"Pedro Silva", inicio:"2026-05-21 08:00", fin:"2026-05-21 12:00" },
    { etapa:"Corte", estado:"completada", responsable:"Pedro Silva", inicio:"2026-05-21 13:00", fin:"2026-05-22 16:00" },
    { etapa:"Enchapado", estado:"iniciada", responsable:"Ana Muñoz", inicio:"2026-05-23 08:00", fin:null },
    { etapa:"Mecanizado", estado:"pendiente", responsable:null, inicio:null, fin:null },
    { etapa:"Armado", estado:"pendiente", responsable:null, inicio:null, fin:null },
    { etapa:"Barnizado", estado:"pendiente", responsable:null, inicio:null, fin:null },
    { etapa:"Embalaje", estado:"pendiente", responsable:null, inicio:null, fin:null },
    { etapa:"Control Calidad", estado:"pendiente", responsable:null, inicio:null, fin:null },
    { etapa:"Despacho", estado:"pendiente", responsable:null, inicio:null, fin:null },
  ],
  materiales:[
    { material:"Melamina Blanca 18mm", lote:"LOT-2026-001", cantidad_reservada:4, cantidad_consumida:3.2, unidad:"pla", costo:28500 },
    { material:"Canto PVC 22mm", lote:"LOT-2026-002", cantidad_reservada:80, cantidad_consumida:52, unidad:"m", costo:450 },
    { material:"Bisagra Clip 35mm", lote:"LOT-2026-003", cantidad_reservada:16, cantidad_consumida:16, unidad:"un", costo:1200 },
    { material:"Riel Telescópico 45cm", lote:"LOT-2026-001", cantidad_reservada:6, cantidad_consumida:0, unidad:"un", costo:4800 },
  ],
  historial:[
    { estado:"pedido_recibido", usuario:"Jorge Ventas", fecha:"2026-05-20 10:00", obs:"Pedido confirmado por cliente" },
    { estado:"materiales_preparados", usuario:"Carlos Bodega", fecha:"2026-05-20 15:30", obs:"Materiales reservados OK" },
    { estado:"en_produccion", usuario:"Ana Muñoz", fecha:"2026-05-21 08:00", obs:"Iniciada producción" },
  ],
}

const ESTADO_E = { completada:"green", iniciada:"gold", pausada:"orange", pendiente:"gray" }
const fmt = v => "$" + Number(v).toLocaleString("es-CL")

export default function OrdenDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState("etapas")
  const [modalEstado, setModalEstado] = useState(false)
  const [modalConsumo, setModalConsumo] = useState(false)

  const orden = ORDEN // En real: useApi(() => produccionAPI.obtenerOrden(id))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => navigate("/app/ordenes")} className="text-tm-muted text-sm hover:text-tm-gold flex items-center gap-1 mb-2">
            ← Volver a órdenes
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-tm-text font-mono">{orden.num}</h1>
            <Badge variante={orden.prioridad === "urgente" ? "red" : "orange"}>{orden.prioridad}</Badge>
            {orden.avance < 100 && new Date(orden.fecha_entrega) < new Date() && (
              <Badge variante="red">⚠️ Atrasado</Badge>
            )}
          </div>
          <div className="text-tm-muted text-sm mt-1">{orden.cliente} · {orden.producto}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm border border-tm-border" onClick={() => setModalConsumo(true)}>Registrar consumo</button>
          <button className="btn-gold text-sm" onClick={() => setModalEstado(true)}>Cambiar estado</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label:"Estado", value:orden.estado_general.replace(/_/g," "), color:"#C9963A" },
          { label:"Avance", value:orden.avance + "%", color: orden.avance >= 80 ? "#22C55E" : "#C9963A" },
          { label:"Costo real", value:fmt(orden.costo_real), color:"#3B82F6" },
          { label:"Ingreso", value:fmt(orden.ingreso_total), color:"#22C55E" },
          { label:"Margen", value:orden.margen_porcentaje + "%", color:"#22C55E" },
        ].map(k => (
          <div key={k.label} className="card py-3">
            <div className="text-lg font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-muted text-xs mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Info + Avance */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-tm-text text-sm">Progreso de producción</h3>
            <span className="text-tm-gold font-bold">{orden.avance}%</span>
          </div>
          <div className="h-2 bg-tm-border rounded-full overflow-hidden mb-4">
            <div className="h-full bg-tm-gold rounded-full transition-all" style={{ width: orden.avance + "%" }} />
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[["Creación", orden.fecha_creacion],["Entrega estimada", orden.fecha_entrega],["Responsable", orden.responsable]].map(([k,v]) => (
              <div key={k} className="bg-tm-surface rounded-lg p-2.5">
                <div className="text-tm-muted mb-0.5">{k}</div>
                <div className="text-tm-text font-medium">{v}</div>
              </div>
            ))}
          </div>
          {orden.observaciones && (
            <div className="mt-3 bg-tm-surface rounded-lg p-3">
              <div className="text-xs text-tm-muted mb-1">Observaciones</div>
              <div className="text-sm text-tm-text">{orden.observaciones}</div>
            </div>
          )}
        </div>
        <div className="card">
          <h3 className="font-semibold text-tm-text text-sm mb-3">Finanzas</h3>
          {[["Costo estimado", fmt(orden.costo_estimado), "text-tm-muted"],
            ["Costo real", fmt(orden.costo_real), "text-blue-400"],
            ["Ingreso total", fmt(orden.ingreso_total), "text-green-400"],
            ["Utilidad", fmt(orden.utilidad), "text-green-400 font-bold"],
            ["Margen", orden.margen_porcentaje + "%", "text-tm-gold font-bold"],
            ["Estado pago", orden.estado_pago, "text-tm-text"],
          ].map(([k,v,c]) => (
            <div key={k} className="flex justify-between text-xs border-b border-tm-border/50 py-1.5 last:border-0">
              <span className="text-tm-muted">{k}</span>
              <span className={c}>{v}</span>
            </div>
          ))}
          <div className="mt-3 pt-2 text-xs text-tm-muted">
            Código cliente: <span className="font-mono text-tm-gold">{orden.codigo_seguimiento}</span>
          </div>
        </div>
      </div>

      {/* Tabs detalle */}
      <div className="flex gap-1 border-b border-tm-border">
        {[["etapas","🔄 Etapas"],["materiales","📦 Materiales"],["historial","📋 Historial"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={clsx("px-4 py-2 text-sm font-medium border-b-2 transition-colors", {
              "border-tm-gold text-tm-gold": tab === v,
              "border-transparent text-tm-muted hover:text-tm-text": tab !== v
            })}>
            {l}
          </button>
        ))}
      </div>

      {/* Etapas timeline */}
      {tab === "etapas" && (
        <div className="space-y-2">
          {orden.etapas.map((e, i) => (
            <div key={e.etapa} className={clsx(
              "flex items-start gap-4 p-4 rounded-xl border transition-colors",
              e.estado === "completada" ? "border-green-500/20 bg-green-500/5" :
              e.estado === "iniciada" ? "border-tm-gold/30 bg-tm-gold/5" :
              "border-tm-border bg-tm-card/30"
            )}>
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5",
                e.estado === "completada" ? "bg-green-500 text-white" :
                e.estado === "iniciada" ? "bg-tm-gold text-tm-dark animate-pulse" :
                "bg-tm-border text-tm-muted"
              )}>
                {e.estado === "completada" ? "✓" : i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-tm-text">{e.etapa}</span>
                  <Badge variante={ESTADO_E[e.estado] || "gray"}>{e.estado}</Badge>
                  {e.estado === "iniciada" && <span className="text-tm-gold text-xs animate-pulse">● En curso</span>}
                </div>
                <div className="flex gap-4 text-xs text-tm-muted">
                  {e.responsable && <span>👤 {e.responsable}</span>}
                  {e.inicio && <span>▶ {e.inicio}</span>}
                  {e.fin && <span>✓ {e.fin}</span>}
                  {!e.inicio && !e.responsable && <span>Sin asignar</span>}
                </div>
              </div>
              {(e.estado === "iniciada" || e.estado === "pendiente") && (
                <div className="flex gap-2">
                  {e.estado === "pendiente" && <button className="btn-gold text-xs py-1 px-3">Iniciar</button>}
                  {e.estado === "iniciada" && <>
                    <button className="bg-green-500/20 border border-green-500/40 text-green-400 text-xs py-1 px-3 rounded-lg">Completar</button>
                    <button className="btn-ghost text-xs py-1 px-3 border border-tm-border">Pausar</button>
                  </>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Materiales */}
      {tab === "materiales" && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tm-border bg-tm-surface">
                {["Material","Lote","Reservado","Consumido","Pendiente","Costo total"].map(h => (
                  <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orden.materiales.map(m => {
                const pendiente = m.cantidad_reservada - m.cantidad_consumida
                return (
                  <tr key={m.material} className="border-b border-tm-border/50 hover:bg-tm-card/50">
                    <td className="px-4 py-3 text-tm-text font-medium text-sm">{m.material}</td>
                    <td className="px-4 py-3 font-mono text-tm-gold text-xs">{m.lote}</td>
                    <td className="px-4 py-3 text-tm-muted text-xs">{m.cantidad_reservada} {m.unidad}</td>
                    <td className="px-4 py-3 text-tm-text text-xs">{m.cantidad_consumida} {m.unidad}</td>
                    <td className="px-4 py-3">
                      <span className={clsx("text-xs font-medium", pendiente > 0 ? "text-orange-400" : "text-green-400")}>
                        {pendiente > 0 ? pendiente + " " + m.unidad : "✓ Completo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-tm-muted">{fmt(m.cantidad_consumida * m.costo)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Historial */}
      {tab === "historial" && (
        <div className="space-y-3">
          {orden.historial.map((h, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-tm-gold mt-1 flex-shrink-0" />
                {i < orden.historial.length - 1 && <div className="w-0.5 flex-1 bg-tm-border mt-1 min-h-8" />}
              </div>
              <div className="card flex-1 py-3 px-4">
                <div className="flex items-center justify-between mb-1">
                  <Badge variante="gold">{h.estado.replace(/_/g," ")}</Badge>
                  <span className="text-tm-muted text-xs">{h.fecha}</span>
                </div>
                <div className="text-tm-muted text-xs">Por: {h.usuario}</div>
                {h.obs && <div className="text-tm-text text-xs mt-1">{h.obs}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal cambiar estado */}
      <Modal open={modalEstado} onClose={() => setModalEstado(false)} title="Cambiar estado de la orden" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Nuevo estado</label>
            <select className="input-field text-sm">
              {["pedido_recibido","materiales_pendientes","materiales_preparados","en_produccion",
                "en_terminaciones","control_calidad","listo_despacho","despachado","instalado","cerrado","cancelado"].map(s => (
                <option key={s} value={s}>{s.replace(/_/g," ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Observación (opcional)</label>
            <textarea className="input-field text-sm resize-none h-20" placeholder="Motivo del cambio..." />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Aplicar cambio</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModalEstado(false)}>Cancelar</button>
        </div>
      </Modal>

      {/* Modal consumo */}
      <Modal open={modalConsumo} onClose={() => setModalConsumo(false)} title="Registrar consumo de material" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Material</label>
            <select className="input-field text-sm">
              {orden.materiales.map(m => <option key={m.material}>{m.material}</option>)}
            </select>
          </div>
          {[["etapa","Etapa actual","text"],["cantidad_consumida","Cantidad consumida","number"],
            ["merma","Merma/desperdicio","number"]].map(([k,l,t]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              <input className="input-field text-sm" type={t} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Registrar</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModalConsumo(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}