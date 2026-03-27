import { createContext, useContext, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'btg_client_id'

interface AuthContextValue {
  clientId: string | null
  login: (id: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [clientId, setClientId] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  )

  const login = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id)
    setClientId(id)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setClientId(null)
  }

  return (
    <AuthContext.Provider value={{ clientId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
