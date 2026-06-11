import { useState } from "react"
import Badge from "../../components/ui/Badge"
import Modal from "../../components/ui/Modal"
import { Table, Tr, Td } from "../../components/ui/Table"

const EMPRESAS = [
  { id:1, nombre:"TuMueble SpA", rut:"77.000.001-K", plan:"Profesional", estado:"activa", usuarios:8, ordenes:24, inicio:"2026-01-01", modulos:22 },
  { id:2, nombre:"Muebles del Sur Ltda", rut:"76.987.654-3", plan:"Básico", estado:"activa", usuarios:3, ordenes:7, inicio:"2026-03-15", modulos:14 },
  { id:3, nombre:"Carpintería Andina", rut:"12.345.678-9", plan:"Enterprise", estado:"inactiva", usuarios:0, ordenes:0, inicio:"2025-11-01", modulos:24 },
]

const MODULOS_SISTEMA = [
  { codigo:"dashboard", nombre:"Dashboard Gerencial", activo:true },
  { codigo:"produccion", nombre:"Órdenes de Producción", activo:true },
  { codigo:"bodega", nombre:"Bodega e Inventario", activo:true },
  { codigo:"productos", nombre:"Productos y BOM", activo:true },
  { codigo:"clientes", nombre:"Clientes", activo:true },
  { codigo:"proveedores", nombre:"Proveedores", activo:true },
  { codigo:"documentos", nombre:"Documentos y Facturas", activo:true },
  { codigo:"costos", nombre:"Costos e Ingresos", activo:true },
  { codigo:"reportes", nombre:"Reportes", activo:true },
  { codigo:"auditoria", nombre:"Auditoría", activo:true },
  { codigo:"calidad", nombre:"Control de Calidad", activo:false },
  { codigo:"portal_cliente", nombre:"Portal Cliente", activo:true },
]

const PLAN_V = { Básico:"blue", Profesional:"gold", Enterprise:"purple" }

export default function EmpresasPage() {
  const [modal, setModal] = useState(false)
  const [modalModulos, setModalModulos] = useState(null)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Empresas registradas</h1>
          <p className="text-tm-muted text-sm mt-1">{EMPRESAS.length} empresas · {EMPRESAS.filter(e=>e.estado==="activa").length} activas</p>
        </div>
        <button className="btn-gold text-sm" onClick={() => setModal(true)}>+ Nueva empresa</button>
      </div>

      <Table headers={["Empresa","RUT","Plan","Estado","Usuarios","Órdenes","Módulos","Inicio","Acciones"]}>
        {EMPRESAS.map(e => (
          <Tr key={e.id}>
            <Td>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-tm-gold/20 rounded-lg flex items-center justify-center text-tm-gold text-xs font-bold">{e.nombre[0]}</div>
                <span className="text-tm-text font-medium text-sm">{e.nombre}</span>
              </div>
            </Td>
            <Td><span className="font-mono text-tm-muted text-xs">{e.rut}</span></Td>
            <Td><Badge variante={PLAN_V[e.plan] || "gray"}>{e.plan}</Badge></Td>
            <Td><Badge variante={e.estado === "activa" ? "green" : "gray"}>{e.estado}</Badge></Td>
            <Td><span className="text-tm-text text-sm text-center block">{e.usuarios}</span></Td>
            <Td><span className="text-tm-text text-sm text-center block">{e.ordenes}</span></Td>
            <Td>
              <span className="text-tm-gold text-xs font-medium cursor-pointer hover:underline"
                onClick={() => setModalModulos(e)}>
                {e.modulos}/24 activos
              </span>
            </Td>
            <Td><span className="text-tm-muted text-xs">{e.inicio}</span></Td>
            <Td>
              <div className="flex gap-2">
                <button className="text-tm-gold text-xs hover:underline">Editar</button>
                <button className={e.estado === "activa" ? "text-red-400 text-xs hover:underline" : "text-green-400 text-xs hover:underline"}>
                  {e.estado === "activa" ? "Desactivar" : "Activar"}
                </button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {/* Modal nueva empresa */}
      <Modal open={modal} onClose={() => setModal(false)} title="Crear nueva empresa" size="md">
        <div className="space-y-3">
          {[["nombre","Nombre comercial"],["rut","RUT"],["razon_social","Razón social"],
            ["giro","Giro"],["email","Email"],["telefono","Teléfono"]].map(([k,l]) => (
            <div key={k}>
              <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
              <input className="input-field text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Plan</label>
            <select className="input-field text-sm">
              {["Básico","Profesional","Enterprise"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Email del administrador</label>
            <input className="input-field text-sm" type="email" placeholder="admin@empresa.cl" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="btn-gold flex-1 text-sm">Crear empresa</button>
          <button className="btn-ghost flex-1 text-sm border border-tm-border" onClick={() => setModal(false)}>Cancelar</button>
        </div>
      </Modal>

      {/* Modal módulos */}
      <Modal open={!!modalModulos} onClose={() => setModalModulos(null)} title={`Módulos — ${modalModulos?.nombre}`} size="md">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {MODULOS_SISTEMA.map(m => (
            <div key={m.codigo} className="flex items-center justify-between py-2 border-b border-tm-border/50">
              <span className="text-tm-text text-sm">{m.nombre}</span>
              <div className={`w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5 transition-colors ${m.activo ? "bg-tm-gold" : "bg-tm-border"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${m.activo ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </div>
          ))}
        </div>
        <button className="btn-gold w-full mt-4 text-sm">Guardar configuración</button>
      </Modal>
    </div>
  )
}