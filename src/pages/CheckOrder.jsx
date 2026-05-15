import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, Search, Ticket, Truck, ShoppingBag, ArrowRight,
  MessageCircle, Clock, MapPin
} from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'

const TYPE_META = {
  'Dine-in': { icon: Ticket,      to: '/tracking?type=dine-in', chip: 'bg-brand-50 text-brand-700',   accent: 'text-brand-700'   },
  'Express': { icon: Truck,       to: '/tracking?type=express', chip: 'bg-orange-50 text-orange-700', accent: 'text-orange-700' },
  'Parcel':  { icon: ShoppingBag, to: '/tracking?type=parcel',  chip: 'bg-violet-50 text-violet-700', accent: 'text-violet-700' }
}

/* demo lookup — any 10-digit number returns a stub list of active orders.
   in production this would call the backend filtered by mobile + recent window. */
function lookupOrdersFor(mobile) {
  if (!/^\d{10}$/.test(mobile)) return []
  const seed = parseInt(mobile.slice(-3), 10) % 3
  const sample = [
    [
      { token: 'T-1048', type: 'Dine-in', status: 'Waiting in queue',    detail: 'Queue position #3 · ~ 9 min', when: '4 min ago'  }
    ],
    [
      { token: 'P-2031', type: 'Parcel',  status: 'Preparing',           detail: 'Pickup in ~ 14 min',          when: '6 min ago'  },
      { token: 'T-1042', type: 'Dine-in', status: 'Called to counter',   detail: 'Show token at counter',       when: '12 min ago' }
    ],
    [
      { token: 'E-1052', type: 'Express', status: 'Cooking started',     detail: '2.8 km away · ~ 12 min',      when: '2 min ago'  }
    ]
  ]
  return sample[seed]
}

export default function CheckOrder() {
  const navigate = useNavigate()
  const [mobile, setMobile]   = useState('')
  const [submitted, setSubmitted] = useState(false)

  const phoneValid = /^\d{10}$/.test(mobile)
  const orders = useMemo(() => (submitted ? lookupOrdersFor(mobile) : []), [submitted, mobile])

  const handleCheck = () => {
    if (!phoneValid) return
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="hidden max-w-md md:block">
        <h1 className="text-xl font-semibold text-slate-900">Check my order</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          No login. Customer just enters their mobile number to see live status of
          any active order — dine-in token, parcel pickup, or express food.
          A WhatsApp deep-link is also sent on every order so they can re-open the
          tracker from chat with one tap.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>• Mobile-only lookup — same number used at order time.</li>
          <li>• WhatsApp link is the primary channel; this is the fallback.</li>
          <li>• Each row deep-links into the live tracker.</li>
        </ul>
      </div>

      <PhoneFrame title="Customer view">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Search className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-slate-900">Track my order</h2>
          <p className="text-xs text-slate-500">Enter your mobile to see live status</p>
        </div>

        <div className="mt-4 space-y-3">
          <Field label="Mobile number" icon={Phone}>
            <input
              value={mobile}
              onChange={e => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setSubmitted(false) }}
              placeholder="10-digit mobile"
              inputMode="numeric"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              onKeyDown={e => e.key === 'Enter' && handleCheck()}
            />
          </Field>

          <button
            onClick={handleCheck}
            disabled={!phoneValid}
            className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              phoneValid
                ? 'bg-brand-600 text-white shadow-soft hover:bg-brand-700'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            Check status <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {submitted && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="mt-4 space-y-2"
            >
              {orders.length === 0 ? (
                <div className="rounded-lg bg-white p-4 text-center text-sm text-slate-500 ring-1 ring-slate-200">
                  No active orders found for this number.
                </div>
              ) : (
                <>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Active orders ({orders.length})
                  </div>
                  {orders.map((o, i) => {
                    const meta = TYPE_META[o.type]
                    const Icon = meta.icon
                    return (
                      <motion.button
                        key={o.token}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.22 }}
                        onClick={() => navigate(meta.to)}
                        className="w-full rounded-xl bg-white p-3 text-left ring-1 ring-slate-200 transition hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${meta.chip}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-semibold text-slate-900">{o.token}</span>
                              <span className={`text-[11px] font-medium ${meta.accent}`}>· {o.type}</span>
                            </div>
                            <div className="mt-0.5 truncate text-[11px] text-slate-500">
                              {o.status} · {o.detail}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        </div>
                        <div className="mt-1.5 flex items-center gap-1 pl-11 text-[10px] text-slate-400">
                          <Clock className="h-3 w-3" /> Placed {o.when}
                        </div>
                      </motion.button>
                    )
                  })}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4">
          <HelperBanner>
            <div className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span>
                We also send a tracking link on WhatsApp the moment you place an
                order — tap it any time to come straight back here.
              </span>
            </div>
          </HelperBanner>
        </div>

        <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-400">
          <Link to="/qr" className="inline-flex items-center gap-1 hover:text-slate-600">
            <MapPin className="h-3 w-3" /> Scan a new QR
          </Link>
        </div>
      </PhoneFrame>
    </div>
  )
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        {children}
      </div>
    </label>
  )
}
