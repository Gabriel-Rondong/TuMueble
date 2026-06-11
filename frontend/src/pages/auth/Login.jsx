import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login, esSuperadmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const user = await login(form.email, form.password);
      if (user.es_superusuario_plataforma) {
        navigate('/superadmin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0F0F0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Logo area */}
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪑</div>
          <div style={{
            fontSize: 32, fontWeight: 800, color: '#C8A45A',
            fontFamily: "'Georgia', serif", letterSpacing: '-1px'
          }}>
            TuMueble
          </div>
          <div style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>
            Sistema de Gestión ERP
          </div>
        </div>

        <div style={{
          background: '#1A1A1A', borderRadius: 16,
          border: '1px solid #2A2A2A', padding: 36,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ color: '#F5F5F5', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
            Iniciar Sesión
          </h2>

          {error && (
            <div style={{
              background: '#450A0A', border: '1px solid #DC2626', borderRadius: 8,
              padding: '10px 14px', color: '#FCA5A5', fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                Correo electrónico
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="usuario@empresa.cl"
                style={{
                  width: '100%', padding: '11px 14px', background: '#111',
                  border: '1px solid #333', borderRadius: 8, color: '#F5F5F5',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#C8A45A'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                Contraseña
              </label>
              <input
                type="password" required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '11px 14px', background: '#111',
                  border: '1px solid #333', borderRadius: 8, color: '#F5F5F5',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#C8A45A'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              style={{
                width: '100%', padding: '12px',
                background: cargando ? '#8B6914' : 'linear-gradient(135deg, #C8A45A, #A07C35)',
                border: 'none', borderRadius: 8, color: '#0F0F0F',
                fontWeight: 700, fontSize: 15, cursor: cargando ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cargando ? 'Ingresando...' : 'Ingresar al Sistema'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #2A2A2A', textAlign: 'center' }}>
            <a href="/pedido" style={{ color: '#C8A45A', fontSize: 13, textDecoration: 'none' }}>
              🔍 Consultar estado de mi pedido
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#4B5563', fontSize: 12, marginTop: 24 }}>
          TuMueble ERP v1.0 · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
