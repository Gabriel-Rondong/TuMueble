import { useState, useEffect } from "react"

export default function SearchBar({ onSearch, placeholder = "Buscar...", className = "" }) {
  const [value, setValue] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300)
    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tm-muted text-sm">🔍</span>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-8 text-sm"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-tm-muted hover:text-tm-text text-xs"
        >
          ✕
        </button>
      )}
    </div>
  )
}