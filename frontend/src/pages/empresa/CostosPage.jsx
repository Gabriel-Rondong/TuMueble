import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import Badge from "../../components/ui/Badge"
import Modal from "../../components/ui/Modal"
import { Table, Tr, Td } from "../../components/ui/Table"
import clsx from "clsx"

const TABS = ["Resumen", "Costos por orden", "Ingresos por orden", "Saldos pendientes"]
const fmt = v => "$" + Number(Math.round(v)).toLocaleString("es-CL")

const ORDENES_COSTOS = [
  { id:1, num:"OP-01-00234", cliente:"María González", producto:"Closet 3 Cuerpos", ingreso:1200000, costo_est:680000, costo_real:712000, utilidad:488000, margen:40.7, estado_pago:"pagado" },
  { id:2, num:"OP-01-00235", cliente:"Constructora Andina", producto:"Cocina Integral", ingreso:3500000, costo_est:1900000, costo_real:0, utilidad:0, margen:0, estado_pago:"parcial" },
  { id:3, num:"OP-01-00236", cliente:"Hotel Andes", producto:"Mesa Comedor", ingreso:890000, costo_est:420000, costo_real:435000, utilidad:455000, margen:51.1, estado_pago:"pendiente" },
  { id:4, num:"OP-01-00237", cliente:"Familia Soto", producto:"Velador Flotante", ingreso:280000, costo_est:130000, costo_real:128000, utilidad:152000, margen:54.3, estado_pago:"pagado" },
  { id:5, num:"OP-01-00238", cliente:"Clínica Santa María", producto:"Archivero 4 Cajones", ingreso:950000, costo_est:480000, costo_real:465000, utilidad:485000, margen:51.1, estado_pago:"pendiente" },
]

const COSTOS_DETALLE = [
  { tipo:"material", desc:"Melamina Blanca 18mm x4 pla", monto:114000, fecha:"2026-06-01" },
  { tipo:"material", desc:"Bisagras y herrajes varios", monto:48000, fecha:"2026-06-01" },
  { tipo:"mano_obra", desc:"Mano de obra corte y armado", monto:320000, fecha:"2026-06-03" },
  { tipo:"embalaje", desc:"Embalaje y protección", monto:35000, fecha:"2026-06-05" },
  { tipo:"transporte", desc:"Despacho a domicilio", monto:45000, fecha:"2026-06-08" },
]

const INGRESOS_DETALLE = [
  { tipo:"anticipo", desc:"Anticipo 50% al confirmar", monto:600000, metodo:"transferencia", fecha:"2026-05-20" },
  { tipo:"pago_total", desc:"Saldo al entregar", monto:600000, metodo:"transferencia", fecha:"2026-06-08" },
]

const TIPO_COSTO_COLOR = { material:"blue", mano_obra:"purple", embalaje:"cyan", transporte:"orange", servicio_externo:"gray", otro:"gray" }
const TIPO_INGRESO_COLOR = { anticipo:"gold", pago_total:"green", abono:"blue" }
const PAGO_V = { pendiente:"orange", parcial:"blue", pagado:"green", vencido:"red" }

const chartData = [
  { nombre:"Ingresos totales", valor:6820000, color:"#C9963A" },
  { nombre:"Costos totales", valor:3940000, color:"#3B82F6" },
  { nombre:"Utilidad neta", valor:2880000, color:"#22C55E" },
]

export default function CostosPage() {
  const [tab, setTab] = useState(0)
  const [ordenSel, setOrdenSel] = useState(null)
  const [modalCosto, setModalCosto] = useState(false)
  const [modalIngreso, setModalIngreso] = useState(false)

  const orden = ORDENES_COSTOS.find(o => o.id === ordenSel)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Costos e Ingresos</h1>
          <p className="text-tm-muted text-sm mt-1">Rentabilidad real por orden de producción</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm border border-tm-border" onClick={() => setModalCosto(true)}>+ Registrar costo</button>
          <button className="btn-gold text-sm" onClick={() => setModalIngreso(true)}>+ Registrar ingreso</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"Ingresos totales", value:fmt(6820000), color:"#C9963A", icon:"💵" },
          { label:"Costos totales", value:fmt(3940000), color:"#3B82F6", icon:"📊" },
          { label:"Utilidad neta", value:fmt(2880000), color:"#22C55E", icon:"💰" },
          { label:"Margen promedio", value:"42.2%", color:"#22C55E", icon:"📈" },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="text-xl mb-2">{k.icon}</div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-text text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
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

      {/* Resumen con gráfico */}
      {tab === 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold text-tm-text text-sm mb-4">Resumen financiero general</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} layout="vertical" barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3240" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#7A8099", fontSize:11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => "$" + (v/1000000).toFixed(1) + "M"} />
                <YAxis type="category" dataKey="nombre" width={130} tick={{ fill:"#E8EAF0", fontSize:12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:"#21252F", border:"1px solid #2D3240", borderRadius:8 }}
                  formatter={v => fmt(v)} />
                <Bar dataKey="valor" radius={[0,6,6,0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.nombre} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="font-semibold text-tm-text text-sm mb-4">Distribución de costos por tipo</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[
                  { name:"Materiales", value:65, fill:"#3B82F6" },
                  { name:"Mano de obra", value:25, fill:"#8B5CF6" },
                  { name:"Transporte", value:5, fill:"#F97316" },
                  { name:"Otros", value:5, fill:"#64748B" },
                ]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {[{ fill:"#3B82F6" },{ fill:"#8B5CF6" },{ fill:"#F97316" },{ fill:"#64748B" }].map((c,i) => (
                    <Cell key={i} fill={c.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background:"#21252F", border:"1px solid #2D3240", borderRadius:8 }}
                  formatter={v => v + "%"} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              {[["#3B82F6","Materiales 65%"],["#8B5CF6","Mano de obra 25%"],["#F97316","Transporte 5%"],["#64748B","Otros 5%"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:c }} />
                  <span className="text-tm-muted">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Costos por orden */}
      {tab === 1 && (
        <div className="flex gap-4">
          <div className={clsx("transition-all", ordenSel ? "w-3/5" : "w-full")}>
            <Table headers={["Orden","Cliente / Producto","Costo est.","Costo real","Ingreso","Utilidad","Margen","Estado pago"]}>
              {ORDENES_COSTOS.map(o => (
                <Tr key={o.id} onClick={() => setOrdenSel(ordenSel === o.id ? null : o.id)}
                  className={ordenSel === o.id ? "bg-tm-gold/5 border-l-2 border-l-tm-gold" : ""}>
                  <Td><span className="font-mono text-tm-gold text-xs">{o.num}</span></Td>
                  <Td>
                    <div className="text-tm-text text-sm font-medium">{o.cliente}</div>
                    <div className="text-tm-muted text-xs">{o.producto}</div>
                  </Td>
                  <Td><span className="font-mono text-xs text-tm-muted">{fmt(o.costo_est)}</span></Td>
                  <Td>
                    <span className={clsx("font-mono text-xs", o.costo_real > o.costo_est ? "text-red-400" : o.costo_real > 0 ? "text-green-400" : "text-tm-muted")}>
                      {o.costo_real > 0 ? fmt(o.costo_real) : "—"}
                    </span>
                  </Td>
                  <Td><span className="font-mono text-xs text-tm-text">{fmt(o.ingreso)}</span></Td>
                  <Td>
                    <span className={clsx("font-mono text-sm font-semibold", o.utilidad > 0 ? "text-green-400" : o.utilidad < 0 ? "text-red-400" : "text-tm-muted")}>
                      {o.utilidad > 0 ? fmt(o.utilidad) : "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className={clsx("font-semibold text-sm", o.margen > 30 ? "text-green-400" : o.margen > 15 ? "text-tm-gold" : o.margen > 0 ? "text-orange-400" : "text-tm-muted")}>
                      {o.margen > 0 ? o.margen + "%" : "—"}
                    </span>
                  </Td>
                  <Td><Badge variante={PAGO_V[o.estado_pago]}>{o.estado_pago}</Badge></Td>
                </Tr>
              ))}
            </Table>
          </div>
          {orden && (
            <div className="w-2/5 space-y-4">
              <div className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-mono text-tm-gold text-sm">{orden.num}</div>
                    <div className="text-tm-text font-bold">{orden.producto}</div>
                    <div className="text-tm-muted text-xs">{orden.cliente}</div>
                  </div>
                  <button onClick={() => setOrdenSel(null)} className="text-tm-muted hover:text-tm-text">✕</button>
                </div>
                <div className="space-y-2 text-sm">
                  {[["Ingreso total", fmt(orden.ingreso), "text-tm-text"],
                    ["Costo estimado", fmt(orden.costo_est), "text-tm-muted"],
                    ["Costo real", orden.costo_real > 0 ? fmt(orden.costo_real) : "—", orden.costo_real > orden.costo_est ? "text-red-400" : "text-green-400"],
                    ["Utilidad", orden.utilidad > 0 ? fmt(orden.utilidad) : "—", "text-green-400"],
                    ["Margen", orden.margen > 0 ? orden.margen + "%" : "—", "text-tm-gold font-bold"],
                  ].map(([k,v,c]) => (
                    <div key={k} className="flex justify-between border-b border-tm-border/50 pb-2">
                      <span className="text-tm-muted">{k}</span>
                      <span className={clsx("font-mono font-medium", c)}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-xs font-semibold text-tm-muted mb-3 uppercase tracking-wider">Desglose de costos</h3>
                {COSTOS_DETALLE.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-tm-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Badge variante={TIPO_COSTO_COLOR[c.tipo] || "gray"}>{c.tipo}</Badge>
                      <span className="text-xs text-tm-text">{c.desc}</span>
                    </div>
                    <span className="font-mono text-xs text-tm-text">{fmt(c.monto)}</span>
                  </div>
                ))}
              </div>
              <div className="card">
                <h3 className="text-xs font-semibold text-tm-muted mb-3 uppercase tracking-wider">Ingresos recibidos</h3>
                {INGRESOS_DETALLE.map((ing, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-tm-border/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Badge variante={TIPO_INGRESO_COLOR[ing.tipo] || "gray"}>{ing.tipo}</Badge>
                      <span className="text-xs text-tm-text">{ing.desc}</span>
                    </div>
                    <span className="font-mono text-xs text-green-400">+{fmt(ing.monto)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ingresos por orden */}
      {tab === 2 && (
        <Table headers={["Orden","Cliente","Ingreso total","Recibido","Saldo","Método","Estado"]}>
          {ORDENES_COSTOS.map(o => {
            const recibido = o.estado_pago === "pagado" ? o.ingreso : o.estado_pago === "parcial" ? o.ingreso * 0.5 : 0
            const saldo = o.ingreso - recibido
            return (
              <Tr key={o.id}>
                <Td><span className="font-mono text-tm-gold text-xs">{o.num}</span></Td>
                <Td><span className="text-tm-text text-sm">{o.cliente}</span></Td>
                <Td><span className="font-mono text-sm text-tm-text">{fmt(o.ingreso)}</span></Td>
                <Td><span className="font-mono text-sm text-green-400">{fmt(recibido)}</span></Td>
                <Td>
                  <span className={clsx("font-mono text-sm font-semibold", saldo > 0 ? "text-orange-400" : "text-green-400")}>
                    {saldo > 0 ? fmt(saldo) : "✓ Pagado"}
                  </span>
                </Td>
                <Td><span className="text-tm-muted text-xs">Transferencia</span></Td>
                <Td><Badge variante={PAGO_V[o.estado_pago]}>{o.estado_pago}</Badge></Td>
              </Tr>
            )
          })}
        </Table>
      )}

      {/* Saldos pendientes */}
      {tab === 3 && (
        <div className="space-y-4">
          <div className="card bg-orange-500/5 border-orange-500/20">
            <div className="text-orange-400 font-semibold mb-1">Total saldos pendientes</div>
            <div className="text-3xl font-bold text-orange-400">
              {fmt(ORDENES_COSTOS.filter(o => o.estado_pago !== "pagado").reduce((s, o) => s + (o.ingreso - (o.estado_pago === "parcial" ? o.ingreso * 0.5 : 0)), 0))}
            </div>
          </div>
          <Table headers={["Orden","Cliente","Producto","Total","Saldo","Vence","Estado"]}>
            {ORDENES_COSTOS.filter(o => o.estado_pago !== "pagado").map(o => (
              <Tr key={o.id}>
                <Td><span className="font-mono text-tm-gold text-xs">{o.num}</span></Td>
                <Td><span className="text-tm-text text-sm">{o.cliente}</span></Td>
                <Td><span className="text-tm-muted text-xs">{o.producto}</span></Td>
                <Td><span className="font-mono text-sm text-tm-text">{fmt(o.ingreso)}</span></Td>
                <Td><span className="font-mono text-sm font-bold text-orange-400">{fmt(o.ingreso * (o.estado_pago === "parcial" ? 0.5 : 1))}</span></Td>
                <Td><span className="text-tm-muted text-xs">30 días</span></Td>
                <Td><Badge variante={PAGO_V[o.estado_pago]}>{o.estado_pago}</Badge></Td>
              </Tr>
            ))}
          </Table>
        </div>
      )}

      {/* Modales */}
      <Modal open={modalCosto} onClose={() => setModalCosto(false)} title="Registrar Costo" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Orden de producción</label>
            <select className="input-field text-sm">
              {ORDENES_COSTOS.map(o => <option key={o.id}>{o.num} — {o.cliente}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Tipo de costo</label>
            <select className="input-field text-sm">
              {["material","mano_obra","servicio_externo","transporte","embalaje","instalacion","otro"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Descripción</label>
            <input className="input-field text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Monto (CLP)</label>
              <input className="input-field text-sm" type="number" />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Fecha</label>
              <input className="input-field text-sm" type="date" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Guardar costo</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModalCosto(false)}>Cancelar</button>
        </div>
      </Modal>

      <Modal open={modalIngreso} onClose={() => setModalIngreso(false)} title="Registrar Ingreso / Pago" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Orden</label>
            <select className="input-field text-sm">
              {ORDENES_COSTOS.map(o => <option key={o.id}>{o.num} — {o.cliente}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Tipo</label>
            <select className="input-field text-sm">
              {["anticipo","abono","pago_total","otro"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Método de pago</label>
            <select className="input-field text-sm">
              {["transferencia","efectivo","cheque","tarjeta"].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Monto (CLP)</label>
              <input className="input-field text-sm" type="number" />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Fecha</label>
              <input className="input-field text-sm" type="date" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Registrar pago</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModalIngreso(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  )
}