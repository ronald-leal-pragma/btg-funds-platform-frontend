import { useFunds } from '../hooks/useFunds'
import { Spinner } from '../components/Spinner'
import { Alert } from '../components/Alert'
import { StatCard } from '../components/StatCard'
import { FundCard } from '../components/FundCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export default function FundsPage() {
  const { funds, client, isLoading, error, successMsg, setError, setSuccessMsg, subscribe, cancel } = useFunds()

  if (isLoading) return <Spinner label="Cargando fondos..." />

  const subscribedCount = funds?.filter(f => f.subscribed).length ?? 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Saldo disponible" value={fmt(client?.balance ?? 0)} />
        <StatCard label="Fondos suscritos" value={subscribedCount} />
        <StatCard label="Fondos disponibles" value={funds?.length ?? 0} />
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <div>
        <h2 className="text-lg font-semibold text-slate-800">Portafolio de Fondos</h2>
        <p className="text-sm text-slate-500 mt-0.5">Gestiona tus suscripciones a fondos FPV y FIC</p>
      </div>

      <div className="grid gap-4">
        {funds?.map(fund => (
          <FundCard
            key={fund.id}
            fund={fund}
            onSubscribe={(id) => { setError(null); subscribe.mutate(id) }}
            onCancel={(id) => cancel.mutate(id)}
            isPending={subscribe.isPending || cancel.isPending}
          />
        ))}
      </div>
    </div>
  )
}
