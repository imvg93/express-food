import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Plus, Check } from 'lucide-react'
import { revenueImpact } from '../data/sampleData.js'

/* tiny upsell strip used on /express and /parcel payment step.
   the visible "32% of customers add this" hint is the bit that sells
   the feature to the restaurant owner. */
export default function UpsellCard({ accent = 'orange', onAdd }) {
  const [added, setAdded] = useState({})

  const toggle = (s) => {
    setAdded(a => {
      const next = { ...a, [s.id]: !a[s.id] }
      onAdd?.(s, next[s.id])
      return next
    })
  }

  const tone = {
    orange: { ring: 'ring-orange-200', bg: 'bg-orange-50',  pill: 'bg-orange-100 text-orange-700', cta: 'bg-orange-500 hover:bg-orange-600 text-white', chip: 'text-orange-700' },
    violet: { ring: 'ring-violet-200', bg: 'bg-violet-50',  pill: 'bg-violet-100 text-violet-700', cta: 'bg-violet-600 hover:bg-violet-700 text-white', chip: 'text-violet-700' }
  }[accent]

  return (
    <div className={`rounded-xl ${tone.bg} p-3 ring-1 ring-inset ${tone.ring}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <Sparkles className={`h-3.5 w-3.5 ${tone.chip}`} />
        <span className={tone.chip}>Customers also added</span>
      </div>

      <div className="mt-2 space-y-1.5">
        {revenueImpact.upsell.suggestions.map(s => {
          const isAdded = !!added[s.id]
          return (
            <motion.button
              key={s.id}
              onClick={() => toggle(s)}
              whileTap={{ scale: 0.98 }}
              className={`flex w-full items-center gap-2 rounded-lg bg-white px-2.5 py-2 text-left ring-1 transition ${
                isAdded ? `${tone.ring} ring-1` : 'ring-slate-200 hover:ring-slate-300'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-slate-900">{s.name}</div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-medium text-slate-700">+₹{s.addOn}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 ${tone.pill}`}>
                    {s.conversion}% add this
                  </span>
                </div>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                {isAdded ? (
                  <motion.span
                    key="added"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${tone.cta}`}
                  >
                    <Check className="h-3.5 w-3.5" /> Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
