import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, MapPin, ArrowRight, Leaf, Drumstick, User, Phone, MessageCircle, ArrowLeft } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'
import UpsellCard from '../components/UpsellCard.jsx'
import { menu } from '../data/sampleData.js'

export default function ExpressFood() {
  const [step, setStep] = useState(1) // 1 = contact, 2 = menu
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [whatsappDifferent, setWhatsappDifferent] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')
  const [qty, setQty] = useState({})
  const [arrival, setArrival] = useState('30 min')
  const [note, setNote] = useState('')

  const nameValid  = name.trim().length >= 2
  const phoneValid = /^\d{10}$/.test(mobile)
  const waValid    = !whatsappDifferent || /^\d{10}$/.test(whatsapp)
  const canContinue = nameValid && phoneValid && waValid

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
      <div className="hidden max-w-md md:block">
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
            <div className="text-[11px] text-slate-500">
              {step === 1 ? 'Tell us who you are' : 'Pre-order before you arrive'}
            </div>
          </div>
        </div>

        {step === 1 && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            <ContactField label="Your name" icon={User}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </ContactField>

            <ContactField label="Mobile number" icon={Phone}>
              <input
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile"
                inputMode="numeric"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </ContactField>

            <div className="rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-700">
                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                  WhatsApp number is different
                </span>
                <Toggle
                  checked={whatsappDifferent}
                  onChange={() => setWhatsappDifferent(v => !v)}
                />
              </label>

              {whatsappDifferent && (
                <div className="mt-2.5 flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200">
                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                  <input
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="WhatsApp number"
                    inputMode="numeric"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              )}

              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                We'll send your order updates to WhatsApp.
              </p>
            </div>

            <button
              onClick={() => canContinue && setStep(2)}
              disabled={!canContinue}
              className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                canContinue
                  ? 'bg-accent-500 text-white shadow-soft hover:bg-accent-600'
                  : 'cursor-not-allowed bg-slate-100 text-slate-400'
              }`}
            >
              Continue to menu <ArrowRight className="h-4 w-4" />
            </button>

            <HelperBanner>
              Express orders need your number so the kitchen can confirm and notify
              you when food is ready at the counter.
            </HelperBanner>
          </motion.div>
        )}

        {step === 2 && (
        <>
        <div className="mt-3 flex items-center justify-between text-xs">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Edit details
          </button>
          <div className="min-w-0 truncate text-right text-slate-500">
            <span className="font-medium text-slate-700">{name.trim()}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            +91 {mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}
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
        </>
        )}
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

function ContactField({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-accent-400 focus-within:ring-2 focus-within:ring-orange-100">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        {children}
      </div>
    </label>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition ${
        checked ? 'bg-accent-500' : 'bg-slate-300'
      }`}
      aria-pressed={checked}
    >
      <motion.span
        layout
        className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
        style={{ left: checked ? '20px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
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
