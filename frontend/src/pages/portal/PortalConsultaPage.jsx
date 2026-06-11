import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { portalAPI } from '../../api/portal'

export default function PortalConsultaPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ numero_orden: '', codigo: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await portalAPI.consultarOrden(form)
      navigate('/mi-pedido/' + data.token)
    } catch (err) {
      setError(err.response?.data?.detail || 'No encontramos tu pedido. Verifica los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-tm-dark flex flex-col items-center justify-center p-4"
         style={{backgroundImage:'radial-gradient(ellipse at 50% 30%, rgba(201,150,58,0.10) 0%, transparent 65%)'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-tm-gold/10 border border-tm-gold/30 rounded-2xl mb-5">
            <span className="text-tm-gold font-display font-bold text-2xl">TM</span>
          </div>
          <h1 className="text-tm-gold font-display text-3xl font-bold">TuMueble</h1>
          <p className="text-tm-text text-lg mt-2 font-medium">¿Cómo va mi pedido?</p>
          <p className="text-tm-muted text-sm mt-1">Ingresa el número de orden y el código de seguimiento</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-tm-muted text-xs mb-1.5 font-medium uppercase tracking-wider">Número de orden</label>
              <input className="input-field" placeholder="Ej: OP-01-00234"
                value={form.numero_orden} onChange={e => setForm(f => ({...f, numero_orden: e.target.value.toUpperCase()}))} required />
            </div>
            <div>
              <label className="block text-tm-muted text-xs mb-1.5 font-medium uppercase tracking-wider">Código de seguimiento</label>
              <input className="input-field" placeholder="Ej: AB12CD34"
                value={form.codigo} onChange={e => setForm(f => ({...f, codigo: e.target.value.toUpperCase()}))} required />
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
              {loading ? 'Consultando...' : 'Ver estado de mi pedido'}
            </button>
          </form>
        </div>

        <p className="text-center text-tm-muted text-xs mt-6">
          El número de orden y código te lo entregamos al confirmar tu compra.
        </p>
      </div>
    </div>
  )
}