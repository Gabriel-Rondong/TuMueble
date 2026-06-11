export default function PlatformDashboard() {
  const empresas = [
    { nombre:'TuMueble', rut:'77.123.456-7', plan:'Profesional', estado:'activa', usuarios:8, ordenes:24 },
    { nombre:'Muebles Sur', rut:'76.987.654-3', plan:'Básico', estado:'activa', usuarios:3, ordenes:7 },
    { nombre:'Carpintería Andina', rut:'12.345.678-9', plan:'Enterprise', estado:'inactiva', usuarios:0, ordenes:0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tm-text">Panel de Plataforma</h1>
        <p className="text-tm-muted text-sm mt-1">Administración central del sistema SaaS TuMueble</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'Empresas activas', value:'2', color:'#22C55E', icon:'🏢' },
          { label:'Total usuarios', value:'11', color:'#C9963A', icon:'👥' },
          { label:'Módulos disponibles', value:'24', color:'#3B82F6', icon:'📦' },
          { label:'Órdenes plataforma', value:'31', color:'#8B5CF6', icon:'📋' },
        ].map(k => (
          <div key={k.label} className="card">
            <span className="text-2xl">{k.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</div>
            <div className="text-tm-text text-sm">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-tm-text">Empresas Registradas</h2>
          <button className="btn-gold text-xs">+ Crear empresa</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-tm-border">
              {['Empresa','RUT','Plan','Estado','Usuarios','Órdenes','Acciones'].map(h => (
                <th key={h} className="text-left text-xs text-tm-muted font-medium py-2 px-3 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empresas.map(e => (
              <tr key={e.rut} className="border-b border-tm-border/50 hover:bg-tm-card/50">
                <td className="py-3 px-3 text-tm-text font-medium text-sm">{e.nombre}</td>
                <td className="py-3 px-3 text-tm-muted text-xs font-mono">{e.rut}</td>
                <td className="py-3 px-3"><span className="badge bg-tm-gold/15 text-tm-gold text-xs">{e.plan}</span></td>
                <td className="py-3 px-3">
                  <span className={'badge text-xs ' + (e.estado==='activa'?'bg-green-500/15 text-green-400':'bg-red-500/15 text-red-400')}>
                    {e.estado}
                  </span>
                </td>
                <td className="py-3 px-3 text-tm-muted text-xs">{e.usuarios}</td>
                <td className="py-3 px-3 text-tm-muted text-xs">{e.ordenes}</td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    <button className="text-tm-gold text-xs hover:underline">Editar</button>
                    <button className="text-tm-muted text-xs hover:underline">Módulos</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}