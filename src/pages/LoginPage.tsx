import { useState } from 'react'
import { clientApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'register'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export default function LoginPage() {
  const { login } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Campos comunes
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Campos sólo en registro
  const [notificationPreference, setNotificationPreference] = useState<'email' | 'sms'>('email')
  const [contactInfo, setContactInfo] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const client = await clientApi.login({ email, password })
        login(client.id)
      } else {
        const client = await clientApi.create({
          email,
          password,
          notificationPreference,
          contactInfo: notificationPreference === 'email' ? email : contactInfo,
        })
        login(client.id)
      }
    } catch (err: any) {
      setError(err?.message ?? 'Ocurrió un error, intenta de nuevo')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(m => (m === 'login' ? 'register' : 'login'))
    setError(null)
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#003087] to-[#004ab5] shadow-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center">
            <span className="text-[#003087] font-bold text-xs">BTG</span>
          </div>
          <span className="text-white font-bold text-base tracking-tight">BTG Pactual</span>
          <span className="text-[#F5A623] text-xs ml-1 hidden sm:inline">Fondos de Inversión</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Card header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[#003087] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">{mode === 'login' ? '🔐' : '✨'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login'
                ? 'Ingresa para gestionar tus fondos de inversión'
                : `Empieza con un saldo inicial de ${fmt(500000)}`}
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="usuario@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder={mode === 'register' ? 'Mínimo 4 caracteres' : '••••••••'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={4}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                />
              </div>

              {/* Campos adicionales sólo en registro */}
              {mode === 'register' && (
                <>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Preferencia de notificación
                    </p>
                    <div className="flex gap-3">
                      {(['email', 'sms'] as const).map(pref => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => setNotificationPreference(pref)}
                          className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            notificationPreference === pref
                              ? 'bg-[#003087] text-white border-[#003087]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-[#003087]'
                          }`}
                        >
                          {pref === 'email' ? '📧 Email' : '📱 SMS'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {notificationPreference === 'sms' && (
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Número de teléfono
                      </label>
                      <input
                        type="tel"
                        placeholder="+573001234567"
                        value={contactInfo}
                        onChange={e => setContactInfo(e.target.value)}
                        required
                        className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                      />
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003087] text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-[#004ab5] transition-colors shadow-sm mt-2"
              >
                {loading
                  ? mode === 'login'
                    ? 'Ingresando...'
                    : 'Creando cuenta...'
                  : mode === 'login'
                    ? 'Ingresar'
                    : 'Crear cuenta'}
              </button>
            </form>
          </div>

          {/* Switch mode */}
          <p className="text-center text-sm text-slate-500">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={switchMode}
              className="text-[#003087] font-semibold hover:underline"
            >
              {mode === 'login' ? 'Regístrate' : 'Ingresar'}
            </button>
          </p>

          {/* Demo hint */}
          {mode === 'login' && (
            <p className="text-center text-xs text-slate-400">
              Cuenta demo: <span className="font-mono">user@email.com</span> / <span className="font-mono">btg1234</span>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
