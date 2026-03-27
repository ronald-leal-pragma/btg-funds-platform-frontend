type BadgeVariant = 'fpv' | 'fic' | 'apertura' | 'cancelacion' | 'active'

type BadgeProps = {
  label: string
  variant: BadgeVariant
}

const VARIANTS: Record<BadgeVariant, string> = {
  fpv:        'bg-[#F5A623]/20 text-[#b07400]',
  fic:        'bg-purple-100 text-purple-700',
  apertura:   'bg-red-100 text-red-600',
  cancelacion:'bg-green-100 text-green-700',
  active:     'bg-[#003087] text-white',
}

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${VARIANTS[variant]}`}>
      {label}
    </span>
  )
}
