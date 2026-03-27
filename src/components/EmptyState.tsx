type EmptyStateProps = {
  icon: string
  title: string
  subtitle?: string
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
      <span className="text-5xl">{icon}</span>
      <p className="font-medium text-slate-500">{title}</p>
      {subtitle && <p className="text-sm">{subtitle}</p>}
    </div>
  )
}
