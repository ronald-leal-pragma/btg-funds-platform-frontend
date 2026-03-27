import { useClient } from '../hooks/useClient'
import { Spinner } from '../components/Spinner'
import { EmptyState } from '../components/EmptyState'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export default function ClientPage() {
  const { data: client, isLoading, error } = useClient()

  if (isLoading) return <Spinner label="Cargando perfil..." />

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="No se pudo cargar el cliente"
        subtitle={(error as any)?.message ?? 'Verifica que el backend esté corriendo en el puerto 8081.'}
      />
    )
  }

  if (!client) return null

  const balancePct = Math.min(100, (client.balance / 500000) * 100)

  const infoRows = [
    { label: 'ID de cliente',              value: client.id,                                                         icon: '🪪' },
    { label: 'Correo',                     value: client.email,                                                      icon: '✉️' },
    { label: 'Preferencia de notificación', value: client.notificationPreference === 'email' ? '📧 Email' : '📱 SMS', icon: '🔔' },
    { label: 'Contacto',                   value: client.contactInfo,                                                icon: '📬' },
    {
      label: 'Fondos activos',
      value: (client.activeFundIds?.length ?? 0) > 0 ? client.activeFundIds.join(', ') : 'Sin fondos activos',
      icon: '📊',
    },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Mi Perfil</h2>
        <p className="text-sm text-slate-500 mt-0.5">Información y estado de tu cuenta BTG Pactual</p>
      </div>

      <div className="bg-gradient-to-br from-[#003087] to-[#004ab5] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <p className="text-white/70 text-xs uppercase tracking-wide">Cliente BTG Pactual</p>
            <p className="font-bold text-lg">{client.email}</p>
          </div>
        </div>

        <div>
          <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Saldo disponible</p>
          <p className="text-3xl font-bold">{fmt(client.balance)}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Utilizado</span>
              <span>{fmt(500000 - client.balance)} / {fmt(500000)}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5A623] rounded-full transition-all duration-700"
                style={{ width: `${100 - balancePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Detalles de cuenta</p>
        </div>
        <div className="divide-y divide-slate-100">
          {infoRows.map(row => (
            <div key={row.label} className="flex items-center gap-4 px-5 py-4">
              <span className="text-xl w-7 shrink-0 text-center">{row.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-slate-400">{row.label}</p>
                <p className="font-medium text-slate-800 text-sm mt-0.5">{row.value ?? '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
