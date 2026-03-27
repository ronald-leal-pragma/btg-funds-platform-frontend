import FundsPage from './pages/FundsPage'
import TransactionsPage from './pages/TransactionsPage'
import ClientPage from './pages/ClientPage'
import LoginPage from './pages/LoginPage'
import { useState } from 'react'
import { useAuth } from './context/AuthContext'

type Page = 'funds' | 'transactions' | 'client'

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'funds', label: 'Fondos', icon: '📈' },
  { id: 'transactions', label: 'Transacciones', icon: '🔄' },
  { id: 'client', label: 'Mi Perfil', icon: '👤' },
]

export default function App() {
  const { clientId, logout } = useAuth()
  const [page, setPage] = useState<Page>('funds')

  if (!clientId) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#003087] to-[#004ab5] shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center">
                <span className="text-[#003087] font-bold text-xs">BTG</span>
              </div>
              <div>
                <span className="text-white font-bold text-base tracking-tight">BTG Pactual</span>
                <span className="text-[#F5A623] text-xs ml-2 hidden sm:inline">Fondos de Inversión</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    page === item.id
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}

              {/* Cerrar sesión */}
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="ml-2 flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150"
              >
                <span className="text-base">🚪</span>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Page title bar */}
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-2">
            <p className="text-white/60 text-xs">
              {NAV_ITEMS.find(i => i.id === page)?.icon}{' '}
              {NAV_ITEMS.find(i => i.id === page)?.label}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {page === 'funds' && <FundsPage />}
        {page === 'transactions' && <TransactionsPage />}
        {page === 'client' && <ClientPage />}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-slate-400 text-xs">© 2025 BTG Pactual. Plataforma de Fondos FPV/FIC.</p>
          <p className="text-slate-400 text-xs">v1.0.0</p>
        </div>
      </footer>
    </div>
  )
}
