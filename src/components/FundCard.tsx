import type { Fund } from '../types'
import { Badge } from './Badge'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

type FundCardProps = {
  fund: Fund
  onSubscribe: (id: string) => void
  onCancel: (id: string) => void
  isPending: boolean
}

export function FundCard({ fund, onSubscribe, onCancel, isPending }: FundCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-150 hover:shadow-md ${
      fund.subscribed ? 'border-[#003087]/30 bg-blue-50/30' : 'border-slate-200'
    }`}>
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            fund.subscribed ? 'bg-[#003087] text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            <span className="text-lg">{fund.category === 'FPV' ? '📊' : '🏦'}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-900 truncate">{fund.name}</p>
              {fund.subscribed && <Badge label="Activo" variant="active" />}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Badge label={fund.category} variant={fund.category === 'FPV' ? 'fpv' : 'fic'} />
              <span className="text-xs text-slate-500">
                Mínimo: <span className="font-medium text-slate-700">{fmt(fund.minAmount)}</span>
              </span>
            </div>
          </div>
        </div>

        {fund.subscribed ? (
          <button
            onClick={() => onCancel(fund.id)}
            disabled={isPending}
            className="shrink-0 px-5 py-2.5 text-sm font-medium border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Cancelando...' : 'Cancelar'}
          </button>
        ) : (
          <button
            onClick={() => onSubscribe(fund.id)}
            disabled={isPending}
            className="shrink-0 px-5 py-2.5 text-sm font-semibold bg-[#003087] text-white rounded-lg hover:bg-[#004ab5] transition-colors disabled:opacity-50 shadow-sm"
          >
            {isPending ? 'Procesando...' : 'Suscribirse'}
          </button>
        )}
      </div>
    </div>
  )
}
