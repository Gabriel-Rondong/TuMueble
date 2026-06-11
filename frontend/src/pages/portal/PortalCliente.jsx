import { useState } from 'react';
import api from '../../api/axios';

const ESTADOS_TIMELINE = [
  'Pedido recibido',
  'Materiales en preparación',
  'En fabricación',
  'En terminaciones',
  'En revisión de calidad',
  'Listo para despacho',
  'Entregado',
];

export default function PortalCliente() {
  const [form, setForm] = useState({ numero_orden: '', rut: '', token: '' });
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [modo, setModo] = useState('orden'); // 'orden' | 'token'

  const consultar = async (e) => {
    e.preventDefault();
    setError(''); setCargando(true);
    try {
      const payload = modo === 'token'
        ? { token: form.token }
        : { numero_orden: form.numero_orden, rut: form.rut };
      const { data: acceso } = await api.post('/cliente/consultar-orden/', payload);
      const { data } = await api.get(`/cliente/orden/${acceso.token}/estado/`);
      setPedido(data);
    } catch (err) {
      setError(err.response?.data?.error || 'No se encontró ningún pedido con esos datos.');
    } finally {
      setCargando(false);
    }
  };

  const estadoIndex = pedido
    ? ESTADOS_TIMELINE.findIndex(e =>
        pedido.estado_actual?.toLowerCase().includes(e.split(' ')[1]?.toLowerCase() || '') ||
        e.toLowerCase() === pedido.estado_actual?.toLowerCase()
      )
    : -1;

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🪑</div>
          <div style={{ color: '#C8A45A', fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 800 }}>TuMueble</div>
          <div style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>Consulta el estado de tu pedido</div>
        </div>

        {!pedido ? (
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 16, padding: 32 }}>
            {/* Modo selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {[['orden', '📋 N° de Orden + RUT'], ['token', '🔑 Código privado']].map(([m, label]) => (
                <button key={m} onClick={() => setModo(m)} style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  background: modo === m ? '#1F1A10' : '#0F0F0F',
                  border: modo === m ? '1px solid #C8A45A' : '1px solid #222',
                  color: modo === m ? '#C8A45A' : '#6B7280',
                  fontSize: 13, fontWeight: modo === m ? 700 : 400, cursor: 'pointer',
                }}>{label}</button>
              ))}
            </div>

            {error && (
              <div style={{ background: '#450A0A', border: '1px solid #DC2626', borderRadius: 8, padding: '10px 14px', color: '#FCA5A5', fontSize: 13, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <form onSubmit={consultar}>
              {modo === 'orden' ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, marginBottom: 6 }}>N° de Orden</label>
                    <input value={form.numero_orden} onChange={e => setForm({ ...form, numero_orden: e.target.value })}
                      placeholder="ej: OP-2024-001" required
                      style={{ width: '100%', padding: '11px 14px', background: '#111', border: '1px solid #333', borderRadius: 8, color: '#F5F5F5', fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, marginBottom: 6 }}>RUT del cliente</label>
                    <input value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })}
                      placeholder="ej: 12.345.678-9" required
                      style={{ width: '100%', padding: '11px 14px', background: '#111', border: '1px solid #333', borderRadius: 8, color: '#F5F5F5', fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                </>
              ) : (
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: '#9CA3AF', fontSize: 13, marginBottom: 6 }}>Código de seguimiento</label>
                  <input value={form.token} onChange={e => setForm({ ...form, token: e.target.value })}
                    placeholder="Código recibido por email" required
                    style={{ width: '100%', padding: '11px 14px', background: '#111', border: '1px solid #333', borderRadius: 8, color: '#F5F5F5', fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              )}

              <button type="submit" disabled={cargando} style={{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #C8A45A, #A07C35)',
                border: 'none', borderRadius: 8, color: '#0A0A0A',
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
              }}>
                {cargando ? 'Buscando...' : '🔍 Consultar mi pedido'}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <a href="/login" style={{ color: '#4B5563', fontSize: 12 }}>¿Eres del equipo? → Iniciar sesión</a>
            </div>
          </div>
        ) : (
          <div>
            {/* Resultado */}
            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 16, padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ color: '#C8A45A', fontWeight: 800, fontSize: 18 }}>{pedido.numero_orden}</div>
                  <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 2 }}>{pedido.cliente_nombre}</div>
                </div>
                <button onClick={() => setPedido(null)} style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 6, color: '#9CA3AF', padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>
                  ← Nueva consulta
                </button>
              </div>

              <div style={{ background: '#0F0F0F', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>PRODUCTO</div>
                <div style={{ color: '#F5F5F5', fontSize: 16, fontWeight: 700 }}>{pedido.producto_nombre}</div>
                <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>Estado: {pedido.estado_actual}</div>
                <div style={{ color: pedido.esta_atrasada ? '#FCA5A5' : '#9CA3AF', fontSize: 13 }}>
                  {pedido.esta_atrasada ? '⚠️ ' : '📅 '}Entrega estimada: {pedido.fecha_entrega_estimada}
                </div>
              </div>

              {/* Barra de avance */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#9CA3AF', fontSize: 13 }}>Avance general</span>
                  <span style={{ color: '#C8A45A', fontWeight: 700 }}>{pedido.avance_porcentaje}%</span>
                </div>
                <div style={{ height: 10, background: '#1F1F1F', borderRadius: 5 }}>
                  <div style={{ width: `${pedido.avance_porcentaje}%`, height: '100%', background: 'linear-gradient(90deg, #C8A45A, #A07C35)', borderRadius: 5, transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Línea de tiempo</div>
                {ESTADOS_TIMELINE.map((estado, i) => {
                  const completado = i <= estadoIndex;
                  const actual = i === estadoIndex;
                  return (
                    <div key={estado} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          background: actual ? '#C8A45A' : completado ? '#16A34A' : '#1F1F1F',
                          border: actual ? '3px solid #A07C35' : completado ? '2px solid #15803D' : '2px solid #333',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10,
                        }}>
                          {completado && !actual ? '✓' : actual ? '●' : ''}
                        </div>
                        {i < ESTADOS_TIMELINE.length - 1 && (
                          <div style={{ width: 2, height: 20, background: completado ? '#16A34A' : '#222', marginTop: 2 }} />
                        )}
                      </div>
                      <div style={{ paddingTop: 1 }}>
                        <div style={{ color: actual ? '#C8A45A' : completado ? '#D1D5DB' : '#4B5563', fontSize: 14, fontWeight: actual ? 700 : 400 }}>
                          {estado}
                          {actual && <span style={{ color: '#C8A45A', fontSize: 11, marginLeft: 6 }}>← aquí</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Historial de mensajes */}
            {pedido.historial?.length > 0 && (
              <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: 20 }}>
                <div style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Actualizaciones</div>
                {pedido.historial.map((h, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < pedido.historial.length - 1 ? '1px solid #1A1A1A' : 'none' }}>
                    <div style={{ color: '#C8A45A', fontSize: 12, fontWeight: 600 }}>{h.estado}</div>
                    <div style={{ color: '#D1D5DB', fontSize: 13, marginTop: 2 }}>{h.mensaje}</div>
                    <div style={{ color: '#4B5563', fontSize: 11, marginTop: 2 }}>{new Date(h.fecha).toLocaleDateString('es-CL')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
