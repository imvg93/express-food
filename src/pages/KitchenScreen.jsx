import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Flame, MapPin, Truck } from 'lucide-react'
import HelperBanner from '../components/HelperBanner.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { liveQueue, menu } from '../data/sampleData.js'

/* attach a sample order item list to each token, so the kitchen card feels real */
const sampleItemsByToken = {
  'T-1042': [{ name: 'Butter Chicken', qty: 1 }, { name: 'Butter Naan', qty: 4 }],
  'T-1043': [{ name: 'Paneer Butter Masala', qty: 2 }, { name: 'Veg Biryani', qty: 1 }, { name: 'Tandoori Roti', qty: 6 }],
  'T-1044': [{ name: 'Chicken Biryani', qty: 1 }],
  'T-1045': [{ name: 'Masala Dosa', qty: 3 }, { name: 'Filter Coffee', qty: 3 }],
  'T-1046': [{ name: 'Paneer Butter Masala', qty: 1 }, { name: 'Butter Naan', qty: 4 }],
  'T-1047': [{ name: 'Veg Biryani', qty: 1 }, { name: 'Filter Coffee', qty: 1 }]
}

const next = { New: 'Accepted', Accepted: 'Preparing', Preparing: 'Ready', Ready: 'Ready' }
const cta  = { New: 'Accept', Accepted: 'Start preparing', Preparing: 'Mark ready', Ready: 'Done' }

export default function KitchenScreen() {
  const [orders, setOrders] = useState(liveQueue)

  const advance = (token) => {
    setOrders(curr =>
      curr.map(o => o.token === token ? { ...o, status: next[o.status] } : o)
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Kitchen screen</h1>
          <p className="mt-1 text-sm text-slate-500">
            Designed to be readable across the kitchen. One tap moves an order forward.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 ring-1 ring-inset ring-emerald-100 sm:self-auto">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulseSoft" />
          Live · auto-syncs with customer phones
        </div>
      </div>

      <HelperBanner>
        Kitchen staff accept and update orders here. Express orders are highlighted with
        a priority badge — they cook only after the customer enters the 3 km zone.
      </HelperBanner>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {orders.map(o => {
            const items = sampleItemsByToken[o.token] || [{ name: 'Chef special', qty: 1 }]
            return (
              <motion.div
                layout
                key={o.token}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className={`relative rounded-xl border bg-white p-4 shadow-card transition hover:shadow-soft ${
                  o.priority ? 'border-orange-200' : 'border-slate-200'
                }`}
              >
                {o.priority && (
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700 ring-1 ring-inset ring-orange-100">
                    <Flame className="h-3 w-3" /> Express priority
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <ChefHat className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{o.token}</div>
                    <div className="text-[11px] text-slate-500">{o.name} · {o.people} pax</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={o.type} />
                  <StatusBadge status={o.status} dot={o.status === 'Preparing'} />
                  <StatusBadge status={o.payment} />
                </div>

                <ul className="mt-3 space-y-1 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  {items.map((it, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-slate-800">{it.name}</span>
                      <span className="text-xs text-slate-500">× {it.qty}</span>
                    </li>
                  ))}
                </ul>

                {o.type === 'Express' && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-orange-500" />
                    Customer arrival · <span className="font-medium text-slate-900">within 3 km</span>
                  </div>
                )}

                <button
                  onClick={() => advance(o.token)}
                  disabled={o.status === 'Ready'}
                  className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition ${
                    o.status === 'Ready'
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {cta[o.status]}
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
