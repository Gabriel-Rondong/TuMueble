import { useState } from "react"
import clsx from "clsx"

const TABS = ["General", "Planes y límites", "Seguridad JWT", "Correo", "Mantenimiento"]

export default function ConfiguracionPlataformaPage() {
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    nombre_plataforma: "TuMueble ERP",
    version: "4.0.0",
    url_base: "https://erp.tumueble.cl",
    soporte_email: "soporte@tumueble.cl",
    jwt_access_minutes: 60,
    jwt_refresh_days: 7,
    max_empresas: 10,
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_user: "noreply@tumueble.cl",
    modo_mantenimiento: false,
    debug: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const PLANES = [
    { nombre:"Básico", max_usuarios:5, max_ordenes:50, modulos:["dashboard","produccion","bodega","clientes","reportes"], precio:"$49.990/mes" },
    { nombre:"Profesional", max_usuarios:15, max_ordenes:500, modulos:["Todo Básico","documentos","costos","calidad","auditoria","portal_cliente","configuracion"], precio:"$89.990/mes" },
    { nombre:"Enterprise", max_usuarios:999, max_ordenes:9999, modulos:["Todo Profesional","multi-empresa","soporte prioritario","API personalizada"], precio:"Precio a convenir" },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Configuración de Plataforma</h1>
          <p className="text-tm-muted text-sm mt-1">Parámetros globales del sistema SaaS TuMueble</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="btn-gold text-sm">Guardar cambios</button>
          {saved && <span className="text-green-400 text-sm">✓ Guardado</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-tm-border">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={clsx("px-4 py-2 text-sm font-medium border-b-2 transition-colors", {
              "border-tm-gold text-tm-gold": tab === i,
              "border-transparent text-tm-muted hover:text-tm-text": tab !== i
            })}>
            {t}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 0 && (
        <div className="max-w-2xl space-y-4">
          <div className="card">
            <h3 className="font-semibold text-tm-text mb-4">Identidad de la plataforma</h3>
            <div className="space-y-3">
              {[
                ["nombre_plataforma", "Nombre de la plataforma"],
                ["url_base", "URL base del sistema"],
                ["soporte_email", "Email de soporte"],
              ].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
                  <input className="input-field text-sm" value={config[k]}
                    onChange={e => setConfig(c => ({ ...c, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-tm-text mb-4">Estado del sistema</h3>
            <div className="space-y-3">
              {[
                ["modo_mantenimiento", "Modo mantenimiento", "Deshabilita el acceso de usuarios no-superadmin"],
                ["debug", "Modo debug", "Solo activar en desarrollo — nunca en producción"],
              ].map(([k, l, desc]) => (
                <div key={k} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-tm-text text-sm font-medium">{l}</div>
                    <div className="text-tm-muted text-xs">{desc}</div>
                  </div>
                  <button
                    onClick={() => setConfig(c => ({ ...c, [k]: !c[k] }))}
                    className={clsx("relative w-11 h-6 rounded-full transition-colors", config[k] ? "bg-tm-gold" : "bg-tm-border")}
                  >
                    <div className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform", config[k] ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="card bg-tm-surface border-tm-border">
            <div className="flex justify-between text-sm">
              <span className="text-tm-muted">Versión del sistema</span>
              <span className="text-tm-gold font-mono font-bold">{config.version}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-tm-muted">Stack tecnológico</span>
              <span className="text-tm-muted text-xs">Django 5.0 · React 18 · MySQL 8</span>
            </div>
          </div>
        </div>
      )}

      {/* Planes */}
      {tab === 1 && (
        <div className="space-y-4">
          <p className="text-tm-muted text-sm">Define los límites y módulos disponibles por plan de suscripción.</p>
          <div className="grid grid-cols-3 gap-4">
            {PLANES.map(p => (
              <div key={p.nombre} className={clsx(
                "card border-2 transition-colors",
                p.nombre === "Profesional" ? "border-tm-gold/40" : "border-tm-border"
              )}>
                {p.nombre === "Profesional" && (
                  <div className="text-xs text-tm-gold font-semibold mb-2 uppercase tracking-wider">⭐ Recomendado</div>
                )}
                <h3 className="font-bold text-tm-text text-lg mb-1">{p.nombre}</h3>
                <div className="text-tm-gold font-semibold mb-3">{p.precio}</div>
                <div className="space-y-1.5 text-xs text-tm-muted mb-4">
                  <div>👥 Hasta {p.max_usuarios === 999 ? "ilimitados" : p.max_usuarios} usuarios</div>
                  <div>📋 Hasta {p.max_ordenes === 9999 ? "ilimitadas" : p.max_ordenes} órdenes/mes</div>
                </div>
                <div className="space-y-1">
                  {p.modulos.map(m => (
                    <div key={m} className="flex items-center gap-2 text-xs text-tm-text">
                      <span className="text-green-400">✓</span> {m}
                    </div>
                  ))}
                </div>
                <button className="btn-ghost text-xs w-full mt-4 border border-tm-border py-2">Editar plan</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JWT */}
      {tab === 2 && (
        <div className="max-w-lg space-y-4">
          <div className="card">
            <h3 className="font-semibold text-tm-text mb-4">Configuración JWT</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Access Token — tiempo de vida (minutos)</label>
                <input type="number" className="input-field text-sm" value={config.jwt_access_minutes}
                  onChange={e => setConfig(c => ({ ...c, jwt_access_minutes: +e.target.value }))} />
                <p className="text-tm-muted text-xs mt-1">Tiempo antes de que expire el token de acceso. Recomendado: 60 min.</p>
              </div>
              <div>
                <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Refresh Token — tiempo de vida (días)</label>
                <input type="number" className="input-field text-sm" value={config.jwt_refresh_days}
                  onChange={e => setConfig(c => ({ ...c, jwt_refresh_days: +e.target.value }))} />
                <p className="text-tm-muted text-xs mt-1">Tiempo antes de que expire el refresh token. Recomendado: 7 días.</p>
              </div>
            </div>
          </div>
          <div className="card bg-amber-500/5 border-amber-500/20">
            <div className="text-amber-400 font-medium text-sm mb-2">⚠️ Importante</div>
            <p className="text-tm-muted text-xs">Cambiar estos valores forzará a todos los usuarios a iniciar sesión nuevamente. El SECRET_KEY de Django se configura en el archivo .env del servidor.</p>
          </div>
        </div>
      )}

      {/* Correo */}
      {tab === 3 && (
        <div className="max-w-lg space-y-4">
          <div className="card">
            <h3 className="font-semibold text-tm-text mb-4">Configuración SMTP</h3>
            <div className="space-y-3">
              {[
                ["smtp_host", "Servidor SMTP"],
                ["smtp_port", "Puerto"],
                ["smtp_user", "Usuario / email remitente"],
              ].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">{l}</label>
                  <input className="input-field text-sm" value={config[k]}
                    onChange={e => setConfig(c => ({ ...c, [k]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="block text-tm-muted text-xs mb-1 uppercase tracking-wider">Contraseña SMTP</label>
                <input type="password" className="input-field text-sm" placeholder="••••••••" />
              </div>
            </div>
          </div>
          <button className="btn-ghost text-sm border border-tm-border w-full py-2">📧 Enviar email de prueba</button>
        </div>
      )}

      {/* Mantenimiento */}
      {tab === 4 && (
        <div className="max-w-lg space-y-4">
          <div className="card border-red-500/20">
            <h3 className="font-semibold text-red-400 mb-3">⚠️ Zona de mantenimiento</h3>
            <p className="text-tm-muted text-xs mb-4">Las siguientes acciones son irreversibles o de alto impacto. Úsalas con precaución.</p>
            <div className="space-y-3">
              {[
                { label:"Limpiar logs de auditoría (> 90 días)", color:"orange", icon:"🗑" },
                { label:"Reconstruir índices de base de datos", color:"blue", icon:"🔧" },
                { label:"Vaciar caché del sistema", color:"blue", icon:"♻️" },
                { label:"Exportar backup completo", color:"green", icon:"💾" },
                { label:"Restablecer datos de demostración", color:"orange", icon:"🔄" },
              ].map(a => (
                <div key={a.label} className="flex items-center justify-between py-3 border-b border-tm-border/50 last:border-0">
                  <div className="flex items-center gap-2 text-sm text-tm-text">
                    <span>{a.icon}</span>
                    {a.label}
                  </div>
                  <button className={clsx(
                    "text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors",
                    a.color === "red" ? "border-red-500/40 text-red-400 hover:bg-red-500/10" :
                    a.color === "orange" ? "border-orange-500/40 text-orange-400 hover:bg-orange-500/10" :
                    a.color === "green" ? "border-green-500/40 text-green-400 hover:bg-green-500/10" :
                    "border-blue-500/40 text-blue-400 hover:bg-blue-500/10"
                  )}>
                    Ejecutar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}