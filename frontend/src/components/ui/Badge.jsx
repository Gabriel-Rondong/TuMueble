import clsx from 'clsx'

const VARIANTES = {
  gold:    'bg-tm-gold/15 text-tm-gold border border-tm-gold/20',
  green:   'bg-green-500/15 text-green-400 border border-green-500/20',
  red:     'bg-red-500/15 text-red-400 border border-red-500/20',
  orange:  'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  blue:    'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  purple:  'bg-violet-500/15 text-violet-400 border border-violet-500/20',
  gray:    'bg-tm-surface text-tm-muted border border-tm-border',
  cyan:    'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
}

export default function Badge({ children, variante = 'gray', className = '' }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium', VARIANTES[variante], className)}>
      {children}
    </span>
  )
}