import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, soloSuperadmin = false }) {
  const { estaAutenticado, esSuperadmin, cargando } = useAuth();
  if (cargando) return (
    <div style={{ minHeight: '100vh', background: '#0F0F0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#C8A45A', fontSize: 16 }}>Cargando...</div>
    </div>
  );
  if (!estaAutenticado) return <Navigate to="/login" replace />;
  if (soloSuperadmin && !esSuperadmin) return <Navigate to="/dashboard" replace />;
  return children;
}
