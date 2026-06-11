import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  const cargarUsuario = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    if (!token) { setCargando(false); return }
    try {
      const { data } = await authAPI.me()
      setUsuario(data)
    } catch {
      localStorage.clear()
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargarUsuario() }, [cargarUsuario])

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    setUsuario(data.usuario)
    return data.usuario
  }

  const logout = async () => {
    try {
      await authAPI.logout(localStorage.getItem('refresh_token'))
    } catch {}
    localStorage.clear()
    setUsuario(null)
  }

  const esSuperAdmin = usuario?.es_superusuario_plataforma === true
  const esAutenticado = !!usuario

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout, esSuperAdmin, esAutenticado }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
