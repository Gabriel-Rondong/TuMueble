import { useState } from 'react'
import clsx from 'clsx'

const MIS_ETAPAS = [
  { id:1, orden:'OP-01-00234', cliente:'María González', producto:'Closet 3 Cuerpos', etapa:'Enchapado', estado:'iniciada', inicio:'09:15' },
  { id:2, orden:'OP-01-00235', cliente:'Constructora Andina', producto:'Kit Cocina', etapa:'Corte', estado:'pendiente', inicio:null },
  { id:3, orden:'OP-01-00231', cliente:'Pedro López', producto:'Velador Flotante', etapa:'Enchapado', estado:'pausada', inicio:'08:00' },
]

export default function OperarioPage() {
  const [etapas, setEtapas] = useState(MIS_ETAPAS)
  const [obs, setObs] = useState('')
  const [activa, setActiva] = useState(null)

  const cambiarEstado = (id, nuevoEstado) => {
    setEtapas(e => e.map(et => et.id === id ? {...et, estado: nuevoEstado} : et))
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-tm-text">Mis órdenes asignadas</h1>
        <p className="text-tm-muted text-sm mt-1">Etapa: <strong className="text-tm-gold">Enchapado</strong></p>
      </div>

      <div className="space-y-4">
        {etapas.map(et => (
          <div key={et.id} className={clsx(
            'card border-2 transition-all',
            et.estado === 'iniciada' ? 'border-tm-gold/50' :
            et.estado === 'pausada' ? 'border-orange-500/50' :
            et.estado === 'completada' ? 'border-green-500/50' : 'border-tm-border'
          )}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono text-tm-gold text-sm">{et.orden}</div>
                <div className="text-tm-text font-semibold">{et.producto}</div>
                <div className="text-tm-muted text-xs">{et.cliente} · Etapa: {et.etapa}</div>
              </div>
              <span className={clsx('badge text-xs', {
                'bg-tm-gold/15 text-tm-gold': et.estado === 'iniciada',
                'bg-orange-500/15 text-orange-400': et.estado === 'pausada',
                'bg-green-500/15 text-green-400': et.estado === 'completada',
                'bg-tm-surface text-tm-muted': et.estado === 'pendiente',
              })}>
                {et.estado.charAt(0).toUpperCase() + et.estado.slice(1)}
              </span>
            </div>

            {et.inicio && <div className="text-xs text-tm-muted mb-3">⏱ Iniciada a las {et.inicio}</div>}

            {et.estado !== 'completada' && (
              <div className="grid grid-cols-2 gap-2">
                {et.estado === 'pendiente' && (
                  <button className="btn-gold py-3 text-sm col-span-2"
                    onClick={() => cambiarEstado(et.id, 'iniciada')}>
                    ▶ Iniciar proceso
                  </button>
                )}
                {et.estado === 'iniciada' && (<>
                  <button className="btn-ghost border border-orange-500/30 text-orange-400 py-3 text-sm"
                    onClick={() => cambiarEstado(et.id, 'pausada')}>
                    ⏸ Pausar
                  </button>
                  <button className="bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg py-3 text-sm font-semibold"
                    onClick={() => cambiarEstado(et.id, 'completada')}>
                    ✓ Finalizar
                  </button>
                </>)}
                {et.estado === 'pausada' && (<>
                  <button className="btn-gold py-3 text-sm"
                    onClick={() => cambiarEstado(et.id, 'iniciada')}>
                    ▶ Reanudar
                  </button>
                  <button className="bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg py-3 text-sm"
                    onClick={() => cambiarEstado(et.id, 'completada')}>
                    ✓ Finalizar
                  </button>
                </>)}
                <button className="btn-ghost border border-red-500/30 text-red-400 py-2 text-xs"
                  onClick={() => setActiva(et.id === activa ? null : et.id)}>
                  ⚠ Reportar problema
                </button>
                <button className="btn-ghost border border-tm-border py-2 text-xs">
                  📷 Adjuntar foto
                </button>
              </div>
            )}

            {activa === et.id && (
              <div className="mt-3 space-y-2">
                <textarea className="input-field text-sm resize-none h-20"
                  placeholder="Describe el problema o novedad..."
                  value={obs} onChange={e => setObs(e.target.value)} />
                <button className="btn-gold text-sm w-full">Enviar reporte</button>
              </div>
            )}

            {et.estado === 'completada' && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <span>✓</span><span>Etapa completada</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}