import { useTransactions } from '../hooks/useTransactions'
import { Spinner } from '../components/Spinner'
import { StatCard } from '../components/StatCard'
import { TransactionRow } from '../components/TransactionRow'
import { EmptyState } from '../components/EmptyState'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useTransactions()

  if (isLoading) return <Spinner label="Cargando transacciones..." />

  const totalAperturas = transactions?.filter(t => t.type === 'APERTURA').reduce((s, t) => s + t.amount, 0) ?? 0
  const totalCancelaciones = transactions?.filter(t => t.type === 'CANCELACION').reduce((s, t) => s + t.amount, 0) ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Historial de Transacciones</h2>
        <p className="text-sm text-slate-500 mt-0.5">Registro completo de suscripciones y cancelaciones</p>
      </div>

      {(transactions?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total transacciones" value={transactions?.length ?? 0} />
          <StatCard label="Total invertido" value={`-${fmt(totalAperturas)}`} />
          <StatCard label="Total recuperado" value={`+${fmt(totalCancelaciones)}`} />
        </div>
      )}

      {transactions?.length === 0 && (
        <EmptyState icon="📋" title="Sin transacciones aún" subtitle="Suscríbete a un fondo para empezar." />
      )}

      {(transactions?.length ?? 0) > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {transactions?.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                index={(transactions?.length ?? 0) - i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
