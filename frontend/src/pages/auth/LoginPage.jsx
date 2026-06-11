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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080B10] px-6 py-10 text-white">
      {/* Fondo sobrio */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,150,58,0.12),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.04),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.025)_0%,transparent_38%,rgba(201,150,58,0.035)_100%)]" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-[34px] border border-white/10 bg-[#111720]/95 shadow-[0_35px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          
          {/* Panel de marca */}
          <section className="relative hidden min-h-[560px] items-center justify-center overflow-hidden border-r border-white/10 bg-[#0B0F14] p-10 lg:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,150,58,0.14),transparent_42%)]" />
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:44px_44px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex h-64 w-64 items-center justify-center rounded-[42px] border border-[#C9963A]/25 bg-[#05080D] p-10 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                <img
                  src={logoTumueble}
                  alt="TuMueble"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-8 h-px w-40 bg-gradient-to-r from-transparent via-[#C9963A]/60 to-transparent" />

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#C9963A]">
                ERP Productivo
              </p>

              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                Gestión interna, producción, bodega y trazabilidad en una sola plataforma.
              </p>
            </div>
          </section>

          {/* Panel formulario */}
          <section className="flex items-center justify-center p-8 sm:p-12">
            <div className="w-full max-w-md">
              {/* Logo mobile */}
              <div className="mb-8 flex justify-center lg:hidden">
                <div className="flex h-32 w-32 items-center justify-center rounded-[32px] border border-[#C9963A]/25 bg-[#05080D] p-6">
                  <img
                    src={logoTumueble}
                    alt="TuMueble"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9963A]">
                  Acceso institucional
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  Iniciar sesión
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Ingresa tus credenciales para acceder al sistema de gestión.
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
                    className="w-full rounded-2xl border border-white/10 bg-[#080B10] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-[#C9963A]/70 focus:ring-4 focus:ring-[#C9963A]/10"
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
                      className="w-full rounded-2xl border border-white/10 bg-[#080B10] px-4 py-3.5 pr-16 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-[#C9963A]/70 focus:ring-4 focus:ring-[#C9963A]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 transition hover:text-[#C9963A]"
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#C9963A] px-4 py-3.5 text-base font-bold text-[#080B10] shadow-[0_16px_35px_rgba(201,150,58,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#D7A646] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Ingresando...' : 'Ingresar al sistema'}
                </button>
              </form>

              <div className="mt-7 border-t border-white/10 pt-5 text-center">
                <p className="text-xs leading-6 text-slate-500">
                  ¿Problemas de acceso?{' '}
                  <span className="font-semibold text-[#C9963A]">
                    Contacta a tu administrador.
                  </span>
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-slate-600">
                Acceso exclusivo para usuarios autorizados
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}