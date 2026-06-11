import { useState, useEffect, createContext, useContext, useCallback } from "react"
import clsx from "clsx"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((msg, tipo = "info", duracion = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, tipo }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duracion)
  }, [])

  const toast = {
    success: (m) => add(m, "success"),
    error:   (m) => add(m, "error"),
    info:    (m) => add(m, "info"),
    warn:    (m) => add(m, "warn"),
  }

  const ICON = { success:"✓", error:"✕", info:"ℹ", warn:"⚠" }
  const STYLE = {
    success: "bg-green-500/15 border-green-500/40 text-green-400",
    error:   "bg-red-500/15 border-red-500/40 text-red-400",
    info:    "bg-blue-500/15 border-blue-500/40 text-blue-300",
    warn:    "bg-orange-500/15 border-orange-500/40 text-orange-400",
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={clsx(
              "flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl",
              "animate-in slide-in-from-right-4 duration-200",
              STYLE[t.tipo]
            )}
          >
            <span className="text-base">{ICON[t.tipo]}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be inside ToastProvider")
  return ctx
}