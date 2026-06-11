import { useState } from "react"
import Badge from "../../components/ui/Badge"
import Modal from "../../components/ui/Modal"
import { Table, Tr, Td } from "../../components/ui/Table"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import clsx from "clsx"

const NC_DATA = [
  { id:1, orden:"OP-01-00234", producto:"Closet 3 Cuerpos", etapa:"Enchapado", tipo:"defecto_material", gravedad:"alta", desc:"Canto PVC despegado en costado lateral", estado:"en_proceso", costo:25000, proveedor:"Maderas del Sur SpA", fecha:"2026-06-08" },
  { id:2, orden:"OP-01-00232", producto:"Cocina Modular", etapa:"Corte", tipo:"error_proceso", gravedad:"media", desc:"Dimensiones de cajón incorrecto — error de medición", estado:"resuelta", costo:0, proveedor:null, fecha:"2026-06-05" },
  { id:3, orden:"OP-01-00230", producto:"Mesa Comedor", etapa:"Barnizado", tipo:"error_proceso", gravedad:"baja", desc:"Manchas de barniz en superficie", estado:"cerrada", costo:8000, proveedor:null, fecha:"2026-06-01" },
  { id:4, orden:"OP-01-00229", producto:"Velador Flotante", etapa:"Control de Calidad", tipo:"defecto_material", gravedad:"media", desc:"Tablero MDF con humedad, superficie deformada", estado:"registrada", costo:18900, proveedor:"Melaminas Andinas SA", fecha:"2026-05-28" },
  { id:5, orden:"OP-01-00228", producto:"Archivero", etapa:"Armado", tipo:"error_proceso", gravedad:"critica", desc:"Estructura fuera de escuadra — reproceso total", estado:"en_proceso", costo:120000, proveedor:null, fecha:"2026-05-25" },
]

const GRAVEDAD_V = { baja:"green", media:"orange", alta:"red", critica:"red" }
const ESTADO_V = { registrada:"orange", en_proceso:"blue", resuelta:"green", cerrada:"gray" }
const fmt = v => "$" + Number(v).toLocaleString("es-CL")

const porGravedad = [
  { name:"Crítica", value:1, fill:"#EF4444" },
  { name:"Alta", value:1, fill:"#F97316" },
  { name:"Media", value:2, fill:"#F59E0B" },
  { name:"Baja", value:1, fill:"#22C55E" },
]

const porEtapa = [
  { etapa:"Enchapado", total:2 },
  { etapa:"Corte", total:1 },
  { etapa:"Barnizado", total:1 },
  { etapa:"Armado", total:1 },
]

export default function CalidadPage() {
  const [modal, setModal] = useState(false)
  const [detalle, setDetalle] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState("")

  const filtradas = NC_DATA.filter(nc => !filtroEstado || nc.estado === filtroEstado)
  const nc = NC_DATA.find(n => n.id === detalle)
  const costoTotal = NC_DATA.reduce((s, n) => s + n.costo, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Control de Calidad</h1>
          <p className="text-tm-muted text-sm mt-1">{NC_DATA.length} no conformidades · Costo total: <span className="text-red-400">{fmt(costoTotal)}</span></p>
        </div>
        <div className="flex gap-3">
          <select className="input-field w-44 text-sm" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {["registrada","en_proceso","resuelta","cerrada"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-gold text-sm" onClick={() => setModal(true)}>+ Nueva NC</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"Abiertas", value:NC_DATA.filter(n => ["registrada","en_proceso"].includes(n.estado)).length, color:"#F97316", icon:"🚨" },
          { label:"Críticas/Altas", value:NC_DATA.filter(n => ["critica","alta"].includes(n.gravedad)).length, color:"#EF4444", icon:"⚠️" },
          { label:"Resueltas", value:NC_DATA.filter(n => ["resuelta","cerrada"].includes(n.estado)).length, color:"#22C55E", icon:"✅" },
          { label:"Costo total NC", value:fmt(costoTotal), color:"#C9963A", icon:"💸" },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="text-xl mb-2">{k.icon}</div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-text text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-tm-text mb-4">NC por etapa productiva</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={porEtapa} layout="vertical" barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3240" horizontal={false} />
              <XAxis type="number" tick={{ fill:"#7A8099", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="etapa" width={90} tick={{ fill:"#E8EAF0", fontSize:12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:"#21252F", border:"1px solid #2D3240", borderRadius:8 }} />
              <Bar dataKey="total" fill="#EF4444" radius={[0,6,6,0]} name="No conformidades" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-tm-text mb-4">Distribución por gravedad</h3>
          <div className="space-y-3">
            {porGravedad.map(g => (
              <div key={g.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-tm-text">{g.name}</span>
                  <span style={{ color: g.fill }} className="font-bold">{g.value}</span>
                </div>
                <div className="h-2 bg-tm-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: (g.value / NC_DATA.length * 100) + "%", background: g.fill }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla NC */}
      <div className="flex gap-4">
        <div className={clsx("transition-all", detalle ? "w-3/5" : "w-full")}>
          <Table headers={["Orden","Producto","Etapa","Tipo","Gravedad","Proveedor","Costo","Estado","Fecha"]}>
            {filtradas.map(nc => (
              <Tr key={nc.id} onClick={() => setDetalle(detalle === nc.id ? null : nc.id)}
                className={detalle === nc.id ? "bg-tm-gold/5 border-l-2 border-l-tm-gold" : ""}>
                <Td><span className="font-mono text-tm-gold text-xs">{nc.orden}</span></Td>
                <Td><span className="text-tm-text text-xs">{nc.producto}</span></Td>
                <Td><span className="text-tm-muted text-xs">{nc.etapa}</span></Td>
                <Td><Badge variante="gray">{nc.tipo.replace("_"," ")}</Badge></Td>
                <Td><Badge variante={GRAVEDAD_V[nc.gravedad]}>{nc.gravedad}</Badge></Td>
                <Td><span className="text-tm-muted text-xs">{nc.proveedor || "—"}</span></Td>
                <Td><span className={clsx("font-mono text-xs", nc.costo > 0 ? "text-red-400" : "text-tm-muted")}>{nc.costo > 0 ? fmt(nc.costo) : "—"}</span></Td>
                <Td><Badge variante={ESTADO_V[nc.estado]}>{nc.estado.replace("_"," ")}</Badge></Td>
                <Td><span className="text-tm-muted text-xs">{nc.fecha}</span></Td>
              </Tr>
            ))}
          </Table>
        </div>

        {nc && (
          <div className="w-2/5">
            <div className="card space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-tm-gold text-sm">{nc.orden}</div>
                  <div className="text-tm-text font-bold">{nc.producto}</div>
                </div>
                <button onClick={() => setDetalle(null)} className="text-tm-muted hover:text-tm-text">✕</button>
              </div>
              <div className="flex gap-2">
                <Badge variante={GRAVEDAD_V[nc.gravedad]}>Gravedad: {nc.gravedad}</Badge>
                <Badge variante={ESTADO_V[nc.estado]}>{nc.estado}</Badge>
              </div>
              <div className="bg-tm-surface rounded-lg p-3">
                <div className="text-xs text-tm-muted mb-1">Descripción del problema</div>
                <div className="text-sm text-tm-text">{nc.desc}</div>
              </div>
              {[["Etapa", nc.etapa], ["Tipo", nc.tipo], ["Proveedor", nc.proveedor || "N/A"],
                ["Costo asociado", nc.costo > 0 ? fmt(nc.costo) : "Sin costo"], ["Fecha", nc.fecha]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-xs border-b border-tm-border/50 pb-2">
                  <span className="text-tm-muted">{k}</span>
                  <span className="text-tm-text">{v}</span>
                </div>
              ))}
              <div>
                <div className="text-xs text-tm-muted mb-1">Acción correctiva</div>
                <textarea className="input-field text-xs resize-none h-16" placeholder="Describir la acción tomada..." />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-gold text-xs py-2">Marcar resuelta</button>
                <button className="btn-ghost text-xs py-2 border border-tm-border">Ver orden</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nueva No Conformidad" size="md">
        <div className="space-y-3">
          {[["orden","Orden de producción"],["descripcion","Descripción del problema"]].map(([k,l]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              {k === "descripcion" ? <textarea className="input-field text-sm resize-none h-20" /> : <input className="input-field text-sm" />}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {[["tipo","Tipo",["defecto_material","error_proceso","daño_transporte","rechazo_cliente","otro"]],
              ["gravedad","Gravedad",["baja","media","alta","critica"]]].map(([k,l,opts]) => (
              <div key={k}>
                <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
                <select className="input-field text-sm">{opts.map(o => <option key={o}>{o}</option>)}</select>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Costo asociado (CLP)</label>
              <input className="input-field text-sm" type="number" defaultValue="0" />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Etapa</label>
              <select className="input-field text-sm">
                {["Dimensionado","Corte","Enchapado","Mecanizado","Armado","Barnizado","Control calidad"].map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Registrar NC</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModal(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}