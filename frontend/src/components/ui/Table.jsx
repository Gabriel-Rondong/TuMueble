export function Table({ headers, children, className = '' }) {
  return (
    <div className={`card p-0 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-tm-border bg-tm-surface">
              {headers.map((h, i) => (
                <th key={i} className="text-left text-xs text-tm-muted font-medium px-4 py-3 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function Tr({ children, onClick, className = '' }) {
  return (
    <tr onClick={onClick}
      className={`border-b border-tm-border/50 transition-colors last:border-0
        ${onClick ? 'cursor-pointer hover:bg-tm-card/60' : ''} ${className}`}>
      {children}
    </tr>
  )
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>
}