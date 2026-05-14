import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, MapPin, ArrowRight, Leaf, Drumstick } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'
import UpsellCard from '../components/UpsellCard.jsx'
import { menu } from '../data/sampleData.js'

export default function ExpressFood() {
  const [qty, setQty] = useState({})
  const [arrival, setArrival] = useState('30 min')
  const [note, setNote] = useState('')

  const setItemQty = (id, n) => setQty(q => ({ ...q, [id]: Math.max(0, n) }))

  const summary = useMemo(() => {
    const items = menu
      .map(m => ({ ...m, qty: qty[m.id] || 0 }))
      .filter(i => i.qty > 0)
    const total = items.reduce((s, i) => s + i.qty * i.price, 0)
    return { items, total }
  }, [qty])

  return (
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="max-w-md">
        <h1 className="text-xl font-semibold text-slate-900">Express food booking</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Highway customers pre-book food and pay in advance. The kitchen only starts
          cooking when they cross the <span className="font-medium text-slate-900">3 km radius</span>,
          so food is fresh and hot when they arrive.
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <MapPin className="h-4 w-4 text-accent-500" /> 3 km auto-trigger
          </div>
          <p className="mt-1.5 text-sm text-slate-600">
            Customer's location is checked at arrival time. Cooking starts automatically
            when they enter the 3 km zone — no manual call-ahead required.
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Truck className="h-4 w-4 text-accent-500" /> Why it sells
          </div>
          <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
            <li>• Zero wait time for highway travellers.</li>
            <li>• Pre-paid orders reduce cancellations.</li>
            <li>• Kitchen plans rush hour load in advance.</li>
          </ul>
        </div>
      </div>

      <PhoneFrame title="Customer view">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Express Food</div>
            <div className="text-[11px] text-slate-500">Pre-order before you arrive</div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {menu.slice(0, 5).map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200"
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded ${m.veg ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {m.veg ? <Leaf className="h-3.5 w-3.5" /> : <Drumstick className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-slate-900">{m.name}</div>
                <div className="text-[11px] text-slate-500">₹{m.price}</div>
              </div>
              <Qty value={qty[m.id] || 0} onChange={n => setItemQty(m.id, n)} />
            </motion.div>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          <Field label="Arrival time">
            <div className="grid grid-cols-4 gap-2">
              {['15 min', '30 min', '45 min', '60 min'].map(t => (
                <button
                  key={t}
                  onClick={() => setArrival(t)}
                  className={`rounded-lg px-2 py-1.5 text-xs transition ${
                    arrival === t
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >{t}</button>
              ))}
            </div>
          </Field>

          <Field label="Note for kitchen (optional)">
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. less spicy"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </Field>
        </div>

        <div className="mt-3">
          <UpsellCard accent="orange" />
        </div>

        <div className="mt-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{summary.items.length} item{summary.items.length === 1 ? '' : 's'}</span>
            <span className="font-semibold text-slate-900">₹{summary.total}</span>
          </div>
        </div>

        <Link
          to="/payment"
          className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            summary.total > 0
              ? 'bg-accent-500 text-white hover:bg-accent-600'
              : 'pointer-events-none bg-slate-100 text-slate-400'
          }`}
        >
          Pay & confirm order <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-3">
          <HelperBanner>
            Food preparation starts only when you're within 3 km of the restaurant —
            so your order is fresh on arrival.
          </HelperBanner>
        </div>
      </PhoneFrame>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  )
}

function Qty({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(value - 1)}
        className="h-6 w-6 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
      >−</button>
      <div className="w-5 text-center text-sm font-medium">{value}</div>
      <button
        onClick={() => onChange(value + 1)}
        className="h-6 w-6 rounded bg-brand-50 text-brand-700 hover:bg-brand-100"
      >+</button>
    </div>
  )
}
