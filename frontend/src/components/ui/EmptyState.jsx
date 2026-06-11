export default function EmptyState({ icon = '📋', titulo, subtitulo, accion }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-tm-text font-semibold text-base mb-1">{titulo}</h3>
      {subtitulo && <p className="text-tm-muted text-sm mb-4">{subtitulo}</p>}
      {accion && accion}
    </div>
  )
}