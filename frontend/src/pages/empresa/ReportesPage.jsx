import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import logoTumueble from '../../assets/logo_tumueble.png'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F1EA] px-6 py-10 text-[#111827]">
      {/* Fondo suave institucional */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,150,58,0.12),transparent_34%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.08),transparent_32%)]" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Logo superior */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-[28px] border border-[#C9963A]/30 bg-[#0B111C] p-5 shadow-[0_22px_55px_rgba(15,23,42,0.22)]">
            <img
              src={logoTumueble}
              alt="TuMueble"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#C9963A]">
            TuMueble
          </h1>

          <p className="mt-1 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            ERP Productivo
          </p>
        </div>

        {/* Card login */}
        <div className="rounded-[32px] border border-[#D8D0C3] bg-white/95 p-10 shadow-[0_28px_80px_rgba(15,23,42,0.16)] backdrop-blur">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C9963A]">
              Acceso institucional
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#111827]">
              Iniciar sesión
            </h2>

            <p className="mt-3 max-w-md text-base leading-7 text-slate-500">
              Ingresa tus credenciales para acceder al panel de gestión de TuMueble.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Correo electrónico
              </label>

              <input
                type="email"
                placeholder="usuario@tumueble.cl"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoFocus
                className="w-full rounded-2xl border border-slate-200 bg-[#EAF1FF] px-5 py-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#C9963A] focus:bg-white focus:ring-4 focus:ring-[#C9963A]/15"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-[#EAF1FF] px-5 py-4 pr-16 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#C9963A] focus:bg-white focus:ring-4 focus:ring-[#C9963A]/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 transition hover:text-[#C9963A]"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#C9963A] px-4 py-4 text-base font-bold text-[#111827] shadow-[0_16px_35px_rgba(201,150,58,0.28)] transition-all hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              ¿Problemas de acceso?{' '}
              <span className="font-bold text-[#C9963A]">
                Contacta a tu administrador.
              </span>
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-slate-500">
          Acceso exclusivo para usuarios autorizados · TuMueble ERP
        </p>
      </div>
    </div>
  )
}