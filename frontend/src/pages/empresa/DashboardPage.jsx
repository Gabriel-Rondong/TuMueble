import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { reportesAPI } from "../../api/reportes"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from "recharts"
import StatsBar from "../../components/ui/StatsBar"
import Badge from "../../components/ui/Badge"
import { LoadingPage } from "../../components/ui/Spinner"
import clsx from "clsx"

const ESTADOS_COLOR = {
  pedido_recibido:"#64748B", materiales_pendientes:"#F59E0B",
  materiales_preparados:"#3B82F6", en_produccion:"#8B5CF6",
  en_terminaciones:"#F97316", control_calidad:"#06B6D4",
  listo_despacho:"#22C55E", despachado:"#10B981",
}

const ESTADO_LABEL = {
  pedido_recibido:"Pedido recibido", materiales_pendientes:"Mat. pendientes",
  materiales_preparados:"Mat. preparados", en_produccion:"En producción",
  en_terminaciones:"En terminaciones", control_calidad:"Control calidad",
  listo_despacho:"Listo despacho", despachado:"Despachado",
}

const DEMO_KPI = {
  ordenes_activas:24, ordenes_atrasadas:3, ingresos_mes:18400000,
  costos_mes:10200000, utilidad_mes:8200000, margen_mes:44.6,
  ingresos_año:89500000, stock_critico_count:4, merma_mes_kg:12.3,
  no_conformidades_abiertas:2, ordenes_cerradas_mes:8,
  ordenes_por_estado:[
    { estado_general:"en_produccion", total:10 },
    { estado_general:"en_terminaciones", total:5 },
    { estado_general:"control_calidad", total:3 },
    { estado_general:"listo_despacho", total:4 },
    { estado_general:"materiales_preparados", total:2 },
  ],
  top_productos:[
    { producto__nombre:"Closet Corredera", total:12 },
    { producto__nombre:"Cocina Integral", total:8 },
    { producto__nombre:"Mesa Comedor", total:6 },
    { producto__nombre:"Archivero", total:5 },
    { producto__nombre:"Velador Flotante", total:3 },
  ]
}

const EVOLUCION_DEMO = [
  { mes:"Ene", ingresos:12.4, costos:7.1, utilidad:5.3 },
  { mes:"Feb", ingresos:14.1, costos:8.2, utilidad:5.9 },
  { mes:"Mar", ingresos:11.8, costos:7.0, utilidad:4.8 },
  { mes:"Abr", ingresos:16.3, costos:9.1, utilidad:7.2 },
  { mes:"May", ingresos:15.7, costos:8.8, utilidad:6.9 },
  { mes:"Jun", ingresos:18.4, costos:10.2, utilidad:8.2 },
]

const ATRASADAS_DEMO = [
  { numero_orden:"OP-01-00234", cliente:"María González", producto:"Closet 3 Cuerpos", dias_restantes:-3, prioridad:"urgente" },
  { numero_orden:"OP-01-00228", cliente:"Constructora Andina", producto:"Cocina Integral", dias_restantes:-1, prioridad:"alta" },
  { numero_orden:"OP-01-00219", cliente:"Hotel Andes", producto:"Mesa 10 pax", dias_restantes:-5, prioridad:"urgente" },
]

const fmt = v => "$" + (v >= 1000000 ? (v/1000000).toFixed(1) + "M" : Number(v).toLocaleString("es-CL"))

export default function DashboardPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [kpi, setKpi] = useState(DEMO_KPI)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setCargando(true)
    reportesAPI.dashboardGerencial()
      .then(r => setKpi(r.data))
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [])

  const pieData = (kpi.ordenes_por_estado || []).map(e => ({
    name: ESTADO_LABEL[e.estado_general] || e.estado_general,
    value: e.total,
    fill: ESTADOS_COLOR[e.estado_general] || "#64748B",
  }))

  const hoy = new Date().toLocaleDateString("es-CL", { weekday:"long", day:"numeric", month:"long" })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">
            Buenos días, {usuario?.nombre} 👋
          </h1>
          <p className="text-tm-muted text-sm mt-1 capitalize">{hoy}</p>
        </div>
        <div className="flex gap-2">
          {error && (
            <div className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
              ⚠ Datos de demostración (backend offline)
            </div>
          )}
          <button className="btn-gold text-sm" onClick={() => navigate("/app/ordenes/nueva")}>
            + Nueva Orden
          </button>
        </div>
      </div>

      {/* KPIs */}
      <StatsBar stats={[
        { label:"Órdenes activas", value:kpi.ordenes_activas, icon:"📋", color:"#C9963A", sub:"en producción ahora" },
        { label:"Órdenes atrasadas", value:kpi.ordenes_atrasadas, icon:"⚠️", color:"#EF4444", sub:"requieren atención" },
        { label:"Ingresos del mes", value:fmt(kpi.ingresos_mes), icon:"💵", color:"#22C55E", sub:"+12% vs mes anterior", trend:12 },
        { label:"Utilidad del mes", value:fmt(kpi.utilidad_mes), icon:"💰", color:"#22C55E", sub:`Margen ${kpi.margen_mes}%`, trend:8 },
        { label:"NC abiertas", value:kpi.no_conformidades_abiertas, icon:"🚨", color:kpi.no_conformidades_abiertas > 3 ? "#EF4444" : "#F97316", sub:"no conformidades" },
      ]} />

      {/* Gráficos principales */}
      <div className="grid grid-cols-3 gap-4">
        {/* Evolución ingresos/utilidad */}
        <div className="card col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-tm-text text-sm">Ingresos y Utilidad — 6 meses (CLP millones)</h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-tm-gold inline-block"/>Ingresos</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-green-500 inline-block"/>Utilidad</span>
              <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-blue-500 inline-block"/>Costos</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={EVOLUCION_DEMO}>
              <defs>
                <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9963A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C9963A" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradUtilidad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3240" />
              <XAxis dataKey="mes" tick={{ fill:"#7A8099", fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#7A8099", fontSize:12 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:"#21252F", border:"1px solid #2D3240", borderRadius:8 }}
                formatter={(v, n) => [`$${v}M`, n === "ingresos" ? "Ingresos" : n === "utilidad" ? "Utilidad" : "Costos"]}/>
              <Area type="monotone" dataKey="ingresos" stroke="#C9963A" fill="url(#gradIngresos)" strokeWidth={2}/>
              <Area type="monotone" dataKey="utilidad" stroke="#22C55E" fill="url(#gradUtilidad)" strokeWidth={2}/>
              <Line type="monotone" dataKey="costos" stroke="#3B82F6" strokeWidth={2} dot={false} strokeDasharray="4 2"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Órdenes por estado */}
        <div className="card">
          <h3 className="font-semibold text-tm-text text-sm mb-3">Órdenes activas por estado</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" stroke="none">
                {pieData.map((e, i) => <Cell key={i} fill={e.fill}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:"#21252F", border:"1px solid #2D3240", borderRadius:8 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background:e.fill }}/>
                  <span className="text-tm-muted">{e.name}</span>
                </div>
                <span className="text-tm-text font-semibold">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-3 gap-4">
        {/* Órdenes atrasadas */}
        <div className="card col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-tm-text text-sm">⚠️ Órdenes Atrasadas</h3>
            <button onClick={() => navigate("/app/ordenes")} className="text-tm-gold text-xs hover:underline">
              Ver todas →
            </button>
          </div>
          {ATRASADAS_DEMO.length === 0 ? (
            <div className="text-center py-8 text-tm-muted text-sm">✓ No hay órdenes atrasadas</div>
          ) : (
            <div className="space-y-2">
              {ATRASADAS_DEMO.map(o => (
                <div
                  key={o.numero_orden}
                  onClick={() => navigate("/app/ordenes")}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-tm-surface cursor-pointer transition-colors border border-transparent hover:border-tm-border"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-tm-gold text-xs">{o.numero_orden}</span>
                      <Badge variante={o.prioridad === "urgente" ? "red" : "orange"}>{o.prioridad}</Badge>
                    </div>
                    <div className="text-tm-text text-xs mt-0.5">{o.cliente} · {o.producto}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold text-sm">{o.dias_restantes} días</div>
                    <div className="text-tm-muted text-xs">vencida</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top productos */}
        <div className="card">
          <h3 className="font-semibold text-tm-text text-sm mb-4">🏆 Más producidos</h3>
          <div className="space-y-3">
            {(kpi.top_productos || []).map((p, i) => {
              const maxVal = Math.max(...(kpi.top_productos || []).map(x => x.total))
              return (
                <div key={p.producto__nombre}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-tm-text truncate max-w-[130px]">{p.producto__nombre}</span>
                    <span className="text-tm-gold font-semibold">{p.total}</span>
                  </div>
                  <div className="h-1.5 bg-tm-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-tm-gold transition-all"
                      style={{ width: `${(p.total / maxVal) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"Stock crítico", value:kpi.stock_critico_count + " materiales", color:"#EF4444", icon:"📦", link:"/app/bodega" },
          { label:"Órdenes cerradas (mes)", value:kpi.ordenes_cerradas_mes, color:"#22C55E", icon:"✅", link:"/app/ordenes" },
          { label:"Merma acumulada", value:kpi.merma_mes_kg + " kg", color:"#F97316", icon:"♻️", link:"/app/reportes" },
          { label:"Ingresos año", value:fmt(kpi.ingresos_año), color:"#C9963A", icon:"📈", link:"/app/costos" },
        ].map(k => (
          <div
            key={k.label}
            onClick={() => navigate(k.link)}
            className="card cursor-pointer hover:border-tm-gold/30 transition-colors group"
          >
            <div className="text-xl mb-2">{k.icon}</div>
            <div className="text-xl font-bold group-hover:scale-105 transition-transform" style={{ color:k.color }}>{k.value}</div>
            <div className="text-tm-muted text-xs mt-1">{k.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}