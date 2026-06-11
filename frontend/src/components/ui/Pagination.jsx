import clsx from "clsx"

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-1 py-3">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-sm text-tm-muted hover:text-tm-text hover:bg-tm-card
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onChange(1)} className="px-3 py-1.5 rounded-lg text-sm text-tm-muted hover:bg-tm-card">1</button>
          {pages[0] > 2 && <span className="text-tm-muted text-sm px-1">…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            p === page
              ? "bg-tm-gold text-tm-dark"
              : "text-tm-muted hover:text-tm-text hover:bg-tm-card"
          )}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-tm-muted text-sm px-1">…</span>}
          <button onClick={() => onChange(totalPages)} className="px-3 py-1.5 rounded-lg text-sm text-tm-muted hover:bg-tm-card">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm text-tm-muted hover:text-tm-text hover:bg-tm-card
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>

      <span className="text-tm-muted text-xs ml-2">Pág. {page} de {totalPages}</span>
    </div>
  )
}