import type { Transaction } from '../types'
import { Badge } from './Badge'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

type TransactionRowProps = {
  transaction: Transaction
  index: number
}

export function TransactionRow({ transaction: tx, index }: TransactionRowProps) {
  const isApertura = tx.type === 'APERTURA'
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
      <span className="text-xs text-slate-300 font-mono w-5 shrink-0 text-right">{index}</span>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
        isApertura ? 'bg-red-100' : 'bg-green-100'
      }`}>
        <span className="text-base">{isApertura ? '↓' : '↑'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge
            label={isApertura ? 'Suscripción' : 'Cancelación'}
            variant={isApertura ? 'apertura' : 'cancelacion'}
          />
        </div>
        <p className="font-medium text-slate-800 text-sm mt-0.5 truncate">{tx.fundName}</p>
        <p className="text-xs text-slate-400">
          {new Date(tx.timestamp).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-bold text-sm ${isApertura ? 'text-red-600' : 'text-green-600'}`}>
          {isApertura ? '-' : '+'}{fmt(tx.amount)}
        </p>
        <p className="text-[10px] text-slate-400 font-mono">{tx.id.slice(0, 8)}…</p>
      </div>
    </div>
  )
}
