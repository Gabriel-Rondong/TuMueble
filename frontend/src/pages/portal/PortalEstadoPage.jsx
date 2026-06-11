import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { portalAPI } from '../../api/portal'
import clsx from 'clsx'

export default function PortalEstadoPage() {
  const { token } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    portalAPI.estadoOrden(token)
      .then(r => setData(r.data))
      .catch(() => setError('No pudimos cargar tu pedido. Verifica el enlace.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return (
    <div className="min-h-screen bg-tm-dark flex items-center justify-center">
      <div className="text-tm-gold animate-pulse font-display text-xl">Cargando tu pedido...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-tm-dark flex items-center justify-center">
      <div className="card text-center max-w-sm">
        <div className="text-4xl mb-3">😕</div>
        <p className="text-tm-text">{error}</p>
        <a href="/mi-pedido" className="btn-gold inline-block mt-4 text-sm">Volver a consultar</a>
      </div>
    </div>
  )

  const completados = data.timeline.filter(t => t.completado).length
  const total = data.timeline.length

  return (
    <div className="min-h-screen bg-tm-dark p-4"
         style={{backgroundImage:'radial-gradient(ellipse at 50% 0%, rgba(201,150,58,0.08) 0%, transparent 60%)'}}>
      <div className="max-w-lg mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-tm-gold font-display text-2xl font-bold">TuMueble</div>
          <p className="text-tm-muted text-sm mt-1">Estado de tu pedido</p>
        </div>

        {/* Card principal */}
        <div className="card mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-tm-muted text-xs uppercase tracking-wider mb-1">Orden</div>
              <div className="text-tm-gold font-mono font-bold text-lg">{data.numero_orden}</div>
              <div className="text-tm-text font-medium">{data.cliente_nombre}</div>
            </div>
            <div className="text-right">
              <div className="text-tm-muted text-xs">Entrega estimada</div>
              <div className="text-tm-text font-semibold">{data.fecha_entrega_estimada ? new Date(data.fecha_entrega_estimada).toLocaleDateString('es-CL', {day:'numeric',month:'long'}) : 'Por confirmar'}</div>
            </div>
          </div>

          {/* Producto */}
          <div className="bg-tm-surface rounded-lg p-3 mb-4">
            <div className="text-xs text-tm-muted mb-0.5">Producto</div>
            <div className="text-tm-text font-medium">{data.producto_nombre}</div>
          </div>

          {/* Estado actual */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-tm-gold animate-pulse flex-shrink-0" />
            <div>
              <div className="text-tm-muted text-xs">Estado actual</div>
              <div className="text-tm-gold font-semibold">{data.estado_visible}</div>
            </div>
          </div>

          {/* Barra de avance */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-tm-muted">Avance</span>
              <span className="text-tm-gold font-medium">{data.avance_porcentaje}%</span>
            </div>
            <div className="h-2 bg-tm-border rounded-full overflow-hidden">
              <div className="h-full bg-tm-gold rounded-full transition-all duration-700"
                   style={{ width: data.avance_porcentaje + '%' }} />
            </div>
          </div>
        </div>

        {/* Mensaje */}
        {data.mensaje && (
          <div className="card mb-4 bg-tm-gold/5 border-tm-gold/20">
            <div className="text-xs text-tm-gold font-medium mb-1 uppercase tracking-wider">📢 Actualización</div>
            <p className="text-tm-text text-sm">{data.mensaje}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="card">
          <h3 className="text-xs font-semibold text-tm-text mb-4 uppercase tracking-wider">
            Progreso — {completados} de {total} etapas
          </h3>
          <div className="space-y-0">
            {data.timeline.map((step, i) => (
              <div key={step.nombre} className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={clsx(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                    step.completado ? 'bg-tm-gold border-tm-gold text-tm-dark' : 'border-tm-border text-tm-muted'
                  )}>
                    {step.completado ? '✓' : i + 1}
                  </div>
                  {i < data.timeline.length - 1 && (
                    <div className={clsx('w-0.5 h-6 my-0.5', step.completado ? 'bg-tm-gold/50' : 'bg-tm-border')} />
                  )}
                </div>
                <div className={clsx('text-sm py-0.5', step.completado ? 'text-tm-text' : 'text-tm-muted')}>
                  {step.nombre}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-tm-muted text-xs mt-6">
          ¿Tienes dudas? Contáctanos · TuMueble
        </p>
      </div>
    </div>
  )
}