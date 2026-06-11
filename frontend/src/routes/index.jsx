import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import AuthLayout from '../components/layout/AuthLayout'

// Auth
import LoginPage from '../pages/auth/LoginPage'

// Empresa
import DashboardPage from '../pages/empresa/DashboardPage'
import ClientesPage from '../pages/empresa/ClientesPage'
import ProveedoresPage from '../pages/empresa/ProveedoresPage'
import MaterialesPage from '../pages/empresa/MaterialesPage'
import BodegaPage from '../pages/empresa/BodegaPage'
import ProductosPage from '../pages/empresa/ProductosPage'
import DocumentosPage from '../pages/empresa/DocumentosPage'
import UsuariosPage from '../pages/empresa/UsuariosPage'
import ReportesPage from '../pages/empresa/ReportesPage'
import AuditoriaPage from '../pages/empresa/AuditoriaPage'
import OperarioPage from '../pages/empresa/OperarioPage'
import CostosPage from '../pages/empresa/CostosPage'
import CalidadPage from '../pages/empresa/CalidadPage'
import ConfiguracionPage from '../pages/empresa/ConfiguracionPage'

// Producción
import OrdenesPage from '../pages/produccion/OrdenesPage'
import EstadoProductosPage from '../pages/produccion/EstadoProductosPage'
import OrdenDetallePage from '../pages/produccion/OrdenDetallePage'

// Platform (Superadmin)
import PlatformDashboard from '../pages/platform/PlatformDashboard'
import EmpresasPage from '../pages/platform/EmpresasPage'
import ModulosPage from '../pages/platform/ModulosPage'
import AdministradoresPage from '../pages/platform/AdministradoresPage'
import AuditoriaGlobalPage from '../pages/platform/AuditoriaGlobalPage'
import ConfiguracionPlataformaPage from '../pages/platform/ConfiguracionPlataformaPage'

// Portal cliente (público, sin login)
import PortalConsultaPage from '../pages/portal/PortalConsultaPage'
import PortalEstadoPage from '../pages/portal/PortalEstadoPage'

function RutaProtegida({ children, soloSuperAdmin = false }) {
  const { esAutenticado, cargando, esSuperAdmin } = useAuth()
  if (cargando) return (
    <div className="flex items-center justify-center h-screen bg-tm-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-tm-border border-t-tm-gold rounded-full animate-spin" />
        <div className="text-tm-gold font-display text-lg">TuMueble ERP</div>
      </div>
    </div>
  )
  if (!esAutenticado) return <Navigate to="/login" replace />
  if (soloSuperAdmin && !esSuperAdmin) return <Navigate to="/app/dashboard" replace />
  return children
}

function RouterContent() {
  return (
    <Routes>
      {/* ── Páginas públicas ────────────────────────────── */}
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />

      {/* Portal del cliente (100% público, sin auth) */}
      <Route path="/mi-pedido" element={<PortalConsultaPage />} />
      <Route path="/mi-pedido/:token" element={<PortalEstadoPage />} />

      {/* ── Panel Superadmin Plataforma ─────────────────── */}
      <Route path="/platform/*" element={
        <RutaProtegida soloSuperAdmin>
          <AppLayout tipo="platform">
            <Routes>
              <Route index                  element={<PlatformDashboard />} />
              <Route path="empresas"        element={<EmpresasPage />} />
              <Route path="modulos"         element={<ModulosPage />} />
              <Route path="administradores" element={<AdministradoresPage />} />
              <Route path="auditoria"       element={<AuditoriaGlobalPage />} />
              <Route path="configuracion"   element={<ConfiguracionPlataformaPage />} />
            </Routes>
          </AppLayout>
        </RutaProtegida>
      } />

      {/* ── ERP Empresa ─────────────────────────────────── */}
      <Route path="/app/*" element={
        <RutaProtegida>
          <AppLayout tipo="empresa">
            <Routes>
              <Route path="dashboard"         element={<DashboardPage />} />
              <Route path="estado-productos"  element={<EstadoProductosPage />} />
              <Route path="ordenes"           element={<OrdenesPage />} />
              <Route path="ordenes/:id"       element={<OrdenDetallePage />} />
              <Route path="clientes"          element={<ClientesPage />} />
              <Route path="proveedores"       element={<ProveedoresPage />} />
              <Route path="materiales"        element={<MaterialesPage />} />
              <Route path="bodega"            element={<BodegaPage />} />
              <Route path="productos"         element={<ProductosPage />} />
              <Route path="documentos"        element={<DocumentosPage />} />
              <Route path="costos"            element={<CostosPage />} />
              <Route path="calidad"           element={<CalidadPage />} />
              <Route path="usuarios"          element={<UsuariosPage />} />
              <Route path="reportes"          element={<ReportesPage />} />
              <Route path="auditoria"         element={<AuditoriaPage />} />
              <Route path="operario"          element={<OperarioPage />} />
              <Route path="configuracion"     element={<ConfiguracionPage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AppLayout>
        </RutaProtegida>
      } />

      {/* Redirecciones raíz */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouterContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
