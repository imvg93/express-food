import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Truck, ArrowRight, ArrowLeft, Leaf, Drumstick, User, Phone,
  MessageCircle, Minus, Plus, Clock
} from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import { menu } from '../data/sampleData.js'

export default function ExpressFood() {
  const [step, setStep] = useState(1)
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
    const items = menu.map(m => ({ ...m, qty: qty[m.id] || 0 })).filter(i => i.qty > 0)
    const total = items.reduce((s, i) => s + i.qty * i.price, 0)
    return { items, total }
  }, [qty])

  return (
    <PhoneFrame title="Customer view">
      <Header step={step} />

      {step === 1 && (
        <motion.div
          key="contact"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-5 space-y-3"
        >
          <Field label="Your name" icon={User}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </Field>
          <Field label="Mobile number" icon={Phone}>
            <input
              value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile"
              inputMode="numeric"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </Field>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-700">
                <MessageCircle className="h-4 w-4 text-slate-500" />
                WhatsApp number is different
              </span>
              <Toggle checked={whatsappDifferent} onChange={() => setWhatsappDifferent(v => !v)} />
            </label>
            {whatsappDifferent && (
              <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-stone-50/60 px-3 py-2">
                <MessageCircle className="h-4 w-4 text-slate-500" />
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
              We'll send order updates to your WhatsApp.
            </p>
          </div>

          <PrimaryButton onClick={() => canContinue && setStep(2)} disabled={!canContinue}>
            Continue to menu <ArrowRight className="h-4 w-4" />
          </PrimaryButton>

          <Helper>
            Express orders need your number so the kitchen can confirm and notify you when food is ready at the counter.
          </Helper>
        </motion.div>
      )}

      {step === 2 && (
        <>
          <div className="mt-4 flex items-center justify-between text-[11px]">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 hover:bg-stone-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Edit details
            </button>
            <div className="min-w-0 truncate text-right text-slate-500">
              <span className="font-semibold text-slate-700">{name.trim()}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              +91 {mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {menu.slice(0, 6).map(m => (
              <MenuRow key={m.id} item={m} qty={qty[m.id] || 0} onChange={n => setItemQty(m.id, n)} />
            ))}
          </div>

          <div className="mt-4">
            <FieldLabel>Arrival time</FieldLabel>
            <div className="grid grid-cols-4 gap-2">
              {['15 min', '30 min', '45 min', '60 min'].map(t => (
                <button
                  key={t}
                  onClick={() => setArrival(t)}
                  className={`rounded-lg px-2 py-2 text-xs transition ${
                    arrival === t
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-stone-50'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <FieldLabel>Note for kitchen (optional)</FieldLabel>
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. less spicy"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-stone-50/60 px-3 py-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{summary.items.length} item{summary.items.length === 1 ? '' : 's'}</span>
              <span className="font-bold text-slate-900">₹{summary.total}</span>
            </div>
          </div>

          <Link
            to="/payment"
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              summary.total > 0
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'pointer-events-none bg-slate-100 text-slate-400'
            }`}
          >
            Pay & confirm order <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-3">
            <Helper>
              Food preparation starts only when you're within 3 km of the restaurant — so your order is fresh on arrival.
            </Helper>
          </div>
        </>
      )}
    </PhoneFrame>
  )
}

function Header({ step }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
        <Truck className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold tracking-tight text-slate-900">Express Food</div>
        <div className="text-[11px] text-slate-500">
          {step === 1 ? 'Tell us who you are' : 'Pre-order before you arrive'}
        </div>
      </div>
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{children}</span>
  )
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-slate-400">
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
        checked ? 'bg-slate-900' : 'bg-slate-300'
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

function MenuRow({ item, qty, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-50 text-2xl">
        {item.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {item.veg
            ? <Leaf className="h-3 w-3 flex-shrink-0 text-emerald-600" />
            : <Drumstick className="h-3 w-3 flex-shrink-0 text-rose-600" />}
          <span className="truncate text-sm font-semibold text-slate-900">{item.name}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">₹{item.price}</span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-0.5"><Clock className="h-3 w-3" /> {item.prepTime} min</span>
        </div>
      </div>
      <Qty value={qty} onChange={onChange} />
    </div>
  )
}

function Qty({ value, onChange }) {
  if (value === 0) {
    return (
      <button
        onClick={() => onChange(1)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-900 hover:bg-stone-50"
      >Add</button>
    )
  }
  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-900 px-1 py-1 text-white">
      <button onClick={() => onChange(value - 1)} className="h-6 w-6 rounded text-white hover:bg-white/10" aria-label="Less">
        <Minus className="mx-auto h-3.5 w-3.5" />
      </button>
      <div className="w-5 text-center text-xs font-bold">{value}</div>
      <button onClick={() => onChange(value + 1)} className="h-6 w-6 rounded text-white hover:bg-white/10" aria-label="More">
        <Plus className="mx-auto h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function PrimaryButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold transition ${
        disabled
          ? 'cursor-not-allowed bg-slate-100 text-slate-400'
          : 'bg-slate-900 text-white hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

function Helper({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-stone-50/60 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />
      <span>{children}</span>
    </div>
  )
}
