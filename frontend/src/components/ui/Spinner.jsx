export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size]
  return (
    <div className={`${s} border-2 border-tm-border border-t-tm-gold rounded-full animate-spin ${className}`} />
  )
}

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner size="lg" />
      <span className="text-tm-muted text-sm">Cargando...</span>
    </div>
  )
}