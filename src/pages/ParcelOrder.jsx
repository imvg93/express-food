import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, ArrowRight, ArrowLeft, Leaf, Drumstick,
  CreditCard, Wallet, Smartphone, CheckCircle2,
  User, Phone, MessageCircle
} from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import UpsellCard from '../components/UpsellCard.jsx'
import { menu } from '../data/sampleData.js'

const pickupTimes = ['15 min', '30 min', '45 min', '60 min']
const payMethods  = [
  { id: 'upi',  label: 'UPI',         icon: Smartphone },
  { id: 'card', label: 'Card',        icon: CreditCard },
  { id: 'cash', label: 'Pay at pickup', icon: Wallet }
]

export default function ParcelOrder() {
  const [step, setStep]       = useState(0) // 0 = contact, 1 = menu, 2 = payment, 3 = done
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

  return (
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="hidden max-w-md md:block">
        <h1 className="text-xl font-semibold text-slate-900">Parcel order</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Customer picks items, chooses a pickup time and pays — kitchen starts cooking
          immediately and a parcel token is generated. They just walk in, show the
          token, and collect.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>• No queue waiting — order is ready when they arrive.</li>
          <li>• Pre-paid orders cut down on cancellations.</li>
          <li>• Counter staff search by parcel token to hand it over.</li>
        </ul>
      </div>

      <PhoneFrame title="Customer view">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Parcel Order</div>
            <div className="text-[11px] text-slate-500">
              {step === 0 && 'Tell us who you are'}
              {step === 1 && 'Choose items & pickup time'}
              {step === 2 && 'Choose payment'}
              {step === 3 && 'Order confirmed'}
            </div>
          </div>
        </div>

        {/* tiny step indicator */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {[0, 1, 2, 3].map(n => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all ${
                step === n ? 'w-6 bg-violet-600' : 'w-1.5 bg-slate-300'
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
                  We'll send pickup updates to WhatsApp.
                </p>
              </div>

              <button
                onClick={() => canContinue && setStep(1)}
                disabled={!canContinue}
                className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  canContinue
                    ? 'bg-violet-600 text-white shadow-soft hover:bg-violet-700'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                }`}
              >
                Continue to menu <ArrowRight className="h-4 w-4" />
              </button>

              <HelperBanner>
                Parcel orders need your number so we can confirm and notify you when
                the food is ready for pickup.
              </HelperBanner>
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
              <div className="mb-3 flex items-center justify-between text-xs">
                <button
                  onClick={() => setStep(0)}
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

              <div className="space-y-2">
                {menu.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.18 }}
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

              <div className="mt-3">
                <span className="mb-1 block text-xs font-medium text-slate-600">Pickup time</span>
                <div className="grid grid-cols-4 gap-2">
                  {pickupTimes.map(t => (
                    <button
                      key={t}
                      onClick={() => setPickup(t)}
                      className={`rounded-lg px-2 py-1.5 text-xs transition ${
                        pickup === t
                          ? 'bg-violet-600 text-white'
                          : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {summary.items.length} item{summary.items.length === 1 ? '' : 's'}
                  </span>
                  <span className="font-semibold text-slate-900">₹{summary.total}</span>
                </div>
              </div>

              <button
                onClick={() => summary.total > 0 && setStep(2)}
                disabled={summary.total === 0}
                className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  summary.total > 0
                    ? 'bg-violet-600 text-white hover:bg-violet-700'
                    : 'pointer-events-none bg-slate-100 text-slate-400'
                }`}
              >
                Continue to payment <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-3">
                <HelperBanner>
                  Pick your items and pickup time. Kitchen starts cooking right after
                  payment so it's ready when you arrive.
                </HelperBanner>
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
              className="mt-4"
            >
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to menu
              </button>

              <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <div className="text-xs font-medium text-slate-600">Order summary</div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {summary.items.map(it => (
                    <li key={it.id} className="flex items-center justify-between">
                      <span className="truncate text-slate-800">{it.name} × {it.qty}</span>
                      <span className="text-slate-600">₹{it.qty * it.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 space-y-1 border-t border-slate-100 pt-2 text-xs text-slate-600">
                  <Row label="Subtotal">₹{summary.subtotal}</Row>
                  <Row label="Packing charge">₹{summary.packing}</Row>
                  <Row label="Pickup in">{pickup}</Row>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="text-sm font-medium text-slate-900">Total</span>
                  <span className="text-base font-semibold text-slate-900">₹{summary.total}</span>
                </div>
              </div>

              <div className="mt-3">
                <UpsellCard accent="violet" />
              </div>

              <div className="mt-3">
                <span className="mb-1.5 block text-xs font-medium text-slate-600">Payment method</span>
                <div className="space-y-1.5">
                  {payMethods.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPay(m.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                        pay === m.id
                          ? 'border-violet-600 bg-violet-50 text-violet-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <m.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{m.label}</span>
                      <span className={`h-4 w-4 rounded-full border-2 ${
                        pay === m.id ? 'border-violet-600 bg-violet-600' : 'border-slate-300'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-violet-700"
              >
                {pay === 'cash' ? `Confirm · pay ₹${summary.total} at pickup` : `Pay ₹${summary.total} now`}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-3">
                <HelperBanner>
                  Choose how you'd like to pay. Cash on pickup is allowed — but pre-paid
                  parcel orders get priority in the kitchen.
                </HelperBanner>
              </div>
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-pop">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="mt-3 text-sm text-emerald-600">
                {pay === 'cash' ? 'Order confirmed · pay at pickup' : 'Payment successful'}
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-wide text-slate-900">{token}</div>
              <div className="text-[11px] text-slate-500">Parcel token · pickup in {pickup}</div>

              <div className="mt-3 rounded-xl bg-white p-3 text-left ring-1 ring-slate-200">
                <Row label="Order amount" border>
                  <span className="text-sm font-semibold text-slate-900">₹{summary.total}</span>
                </Row>
                <Row label="Payment status" border>
                  <StatusBadge status={pay === 'cash' ? 'Pending' : 'Paid'} />
                </Row>
                <Row label="Order type">
                  <StatusBadge status="Parcel" />
                </Row>
              </div>

              <Link
                to="/tracking?type=parcel"
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Track parcel status <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-3 text-left">
                <HelperBanner tone="success">
                  Your parcel token is generated. Show <span className="font-medium">{token}</span> at
                  the counter when you arrive to collect.
                </HelperBanner>
              </div>

              <div className="mt-2 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-left text-[11px] text-emerald-800 ring-1 ring-emerald-100">
                <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.66 14.99L2 22l5.16-1.34A10 10 0 1012 2z"/></svg>
                <span>
                  A tracking link has been sent to your WhatsApp ({mobile ? `+91 ${mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}` : 'your number'}) —
                  tap it any time to check pickup status. No login needed.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>
    </div>
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
        className="h-6 w-6 rounded bg-violet-50 text-violet-700 hover:bg-violet-100"
      >+</button>
    </div>
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

function ContactField({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
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
        checked ? 'bg-violet-600' : 'bg-slate-300'
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
