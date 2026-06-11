import { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { portalAPI } from "../../api/portal"
import clsx from "clsx"

// Datos demo para previsualizar sin backend
const DEMO_DATA = {
  "demo-token-00234": {
    numero_orden: "OP-01-00234",
    cliente_nombre: "María González",
    producto_nombre: "Closet 3 Cuerpos Corredera",
    estado_visible: "En fabricación",
    avance_porcentaje: 65,
    fecha_entrega_estimada: "2026-06-20",
    mensaje: "Tu mueble está en la etapa de enchapado. Avanzamos según lo planificado y estará listo en la fecha estimada.",
    imagen_publica: null,
    timeline: [
      { nombre:"Pedido recibido", orden:1, completado:true, fecha:"20 mayo" },
      { nombre:"Materiales en preparación", orden:2, completado:true, fecha:"20 mayo" },
      { nombre:"En fabricación", orden:3, completado:true, activo:true, fecha:"21 mayo" },
      { nombre:"En terminaciones", orden:4, completado:false, fecha:null },
      { nombre:"En revisión de calidad", orden:5, completado:false, fecha:null },
      { nombre:"Listo para despacho", orden:6, completado:false, fecha:null },
      { nombre:"Entregado", orden:7, completado:false, fecha:null },
    ]
  },
  "demo-token-00236": {
    numero_orden: "OP-01-00236",
    cliente_nombre: "Hotel Andes",
    producto_nombre: "Mesa Comedor 10 personas",
    estado_visible: "En revisión de calidad",
    avance_porcentaje: 90,
    fecha_entrega_estimada: "2026-06-12",
    mensaje: "Tu mesa completó todas las etapas de fabricación exitosamente. Actualmente está siendo revisada por nuestro equipo de calidad.",
    imagen_publica: null,
    timeline: [
      { nombre:"Pedido recibido", orden:1, completado:true, fecha:"10 mayo" },
      { nombre:"Materiales en preparación", orden:2, completado:true, fecha:"11 mayo" },
      { nombre:"En fabricación", orden:3, completado:true, fecha:"12 mayo" },
      { nombre:"En terminaciones", orden:4, completado:true, fecha:"5 jun" },
      { nombre:"En revisión de calidad", orden:5, completado:true, activo:true, fecha:"9 jun" },
      { nombre:"Listo para despacho", orden:6, completado:false, fecha:null },
      { nombre:"Entregado", orden:7, completado:false, fecha:null },
    ]
  }
}

export default function PortalEstadoPage() {
  const { token } = useParams()
  const location = useLocation()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Intentar datos de demo primero (pasados por estado de navegación)
    const demoFromNav = location.state?.demoData
    if (demoFromNav) {
      setData(demoFromNav)
      setLoading(false)
      return
    }

    // Demo por token conocido
    if (DEMO_DATA[token]) {
      setData(DEMO_DATA[token])
      setLoading(false)
      return
    }

    // Llamada real al API
    portalAPI.estadoOrden(token)
      .then(r => setData(r.data))
      .catch(() => setError("No pudimos cargar tu pedido. Verifica el enlace o vuelve a consultar."))
      .finally(() => setLoading(false))
  }, [token, location.state])

  if (loading) return (
    <div className="min-h-screen bg-tm-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-tm-border border-t-tm-gold rounded-full animate-spin" />
        <div className="text-tm-gold font-display text-xl animate-pulse">Cargando tu pedido...</div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-tm-dark flex items-center justify-center p-4">
      <div className="card text-center max-w-sm w-full">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-tm-text font-bold text-lg mb-2">Pedido no encontrado</h2>
        <p className="text-tm-muted text-sm mb-6">{error}</p>
        <Link to="/mi-pedido" className="btn-gold inline-block text-sm">
          ← Volver a consultar
        </Link>
      </div>
    </div>
  )

  const completados = data.timeline.filter(t => t.completado).length
  const total = data.timeline.length
  const etapaActiva = data.timeline.find(t => t.activo)
  const entregado = data.avance_porcentaje >= 100

  return (
    <div
      className="min-h-screen bg-tm-dark py-8 px-4"
      style={{ backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(201,150,58,0.08) 0%, transparent 60%)" }}
    >
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-tm-gold/15 border border-tm-gold/30 rounded-lg flex items-center justify-center">
              <span className="text-tm-gold font-display font-bold text-sm">TM</span>
            </div>
            <span className="text-tm-gold font-display font-bold text-xl">TuMueble</span>
          </div>
          <p className="text-tm-muted text-sm">Estado de tu pedido</p>
        </div>

        {/* Card principal de estado */}
        <div className="card mb-4 border-tm-gold/20">
          {/* Info del pedido */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-tm-muted text-xs uppercase tracking-wider mb-1">N° de orden</div>
              <div className="text-tm-gold font-mono font-bold text-xl">{data.numero_orden}</div>
              <div className="text-tm-text font-semibold mt-0.5">{data.cliente_nombre}</div>
            </div>
            <div className="text-right">
              <div className="text-tm-muted text-xs mb-1">Entrega estimada</div>
              <div className="text-tm-text font-bold">
                {data.fecha_entrega_estimada
                  ? new Date(data.fecha_entrega_estimada).toLocaleDateString("es-CL", { day:"numeric", month:"long" })
                  : "Por confirmar"
                }
              </div>
            </div>
          </div>

          {/* Producto */}
          <div className="bg-tm-surface rounded-xl p-3 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-tm-gold/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🪑</div>
            <div>
              <div className="text-xs text-tm-muted">Tu producto</div>
              <div className="text-tm-text font-semibold text-sm">{data.producto_nombre}</div>
            </div>
          </div>

          {/* Estado actual con ícono */}
          <div className={clsx(
            "rounded-xl p-4 mb-5 flex items-center gap-4",
            entregado ? "bg-green-500/10 border border-green-500/20" : "bg-tm-gold/8 border border-tm-gold/20"
          )}>
            <div className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0",
              entregado ? "bg-green-500/20" : "bg-tm-gold/20"
            )}>
              {entregado ? "✅" : "🏭"}
            </div>
            <div>
              <div className="text-xs text-tm-muted mb-0.5">Estado actual</div>
              <div className={clsx("font-bold text-base", entregado ? "text-green-400" : "text-tm-gold")}>
                {data.estado_visible}
              </div>
            </div>
            {!entregado && (
              <div className="ml-auto flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className={clsx("w-1.5 h-1.5 rounded-full bg-tm-gold", i === 0 ? "animate-bounce" : i === 1 ? "animate-bounce delay-75" : "animate-bounce delay-150")} />
                ))}
              </div>
            )}
          </div>

          {/* Barra de progreso */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-tm-muted text-xs">Progreso general</span>
              <span className={clsx("font-bold text-sm", entregado ? "text-green-400" : "text-tm-gold")}>
                {data.avance_porcentaje}%
              </span>
            </div>
            <div className="h-3 bg-tm-border rounded-full overflow-hidden">
              <div
                className={clsx("h-full rounded-full transition-all duration-1000", entregado ? "bg-green-500" : "bg-tm-gold")}
                style={{ width: data.avance_porcentaje + "%" }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-tm-muted text-xs">Recibido</span>
              <span className="text-tm-muted text-xs">Entregado</span>
            </div>
          </div>
        </div>

        {/* Mensaje de actualización */}
        {data.mensaje && (
          <div className="card mb-4 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0 mt-0.5">📢</div>
              <div>
                <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">Última actualización</div>
                <p className="text-tm-text text-sm leading-relaxed">{data.mensaje}</p>
              </div>
            </div>
          </div>
        )}

        {/* Imagen pública si existe */}
        {data.imagen_publica && (
          <div className="card mb-4 p-3">
            <div className="text-xs text-tm-muted mb-2">📸 Foto de avance</div>
            <img src={data.imagen_publica} alt="Avance del producto" className="w-full rounded-lg object-cover max-h-64" />
          </div>
        )}

        {/* Timeline visual */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-tm-text">Línea de tiempo</h3>
            <span className="text-tm-muted text-xs bg-tm-surface rounded-full px-2 py-0.5">
              {completados} de {total} etapas
            </span>
          </div>

          <div className="space-y-0">
            {data.timeline.map((step, i) => {
              const esActiva = step.activo
              const esFutura = !step.completado && !step.activo

              return (
                <div key={step.nombre} className="flex items-start gap-3 group">
                  {/* Indicador */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={clsx(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all",
                      step.completado ? "bg-tm-gold border-tm-gold text-tm-dark" :
                      esActiva ? "border-tm-gold bg-tm-gold/20 text-tm-gold" :
                      "border-tm-border bg-tm-surface text-tm-muted"
                    )}>
                      {step.completado ? "✓" : esActiva ? (
                        <div className="w-2 h-2 rounded-full bg-tm-gold animate-pulse" />
                      ) : i + 1}
                    </div>
                    {i < data.timeline.length - 1 && (
                      <div className={clsx("w-0.5 h-8 my-1 transition-colors",
                        step.completado ? "bg-tm-gold/50" : "bg-tm-border"
                      )} />
                    )}
                  </div>

                  {/* Contenido */}
                  <div className={clsx("flex-1 pb-0 pt-1 flex justify-between items-start",
                    i < data.timeline.length - 1 ? "mb-0" : ""
                  )}>
                    <div>
                      <div className={clsx("text-sm font-medium",
                        step.completado ? "text-tm-text" :
                        esActiva ? "text-tm-gold" :
                        "text-tm-muted"
                      )}>
                        {step.nombre}
                        {esActiva && (
                          <span className="ml-2 text-xs bg-tm-gold/15 text-tm-gold rounded-full px-2 py-0.5 font-normal">
                            En curso
                          </span>
                        )}
                      </div>
                      {step.fecha && (
                        <div className="text-xs text-tm-muted mt-0.5">{step.fecha}</div>
                      )}
                    </div>
                    {step.completado && !esActiva && (
                      <span className="text-green-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 space-y-3">
          <Link
            to="/mi-pedido"
            className="flex items-center justify-center gap-2 text-tm-muted text-sm hover:text-tm-gold transition-colors"
          >
            ← Consultar otro pedido
          </Link>
          <p className="text-center text-tm-muted text-xs">
            ¿Preguntas sobre tu pedido? Escríbenos a{" "}
            <a href="mailto:contacto@tumueble.cl" className="text-tm-gold hover:underline">
              contacto@tumueble.cl
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}