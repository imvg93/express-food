import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, ArrowRight, ArrowLeft, Leaf, Drumstick,
  CreditCard, Wallet, Smartphone, CheckCircle2,
  User, Phone, MessageCircle, Minus, Plus, Clock
} from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import { menu } from '../data/sampleData.js'

const pickupTimes = ['15 min', '30 min', '45 min', '60 min']
const payMethods  = [
  { id: 'upi',  label: 'UPI',          icon: Smartphone },
  { id: 'card', label: 'Card',         icon: CreditCard },
  { id: 'cash', label: 'Pay at pickup',icon: Wallet }
]

export default function ParcelOrder() {
  const [step, setStep]       = useState(0)
  const [name, setName]       = useState('')
  const [mobile, setMobile]   = useState('')
  const [whatsappDifferent, setWhatsappDifferent] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')
  const [qty, setQty]         = useState({})
  const [pickup, setPickup]   = useState('30 min')
  const [pay, setPay]         = useState('upi')

  const nameValid   = name.trim().length >= 2
  const phoneValid  = /^\d{10}$/.test(mobile)
  const waValid     = !whatsappDifferent || /^\d{10}$/.test(whatsapp)
  const canContinue = nameValid && phoneValid && waValid

  const setItemQty = (id, n) => setQty(q => ({ ...q, [id]: Math.max(0, n) }))

  const summary = useMemo(() => {
    const items = menu.map(m => ({ ...m, qty: qty[m.id] || 0 })).filter(i => i.qty > 0)
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
    const packing  = items.length > 0 ? 15 : 0
    const total    = subtotal + packing
    return { items, subtotal, packing, total }
  }, [qty])

  const token = 'P-2031'

  const stepLabel = {
    0: 'Tell us who you are',
    1: 'Choose items & pickup time',
    2: 'Choose payment',
    3: 'Order confirmed'
  }[step]

  return (
    <PhoneFrame title="Customer view">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <ShoppingBag className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold tracking-tight text-slate-900">Parcel Order</div>
          <div className="text-[11px] text-slate-500">{stepLabel}</div>
        </div>
      </div>

      {/* step indicator */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {[0, 1, 2, 3].map(n => (
          <span
            key={n}
            className={`h-1 rounded-full transition-all ${
              step === n ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
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
                We'll send pickup updates to WhatsApp.
              </p>
            </div>

            <PrimaryButton onClick={() => canContinue && setStep(1)} disabled={!canContinue}>
              Continue to menu <ArrowRight className="h-4 w-4" />
            </PrimaryButton>

            <Helper>Parcel orders need your number so we can notify you when food is ready for pickup.</Helper>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <ContextRow
              onBack={() => setStep(0)}
              name={name}
              mobile={mobile}
            />

            <div className="mt-4 space-y-2">
              {menu.map(m => (
                <MenuRow key={m.id} item={m} qty={qty[m.id] || 0} onChange={n => setItemQty(m.id, n)} />
              ))}
            </div>

            <div className="mt-4">
              <FieldLabel>Pickup time</FieldLabel>
              <div className="grid grid-cols-4 gap-2">
                {pickupTimes.map(t => (
                  <button
                    key={t}
                    onClick={() => setPickup(t)}
                    className={`rounded-lg px-2 py-2 text-xs transition ${
                      pickup === t
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-stone-50'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-stone-50/60 px-3 py-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{summary.items.length} item{summary.items.length === 1 ? '' : 's'}</span>
                <span className="font-bold text-slate-900">₹{summary.total}</span>
              </div>
            </div>

            <PrimaryButton onClick={() => summary.total > 0 && setStep(2)} disabled={summary.total === 0}>
              Continue to payment <ArrowRight className="h-4 w-4" />
            </PrimaryButton>

            <div className="mt-3">
              <Helper>Pick your items and pickup time. Kitchen starts cooking right after payment.</Helper>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="pay"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-slate-500 hover:bg-stone-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to menu
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <FieldLabel>Order summary</FieldLabel>
              <ul className="mt-2 space-y-1.5 text-sm">
                {summary.items.map(it => (
                  <li key={it.id} className="flex items-center justify-between">
                    <span className="truncate text-slate-700">{it.name} <span className="text-slate-400">× {it.qty}</span></span>
                    <span className="text-slate-700">₹{it.qty * it.price}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                <Row label="Subtotal">₹{summary.subtotal}</Row>
                <Row label="Packing charge">₹{summary.packing}</Row>
                <Row label="Pickup in">{pickup}</Row>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2.5">
                <span className="text-sm font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-slate-900">₹{summary.total}</span>
              </div>
            </div>

            <div>
              <FieldLabel>Payment method</FieldLabel>
              <div className="space-y-2">
                {payMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPay(m.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ${
                      pay === m.id
                        ? 'border-slate-900 bg-stone-50/60 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-stone-50/40'
                    }`}
                  >
                    <m.icon className="h-4 w-4 flex-shrink-0 text-slate-700" />
                    <span className="flex-1 font-medium">{m.label}</span>
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      pay === m.id ? 'border-slate-900' : 'border-slate-300'
                    }`}>
                      {pay === m.id && <span className="h-2 w-2 rounded-full bg-slate-900" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <PrimaryButton onClick={() => setStep(3)}>
              {pay === 'cash' ? `Confirm · pay ₹${summary.total} at pickup` : `Pay ₹${summary.total} now`}
              <ArrowRight className="h-4 w-4" />
            </PrimaryButton>

            <Helper>Cash on pickup is allowed — but pre-paid parcel orders get priority in the kitchen.</Helper>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="mt-4 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {pay === 'cash' ? 'Order confirmed · pay at pickup' : 'Payment successful'}
            </div>
            <div className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{token}</div>
            <div className="text-[11px] text-slate-500">Parcel token · pickup in {pickup}</div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-left">
              <Row label="Order amount" border>
                <span className="text-sm font-bold text-slate-900">₹{summary.total}</span>
              </Row>
              <Row label="Payment status" border>
                <span className="rounded-md border border-slate-200 bg-stone-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {pay === 'cash' ? 'Pending' : 'Paid'}
                </span>
              </Row>
              <Row label="Order type">
                <span className="rounded-md border border-slate-200 bg-stone-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">Parcel</span>
              </Row>
            </div>

            <Link
              to="/tracking?type=parcel"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Track parcel status <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-3 text-left">
              <Helper>Show <span className="font-semibold text-slate-900">{token}</span> at the counter when you arrive to collect.</Helper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  )
}

function ContextRow({ onBack, name, mobile }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <button onClick={onBack} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 hover:bg-stone-50">
        <ArrowLeft className="h-3.5 w-3.5" /> Edit details
      </button>
      <div className="min-w-0 truncate text-right text-slate-500">
        <span className="font-semibold text-slate-700">{name.trim()}</span>
        <span className="mx-1.5 text-slate-300">·</span>
        +91 {mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}
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

function Row({ label, children, border = false }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${border ? 'border-b border-slate-100' : ''}`}>
      <span className="text-xs text-slate-500">{label}</span>
      <span>{children}</span>
    </div>
  )
}

function PrimaryButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold transition ${
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
