import { useState } from "react"
import Badge from "../../components/ui/Badge"
import { Table, Tr, Td } from "../../components/ui/Table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import clsx from "clsx"

const LOGS = [
  { id:1, empresa:"TuMueble SpA", usuario:"admin@tumueble.cl", modulo:"Órdenes", accion:"cambiar_estado", tabla:"ordenes_produccion", registro:"OP-01-00234", ip:"192.168.1.10", fecha:"2026-06-10 10:35:22" },
  { id:2, empresa:"TuMueble SpA", usuario:"ana@tumueble.cl", modulo:"Bodega", accion:"crear", tabla:"movimientos_bodega", registro:"MOV-0089", ip:"192.168.1.15", fecha:"2026-06-10 09:15:44" },
  { id:3, empresa:"Muebles del Sur", usuario:"admin@mueblesdelsur.cl", modulo:"Usuarios", accion:"crear", tabla:"usuarios", registro:"operario@mueblesdelsur.cl", ip:"10.0.0.5", fecha:"2026-06-10 08:50:11" },
  { id:4, empresa:"TuMueble SpA", usuario:"carlos@tumueble.cl", modulo:"Bodega", accion:"consumo", tabla:"movimiento_bodega_detalle", registro:"MOV-0088", ip:"192.168.1.12", fecha:"2026-06-09 16:45:30" },
  { id:5, empresa:"TuMueble SpA", usuario:"admin@tumueble.cl", modulo:"Producción", accion:"crear", tabla:"ordenes_produccion", registro:"OP-01-00239", ip:"192.168.1.10", fecha:"2026-06-09 11:20:05" },
  { id:6, empresa:"Muebles del Sur", usuario:"admin@mueblesdelsur.cl", modulo:"Clientes", accion:"editar", tabla:"clientes", registro:"CLI-0012", ip:"10.0.0.5", fecha:"2026-06-09 10:05:18" },
  { id:7, empresa:"TuMueble SpA", usuario:"mgt@tumueble.cl", modulo:"Reportes", accion:"exportar", tabla:null, registro:"Rentabilidad PDF", ip:"192.168.1.20", fecha:"2026-06-08 08:30:00" },
  { id:8, empresa:"TuMueble SpA", usuario:"admin@tumueble.cl", modulo:"Plataforma", accion:"login", tabla:"usuarios", registro:"admin@tumueble.cl", ip:"192.168.1.10", fecha:"2026-06-08 07:45:55" },
]

const actividad_dia = [
  { hora:"06:00", acciones:0 },{ hora:"07:00", acciones:3 },{ hora:"08:00", acciones:8 },
  { hora:"09:00", acciones:15 },{ hora:"10:00", acciones:22 },{ hora:"11:00", acciones:18 },
  { hora:"12:00", acciones:9 },{ hora:"13:00", acciones:5 },{ hora:"14:00", acciones:12 },
  { hora:"15:00", acciones:20 },{ hora:"16:00", acciones:17 },{ hora:"17:00", acciones:11 },
  { hora:"18:00", acciones:4 },{ hora:"19:00", acciones:1 },
]

const ACCION_V = {
  crear:"green", editar:"blue", eliminar:"red", cambiar_estado:"orange",
  consumo:"purple", exportar:"cyan", login:"gray", anular:"red", cerrar:"gray"
}

const MODULOS_FILTRO = ["Todos", "Órdenes", "Bodega", "Usuarios", "Producción", "Clientes", "Reportes", "Plataforma"]

export default function AuditoriaGlobalPage() {
  const [empresaFiltro, setEmpresaFiltro] = useState("")
  const [moduloFiltro, setModuloFiltro] = useState("Todos")
  const [fechaDesde, setFechaDesde] = useState("2026-06-01")

  const filtrados = LOGS.filter(l => {
    if (empresaFiltro && !l.empresa.toLowerCase().includes(empresaFiltro.toLowerCase())) return false
    if (moduloFiltro !== "Todos" && l.modulo !== moduloFiltro) return false
    return true
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Auditoría Global de Plataforma</h1>
          <p className="text-tm-muted text-sm mt-1">Historial completo de acciones en todas las empresas</p>
        </div>
        <button className="btn-gold text-sm">📊 Exportar logs</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"Acciones hoy", value:LOGS.filter(l => l.fecha.startsWith("2026-06-10")).length, color:"#C9963A", icon:"⚡" },
          { label:"Usuarios activos hoy", value:3, color:"#22C55E", icon:"👤" },
          { label:"Empresas con actividad", value:2, color:"#3B82F6", icon:"🏢" },
          { label:"Total logs (mes)", value:LOGS.length, color:"#8B5CF6", icon:"📋" },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="text-xl mb-2">{k.icon}</div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-text text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Gráfico actividad del día */}
      <div className="card">
        <h3 className="text-sm font-semibold text-tm-text mb-4">Actividad por hora — hoy</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={actividad_dia} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3240" vertical={false} />
            <XAxis dataKey="hora" tick={{ fill:"#7A8099", fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:"#7A8099", fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background:"#21252F", border:"1px solid #2D3240", borderRadius:8 }}
              labelStyle={{ color:"#E8EAF0" }}
            />
            <Bar dataKey="acciones" fill="#C9963A" radius={[4,4,0,0]} name="Acciones" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          placeholder="Filtrar por empresa..."
          className="input-field w-52 text-sm"
          value={empresaFiltro}
          onChange={e => setEmpresaFiltro(e.target.value)}
        />
        <div className="flex gap-1 flex-wrap">
          {MODULOS_FILTRO.map(m => (
            <button
              key={m}
              onClick={() => setModuloFiltro(m)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                moduloFiltro === m
                  ? "bg-tm-gold text-tm-dark"
                  : "bg-tm-surface text-tm-muted border border-tm-border hover:text-tm-text"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
            className="input-field text-xs w-36" />
        </div>
      </div>

      {/* Tabla logs */}
      <Table headers={["Empresa", "Usuario", "Módulo", "Acción", "Registro afectado", "IP", "Fecha y hora"]}>
        {filtrados.map(l => (
          <Tr key={l.id}>
            <Td>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-tm-gold/20 rounded flex items-center justify-center text-tm-gold text-xs font-bold flex-shrink-0">
                  {l.empresa[0]}
                </div>
                <span className="text-tm-text text-xs">{l.empresa}</span>
              </div>
            </Td>
            <Td><span className="text-tm-muted text-xs font-mono">{l.usuario}</span></Td>
            <Td><Badge variante="gray">{l.modulo}</Badge></Td>
            <Td><Badge variante={ACCION_V[l.accion] || "gray"}>{l.accion}</Badge></Td>
            <Td><span className="text-tm-muted text-xs">{l.registro || "—"}</span></Td>
            <Td><span className="text-tm-muted text-xs font-mono">{l.ip}</span></Td>
            <Td><span className="text-tm-muted text-xs">{l.fecha}</span></Td>
          </Tr>
        ))}
      </Table>
    </div>
  )
}