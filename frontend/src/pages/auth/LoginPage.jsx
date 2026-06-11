import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.es_superusuario_plataforma ? '/platform' : '/app/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-tm-gold/10 border border-tm-gold/30 rounded-2xl mb-5">
          <span className="text-tm-gold font-display font-bold text-2xl">TM</span>
        </div>
        <h1 className="text-tm-gold font-display text-3xl font-bold">TuMueble</h1>
        <p className="text-tm-muted text-sm mt-1">Sistema de Gestión Productiva</p>
      </div>
      <div className="card">
        <h2 className="text-tm-text font-semibold text-lg mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-tm-muted text-xs mb-1.5 font-medium uppercase tracking-wider">Correo electrónico</label>
            <input type="email" className="input-field" placeholder="usuario@tumueble.cl"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoFocus />
          </div>
          <div>
            <label className="block text-tm-muted text-xs mb-1.5 font-medium uppercase tracking-wider">Contraseña</label>
            <input type="password" className="input-field" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
            {loading ? 'Ingresando...' : 'Ingresar al sistema'}
          </button>
        </form>
      </div>
      <p className="text-center text-tm-muted text-xs mt-6">¿Problemas de acceso? Contacta a tu administrador.</p>
    </div>
  )
}