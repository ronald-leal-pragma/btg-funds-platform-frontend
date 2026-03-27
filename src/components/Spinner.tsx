export function Spinner({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
      <div className="w-8 h-8 border-4 border-[#003087] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
