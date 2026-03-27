type AlertProps = {
  type: 'error' | 'success'
  message: string
  onClose: () => void
}

const STYLES = {
  error:   { wrapper: 'bg-red-50 border-red-200 text-red-700',   btn: 'text-red-400 hover:text-red-600',     icon: '⚠️' },
  success: { wrapper: 'bg-green-50 border-green-200 text-green-700', btn: 'text-green-400 hover:text-green-600', icon: '✅' },
}

export function Alert({ type, message, onClose }: AlertProps) {
  const s = STYLES[type]
  return (
    <div className={`flex items-start gap-3 p-4 border rounded-xl text-sm ${s.wrapper}`}>
      <span className="text-base mt-0.5">{s.icon}</span>
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className={`font-bold text-lg leading-none ${s.btn}`}>×</button>
    </div>
  )
}
