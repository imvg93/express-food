import { Info } from 'lucide-react'

export default function HelperBanner({ children, tone = 'info' }) {
  const tones = {
    info:    'bg-brand-50 text-brand-800 ring-brand-100',
    warn:    'bg-amber-50 text-amber-800 ring-amber-100',
    success: 'bg-emerald-50 text-emerald-800 ring-emerald-100'
  }
  return (
    <div className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm ring-1 ring-inset ${tones[tone]}`}>
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <p className="leading-relaxed">{children}</p>
    </div>
  )
}
