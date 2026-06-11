import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard, Package, ClipboardList, CheckSquare,
  Users, Building2, Boxes, FileText, BarChart3, LogOut,
  ShoppingCart, Truck, Settings, Globe, Wrench, Shield,
  DollarSign, AlertTriangle
} from 'lucide-react'
import clsx from 'clsx'

const menuEmpresa = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/app/dashboard' },
  { label: 'Estado de Productos', icon: CheckSquare, to: '/app/estado-productos' },
  { label: 'Órdenes de Producción', icon: ClipboardList, to: '/app/ordenes' },
  { sep: true },
  { label: 'Bodega', icon: Boxes, to: '/app/bodega' },
  { label: 'Materiales', icon: Package, to: '/app/materiales' },
  { label: 'Productos / BOM', icon: ShoppingCart, to: '/app/productos' },
  { sep: true },
  { label: 'Clientes', icon: Users, to: '/app/clientes' },
  { label: 'Proveedores', icon: Truck, to: '/app/proveedores' },
  { label: 'Documentos', icon: FileText, to: '/app/documentos' },
  { label: 'Costos e Ingresos', icon: DollarSign, to: '/app/costos' },
  { sep: true },
  { label: 'Calidad / NC', icon: AlertTriangle, to: '/app/calidad' },
  { label: 'Reportes', icon: BarChart3, to: '/app/reportes' },
  { label: 'Auditoría', icon: Shield, to: '/app/auditoria' },
  { label: 'Usuarios', icon: Users, to: '/app/usuarios' },
  { sep: true },
  { label: 'Vista Operario', icon: Wrench, to: '/app/operario' },
  { label: 'Configuración', icon: Settings, to: '/app/configuracion' },
]

const menuPlatform = [
  { label: 'Panel de Plataforma', icon: Globe, to: '/platform' },
  { label: 'Empresas', icon: Building2, to: '/platform/empresas' },
  { label: 'Módulos', icon: Package, to: '/platform/modulos' },
  { label: 'Administradores', icon: Users, to: '/platform/administradores' },
  { label: 'Auditoría Global', icon: Shield, to: '/platform/auditoria' },
  { label: 'Configuración', icon: Settings, to: '/platform/configuracion' },
]

export default function Sidebar({ tipo }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const menu = tipo === 'platform' ? menuPlatform : menuEmpresa

  return (
    <aside className="w-60 h-screen bg-tm-surface border-r border-tm-border flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-tm-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-tm-gold rounded-xl flex items-center justify-center text-tm-dark font-bold flex-shrink-0">
            <span className="font-display text-sm">TM</span>
          </div>
          <div>
            <div className="text-tm-gold font-display font-bold text-base leading-tight">TuMueble</div>
            <div className="text-tm-muted text-[10px] uppercase tracking-wider">
              {tipo === 'platform' ? 'Plataforma SaaS' : 'ERP Productivo'}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {menu.map((item, i) => {
          if (item.sep) return <div key={i} className="my-1.5 border-t border-tm-border/40" />
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to}
              end={item.to === '/app/dashboard' || item.to === '/platform'}
              className={({ isActive }) => clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-tm-gold/15 text-tm-gold border border-tm-gold/25'
                  : 'text-tm-muted hover:text-tm-text hover:bg-tm-card'
              )}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-2.5 border-t border-tm-border">
        <div className="flex items-center gap-2 px-2 py-2 mb-1 rounded-lg">
          <div className="w-7 h-7 bg-tm-gold/20 rounded-full flex items-center justify-center text-tm-gold text-xs font-bold flex-shrink-0">
            {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-tm-text truncate">{usuario?.nombre} {usuario?.apellido}</div>
            <div className="text-[10px] text-tm-muted truncate">{usuario?.email}</div>
          </div>
        </div>
        <button
          onClick={async () => { await logout(); navigate('/login') }}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-tm-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg text-xs transition-all">
          <LogOut size={12} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
