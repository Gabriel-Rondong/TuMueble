import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`card w-full ${sizes[size]} animate-in fade-in duration-150`}>
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-tm-text font-semibold text-base">{title}</h2>
            <button onClick={onClose}
              className="text-tm-muted hover:text-tm-text w-7 h-7 flex items-center justify-center rounded-full hover:bg-tm-border transition-colors text-lg">
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}