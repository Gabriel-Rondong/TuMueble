import Badge from '../../components/ui/Badge'
import { Table, Tr, Td } from '../../components/ui/Table'

const LOGS = [
  { id:1, usuario:'admin@tumueble.cl', modulo:'Órdenes', accion:'cambiar_estado', tabla:'ordenes_produccion', registro:'OP-01-00234', antes:'en_produccion', despues:'control_calidad', fecha:'2026-06-10 10:35', ip:'192.168.1.10' },
  { id:2, usuario:'ana@tumueble.cl', modulo:'Bodega', accion:'crear', tabla:'movimientos_bodega', registro:'MOV-0089', antes:null, despues:'entrada: 20 pla Melamina', fecha:'2026-06-10 09:15', ip:'192.168.1.15' },
  { id:3, usuario:'carlos@tumueble.cl', modulo:'Bodega', accion:'consumo', tabla:'movimiento_bodega_detalle', registro:'MOV-0088', antes:null, despues:'salida: 5 un Bisagra', fecha:'2026-06-09 16:45', ip:'192.168.1.12' },
  { id:4, usuario:'admin@tumueble.cl', modulo:'Usuarios', accion:'crear', tabla:'usuarios', registro:'jorge@tumueble.cl', antes:null, despues:'Nuevo usuario creado', fecha:'2026-06-08 11:00', ip:'192.168.1.10' },
  { id:5, usuario:'mgt@tumueble.cl', modulo:'Reportes', accion:'exportar', tabla:null, registro:'Rentabilidad mensual PDF', antes:null, despues:null, fecha:'2026-06-07 08:30', ip:'192.168.1.20' },
]

const ACCION_V = { crear:'green', editar:'blue', eliminar:'red', cambiar_estado:'orange', consumo:'purple', exportar:'cyan', anular:'red' }

export default function AuditoriaPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Auditoría y Logs</h1>
          <p className="text-tm-muted text-sm mt-1">Historial completo de acciones del sistema</p>
        </div>
        <button className="btn-gold text-sm">📊 Exportar logs</button>
      </div>

      <Table headers={['Usuario','Módulo','Acción','Registro','Antes → Después','IP','Fecha']}>
        {LOGS.map(l => (
          <Tr key={l.id}>
            <Td><span className="text-tm-text text-xs font-mono">{l.usuario}</span></Td>
            <Td><Badge variante="gray">{l.modulo}</Badge></Td>
            <Td><Badge variante={ACCION_V[l.accion] || 'gray'}>{l.accion}</Badge></Td>
            <Td><span className="text-tm-muted text-xs">{l.registro}</span></Td>
            <Td>
              <div className="text-xs">
                {l.antes && <span className="text-red-400 line-through">{l.antes}</span>}
                {l.antes && l.despues && <span className="text-tm-muted mx-1">→</span>}
                {l.despues && <span className="text-green-400">{l.despues}</span>}
                {!l.antes && !l.despues && <span className="text-tm-muted">—</span>}
              </div>
            </Td>
            <Td><span className="text-tm-muted text-xs font-mono">{l.ip}</span></Td>
            <Td><span className="text-tm-muted text-xs">{l.fecha}</span></Td>
          </Tr>
        ))}
      </Table>
    </div>
  )
}