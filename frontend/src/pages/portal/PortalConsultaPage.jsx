import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { portalAPI } from "../../api/portal"

// Datos de demo para previsualizar sin backend
const DEMO_ORDENES = {
  "OP-01-00234": {
    token: "demo-token-00234",
    numero_orden: "OP-01-00234",
    cliente_nombre: "María González",
    producto_nombre: "Closet 3 Cuerpos Corredera",
    estado_visible: "En fabricación",
    avance_porcentaje: 65,
    fecha_entrega_estimada: "2026-06-20",
    mensaje: "Tu mueble está en la etapa de enchapado. Avanzamos según lo planificado.",
    imagen_publica: null,
    timeline: [
      { nombre:"Pedido recibido", orden:1, completado:true },
      { nombre:"Materiales en preparación", orden:2, completado:true },
      { nombre:"En fabricación", orden:3, completado:true, activo:true },
      { nombre:"En terminaciones", orden:4, completado:false },
      { nombre:"En revisión de calidad", orden:5, completado:false },
      { nombre:"Listo para despacho", orden:6, completado:false },
      { nombre:"Entregado", orden:7, completado:false },
    ]
  },
  "OP-01-00236": {
    token: "demo-token-00236",
    numero_orden: "OP-01-00236",
    cliente_nombre: "Hotel Andes",
    producto_nombre: "Mesa Comedor 10 personas",
    estado_visible: "En revisión de calidad",
    avance_porcentaje: 90,
    fecha_entrega_estimada: "2026-06-11",
    mensaje: "Tu mesa pasó el control de calidad con éxito. Pronto estará lista para despacho.",
    imagen_publica: null,
    timeline: [
      { nombre:"Pedido recibido", orden:1, completado:true },
      { nombre:"Materiales en preparación", orden:2, completado:true },
      { nombre:"En fabricación", orden:3, completado:true },
      { nombre:"En terminaciones", orden:4, completado:true },
      { nombre:"En revisión de calidad", orden:5, completado:true, activo:true },
      { nombre:"Listo para despacho", orden:6, completado:false },
      { nombre:"Entregado", orden:7, completado:false },
    ]
  }
}

export default function PortalConsultaPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ numero_orden:"", codigo:"" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [modoDemo, setModoDemo] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Modo demo: si el backend no está disponible
    await new Promise(r => setTimeout(r, 800))

    const ordenDemo = DEMO_ORDENES[form.numero_orden.toUpperCase()]
    if (ordenDemo) {
      setLoading(false)
      navigate("/mi-pedido/" + ordenDemo.token, { state: { demoData: ordenDemo } })
      return
    }

    try {
      const { data } = await portalAPI.consultarOrden(form)
      navigate("/mi-pedido/" + data.token)
    } catch (err) {
      setError(err.response?.data?.detail || "No encontramos tu pedido. Verifica el número de orden y el código de seguimiento.")
    } finally {
      setLoading(false)
    }
  }

  const usarDemo = (num, codigo) => {
    setForm({ numero_orden: num, codigo })
  }

  return (
    <div
      className="min-h-screen bg-tm-dark flex flex-col items-center justify-center p-4"
      style={{ backgroundImage:"radial-gradient(ellipse at 50% 30%, rgba(201,150,58,0.12) 0%, transparent 65%)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-tm-gold/10 border border-tm-gold/30 rounded-2xl mb-5">
            <span className="text-tm-gold font-display font-bold text-2xl">TM</span>
          </div>
          <h1 className="text-tm-gold font-display text-3xl font-bold">TuMueble</h1>
          <p className="text-tm-text text-lg mt-2 font-medium">¿Cómo va mi pedido?</p>
          <p className="text-tm-muted text-sm mt-1">
            Ingresa el número de orden y el código de seguimiento que te enviamos al confirmar tu compra.
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-tm-muted text-xs mb-1.5 font-medium uppercase tracking-wider">
                Número de orden
              </label>
              <input
                className="input-field text-sm"
                placeholder="Ej: OP-01-00234"
                value={form.numero_orden}
                onChange={e => setForm(f => ({ ...f, numero_orden: e.target.value.toUpperCase() }))}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1.5 font-medium uppercase tracking-wider">
                Código de seguimiento
              </label>
              <input
                className="input-field text-sm"
                placeholder="Ej: AB12CD34"
                value={form.codigo}
                onChange={e => setForm(f => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-3 text-red-400 text-sm flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-tm-dark/40 border-t-tm-dark rounded-full animate-spin" />
                  Consultando...
                </span>
              ) : "Ver estado de mi pedido →"}
            </button>
          </form>
        </div>

        {/* Pedidos de demostración */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 border-t border-tm-border" />
            <span className="text-tm-muted text-xs uppercase tracking-wider">Prueba con un ejemplo</span>
            <div className="flex-1 border-t border-tm-border" />
          </div>
          <div className="space-y-2">
            {[
              { num:"OP-01-00234", codigo:"AB12CD34", desc:"Closet 3 Cuerpos — En fabricación (65%)", color:"orange" },
              { num:"OP-01-00236", codigo:"XY98ZW12", desc:"Mesa Comedor — En revisión de calidad (90%)", color:"cyan" },
            ].map(d => (
              <button
                key={d.num}
                onClick={() => usarDemo(d.num, d.codigo)}
                className="w-full card py-3 text-left hover:border-tm-gold/40 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-tm-gold text-xs">{d.num} · código: {d.codigo}</div>
                    <div className="text-tm-muted text-xs mt-0.5">{d.desc}</div>
                  </div>
                  <span className="text-tm-muted text-xs group-hover:text-tm-gold transition-colors">Usar →</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-tm-muted text-xs mt-6">
          ¿Problemas para encontrar tu pedido? Contáctanos al{" "}
          <a href="mailto:contacto@tumueble.cl" className="text-tm-gold hover:underline">contacto@tumueble.cl</a>
        </p>
      </div>
    </div>
  )
}