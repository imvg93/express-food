import { useEffect, useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'

/* Demo-only WhatsApp lookup. No backend here, so the result is faked
   deterministically from the digits — the same number always returns the
   same answer. Swap this for a real WhatsApp Business API call later. */
export function numberHasWhatsApp(phone) {
  const sum = phone.split('').reduce((a, d) => a + Number(d), 0)
  return sum % 5 !== 0   // ~80% of numbers resolve as "on WhatsApp"
}

const prettyPhone = p => `+91 ${p.replace(/(\d{5})(\d{5})/, '$1 $2')}`

/* Runs the (simulated) check whenever the target number changes.
   Returns 'idle' | 'checking' | 'yes' | 'no'. */
export function useWhatsAppCheck(target) {
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!/^\d{10}$/.test(target)) {
      setStatus('idle')
      return
    }
    setStatus('checking')
    const id = setTimeout(() => {
      setStatus(numberHasWhatsApp(target) ? 'yes' : 'no')
    }, 900)
    return () => clearTimeout(id)
  }, [target])

  return status
}

/* Visual result row. `number` is echoed back so the check reads like a
   real verification ("+91 98765 43210 is on WhatsApp"). */
export default function WhatsAppCheck({ status, number, idleHint }) {
  if (status === 'idle') {
    return (
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
        {idleHint || "We'll check this number for WhatsApp and send your updates there."}
      </p>
    )
  }

  const who = /^\d{10}$/.test(number || '') ? prettyPhone(number) : 'this number'

  const config = {
    checking: {
      icon: Loader2, spin: true,
      text: `Checking ${who} on WhatsApp…`,
      cls: 'text-slate-500 border-slate-200 bg-stone-50/60'
    },
    yes: {
      icon: Check, spin: false,
      text: `${who} is on WhatsApp · updates enabled`,
      cls: 'text-emerald-700 border-emerald-200 bg-emerald-50'
    },
    no: {
      icon: X, spin: false,
      text: `${who} isn't on WhatsApp · we'll text you by SMS`,
      cls: 'text-amber-700 border-amber-200 bg-amber-50'
    }
  }[status]

  const Icon = config.icon
  return (
    <div className={`mt-2.5 flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-medium ${config.cls}`}>
      <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${config.spin ? 'animate-spin' : ''}`} />
      <span>{config.text}</span>
    </div>
  )
}
