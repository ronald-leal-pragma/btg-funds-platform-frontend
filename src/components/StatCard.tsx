type StatCardProps = {
  label: string
  value: string | number
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#003087]">{value}</p>
    </div>
  )
}
