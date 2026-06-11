import { useState } from 'react'

const MATERIALES = [
  { id:1, nombre:'Melamina Blanca 18mm', sku:'MEL-BL-18', categoria:'Tableros', stock:45.5, minimo:20, unidad:'pla', costo:28500, alerta:false },
  { id:2, nombre:'Canto PVC Blanco 22mm', sku:'CAN-PVC-22', categoria:'Cantos', stock:8, minimo:20, unidad:'m', costo:450, alerta:true },
  { id:3, nombre:'Bisagra Clip 35mm', sku:'BIS-35', categoria:'Herrajes', stock:12, minimo:50, unidad:'un', costo:1200, alerta:true },
  { id:4, nombre:'Riel Telescópico 45cm', sku:'RIE-45', categoria:'Herrajes', stock:34, minimo:20, unidad:'un', costo:4800, alerta:false },
  { id:5, nombre:'Tornillo Confirmat 6x50', sku:'TOR-CON-50', categoria:'Fijaciones', stock:1200, minimo:500, unidad:'un', costo:85, alerta:false },
  { id:6, nombre:'MDF 9mm', sku:'MDF-09', categoria:'Tableros', stock:22, minimo:15, unidad:'pla', costo:18900, alerta:false },
]

export default function MaterialesPage() {
  const [buscar, setBuscar] = useState('')
  const [soloAlertas, setSoloAlertas] = useState(false)

  const filtrados = MATERIALES.filter(m => {
    if (soloAlertas && !m.alerta) return false
    return m.nombre.toLowerCase().includes(buscar.toLowerCase()) || m.sku.toLowerCase().includes(buscar.toLowerCase())
  })

  const formatCLP = v => '$' + Number(v).toLocaleString('es-CL')
  const alertas = MATERIALES.filter(m => m.alerta).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tm-text">Materiales</h1>
          <p className="text-tm-muted text-sm mt-1">{MATERIALES.length} materiales · <span className="text-red-400">{alertas} con stock crítico</span></p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-tm-muted cursor-pointer">
            <input type="checkbox" checked={soloAlertas} onChange={e => setSoloAlertas(e.target.checked)}
              className="accent-tm-gold" />
            Solo críticos
          </label>
          <input placeholder="Buscar material o SKU..." className="input-field w-60 text-sm"
            value={buscar} onChange={e => setBuscar(e.target.value)} />
          <button className="btn-gold text-sm">+ Nuevo material</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card"><div className="text-2xl font-bold text-tm-gold">{MATERIALES.length}</div><div className="text-tm-text text-sm mt-1">Total materiales</div></div>
        <div className="card"><div className="text-2xl font-bold text-red-400">{alertas}</div><div className="text-tm-text text-sm mt-1">Stock crítico</div></div>
        <div className="card"><div className="text-2xl font-bold text-green-400">{MATERIALES.length - alertas}</div><div className="text-tm-text text-sm mt-1">Stock normal</div></div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-tm-border bg-tm-surface">
              {['Material','SKU','Categoría','Stock actual','Mínimo','Costo unit.','Estado'].map(h => (
                <th key={h} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(m => (
              <tr key={m.id} className="border-b border-tm-border/50 hover:bg-tm-card/50 cursor-pointer">
                <td className="px-4 py-3 font-medium text-tm-text">{m.nombre}</td>
                <td className="px-4 py-3 font-mono text-tm-gold text-xs">{m.sku}</td>
                <td className="px-4 py-3 text-tm-muted text-xs">{m.categoria}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={m.alerta ? 'text-red-400 font-semibold' : 'text-tm-text'}>{m.stock} {m.unidad}</span>
                    {m.alerta && <span className="text-red-500 text-xs animate-pulse">⚠</span>}
                  </div>
                  <div className="h-1 w-20 bg-tm-border rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: Math.min((m.stock / m.minimo) * 100, 100) + '%',
                      background: m.alerta ? '#EF4444' : '#22C55E'
                    }} />
                  </div>
                </td>
                <td className="px-4 py-3 text-tm-muted text-xs">{m.minimo} {m.unidad}</td>
                <td className="px-4 py-3 text-tm-muted font-mono text-xs">{formatCLP(m.costo)}</td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs ${m.alerta ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                    {m.alerta ? 'Stock bajo' : 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}