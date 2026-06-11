import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

const KPICard = ({ label, value, sub, color = '#C8A45A', icon }) => (
  <div style={{
    background: '#141414', border: '1px solid #222',
    borderRadius: 12, padding: '20px 22px',
    borderTop: `3px solid ${color}`,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{label}</div>
        <div style={{ color: '#F5F5F5', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ color: '#4B5563', fontSize: 12, marginTop: 6 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 24, opacity: 0.7 }}>{icon}</div>
    </div>
  </div>
);

const EstadoBadge = ({ estado }) => {
  const map = {
    'en_produccion': { label: 'En Producción', color: '#2563EB', bg: '#1E3A5F' },
    'control_calidad': { label: 'Control Calidad', color: '#7C3AED', bg: '#3B1F5E' },
    'listo_despacho': { label: 'Listo', color: '#16A34A', bg: '#14532D' },
    'pedido_recibido': { label: 'Recibido', color: '#D97706', bg: '#78350F' },
    'materiales_pendientes': { label: 'Mat. Pendientes', color: '#DC2626', bg: '#450A0A' },
  };
  const cfg = map[estado] || { label: estado, color: '#6B7280', bg: '#1F2937' };
  return (
    <span style={{
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40`,
      borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 600,
    }}>{cfg.label}</span>
  );
};

export default function Dashboard() {
  const { usuario } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // En producción esto viene de /api/dashboard/gerencial/
    setCargando(false);
    setOrdenes([
      { id: 1, numero_orden: 'OP-2024-001', cliente: 'Juan Pérez', producto: 'Cocina Modular 3m', estado: 'en_produccion', avance: 65, fecha_entrega_estimada: '2024-08-15', prioridad: 'alta', atrasada: false },
      { id: 2, numero_orden: 'OP-2024-002', cliente: 'María González', producto: 'Closet Empotrado', estado: 'control_calidad', avance: 90, fecha_entrega_estimada: '2024-08-10', prioridad: 'urgente', atrasada: true },
      { id: 3, numero_orden: 'OP-2024-003', cliente: 'Constructora XYZ', producto: 'Escritorio Gerencial', estado: 'listo_despacho', avance: 100, fecha_entrega_estimada: '2024-08-20', prioridad: 'normal', atrasada: false },
    ]);
  }, []);

  return (
    <div style={{ color: '#F5F5F5', fontFamily: "'Inter', system-ui" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 4 }}>
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F5F5F5', margin: 0 }}>
          Bienvenido, {usuario?.nombre} 👋
        </h1>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <KPICard label="Órdenes Activas" value="12" sub="3 atrasadas" color="#C8A45A" icon="🏭" />
        <KPICard label="Ventas del Mes" value="$4.2M" sub="+18% vs mes anterior" color="#16A34A" icon="💰" />
        <KPICard label="Stock Crítico" value="3" sub="materiales bajo mínimo" color="#DC2626" icon="⚠️" />
        <KPICard label="Listo Despacho" value="5" sub="productos terminados" color="#2563EB" icon="📦" />
      </div>

      {/* Órdenes en curso */}
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#F5F5F5' }}>Órdenes en Producción</h2>
          <a href="/ordenes" style={{ color: '#C8A45A', fontSize: 13, textDecoration: 'none' }}>Ver todas →</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0F0F0F' }}>
              {['N° Orden', 'Cliente', 'Producto', 'Estado', 'Avance', 'Entrega', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', color: '#6B7280', fontSize: 12, fontWeight: 600, textAlign: 'left', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o, i) => (
              <tr key={o.id} style={{ borderTop: '1px solid #1A1A1A', background: i % 2 === 0 ? 'transparent' : '#0D0D0D' }}>
                <td style={{ padding: '12px 16px', color: '#C8A45A', fontWeight: 600, fontSize: 13 }}>{o.numero_orden}</td>
                <td style={{ padding: '12px 16px', color: '#D1D5DB', fontSize: 13 }}>{o.cliente}</td>
                <td style={{ padding: '12px 16px', color: '#E5E7EB', fontSize: 13 }}>{o.producto}</td>
                <td style={{ padding: '12px 16px' }}><EstadoBadge estado={o.estado} /></td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#1F1F1F', borderRadius: 3 }}>
                      <div style={{ width: `${o.avance}%`, height: '100%', background: o.avance >= 90 ? '#16A34A' : '#C8A45A', borderRadius: 3 }} />
                    </div>
                    <span style={{ color: '#9CA3AF', fontSize: 12, minWidth: 32 }}>{o.avance}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: o.atrasada ? '#FCA5A5' : '#9CA3AF', fontSize: 13 }}>
                  {o.atrasada && '⚠️ '}{o.fecha_entrega_estimada}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <a href={`/ordenes/${o.id}`} style={{ color: '#C8A45A', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>Ver →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alertas de stock */}
      <div style={{ background: '#1A0A0A', border: '1px solid #450A0A', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ color: '#FCA5A5', fontWeight: 700, marginBottom: 10, fontSize: 14 }}>⚠️ Alertas de Stock Crítico</div>
        {['Cantos PVC blanco (2.3 mt disponibles — mínimo 10 mt)', 'Bisagras 35mm (8 un — mínimo 50 un)', 'Barniz satinado (0.8 lt — mínimo 5 lt)'].map(alerta => (
          <div key={alerta} style={{ color: '#F87171', fontSize: 13, padding: '4px 0', borderBottom: '1px solid #2A1A1A' }}>• {alerta}</div>
        ))}
      </div>
    </div>
  );
}
