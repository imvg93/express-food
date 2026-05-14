import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Truck, ShoppingBag, Clock, Phone, MessageCircle, ArrowRight, ArrowLeft, User } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'
import { restaurant } from '../data/sampleData.js'

const options = [
  {
    to: '/token',
    icon: Ticket,
    title: 'Get Dine-in Token',
    sub: 'Join the live queue inside the restaurant',
    color: 'bg-brand-600 text-white hover:bg-brand-700'
  },
  {
    to: '/express',
    icon: Truck,
    title: 'Book Express Food',
    sub: 'For highway travellers · food ready on arrival',
    color: 'bg-accent-500 text-white hover:bg-accent-600'
  },
  {
    to: '/parcel',
    icon: ShoppingBag,
    title: 'Parcel Order',
    sub: 'Pre-order takeaway and skip the queue',
    color: 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50'
  }
]

export default function CustomerQR() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [whatsappDifferent, setWhatsappDifferent] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')

  const nameValid  = name.trim().length >= 2
  const phoneValid = /^\d{10}$/.test(mobile)
  const waValid    = !whatsappDifferent || /^\d{10}$/.test(whatsapp)
  const canContinue = nameValid && phoneValid && waValid

  return (
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="max-w-md">
        <h1 className="text-xl font-semibold text-slate-900">After QR scan</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          This is what the customer sees the moment they scan the table or signboard QR.
          A 2-step flow — capture contact, then offer the three ways to order.
        </p>

        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <Step n={1} active={step === 1} done={step > 1}>
            Enter name and mobile number. If WhatsApp is different, capture that too —
            order updates are sent there.
          </Step>
          <Step n={2} active={step === 2} done={false}>
            Choose <span className="font-medium text-slate-900">Token</span>,{' '}
            <span className="font-medium text-slate-900">Express Food</span>, or{' '}
            <span className="font-medium text-slate-900">Parcel</span>.
          </Step>
          <Step n={3} active={false} done={false}>
            Token / order goes live to the kitchen and counter staff instantly.
          </Step>
        </div>
      </div>

      <PhoneFrame title="Customer view">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Ticket className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-slate-900">{restaurant.name}</h2>
          <p className="text-xs text-slate-500">{restaurant.tagline}</p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            Estimated wait · {restaurant.estimatedWait} min
          </div>
        </div>

        {/* tiny step indicator */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {[1, 2].map(n => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all ${
                step === n ? 'w-6 bg-brand-600' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-3"
            >
              <p className="text-center text-sm text-slate-600">
                Welcome! Let's get your details first.
              </p>

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

                <AnimatePresence initial={false}>
                  {whatsappDifferent && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  We'll send token and order updates to your WhatsApp.
                </p>
              </div>

              <button
                onClick={() => canContinue && setStep(2)}
                disabled={!canContinue}
                className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  canContinue
                    ? 'bg-brand-600 text-white shadow-soft hover:bg-brand-700'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                }`}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>

              <HelperBanner>
                Enter your mobile to continue. Toggle the WhatsApp option only if it's a
                different number — most customers can leave it off.
              </HelperBanner>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <div className="min-w-0 truncate text-right text-slate-500">
                  <span className="font-medium text-slate-700">{name.trim()}</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  +91 {mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}
                </div>
              </div>

              <p className="mt-3 text-center text-sm text-slate-600">
                Hi {name.trim().split(' ')[0]}, choose how you'd like to order today.
              </p>

              <div className="mt-3 space-y-2.5">
                {options.map((opt, i) => (
                  <motion.div
                    key={opt.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.22 }}
                  >
                    <Link
                      to={opt.to}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${opt.color}`}
                    >
                      <opt.icon className="h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{opt.title}</div>
                        <div className="text-[11px] opacity-80">{opt.sub}</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4">
                <HelperBanner>
                  Choose an option to continue. You can get a dine-in token, pre-book
                  food before arrival, or place a parcel order.
                </HelperBanner>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PhoneFrame>
    </div>
  )
}

function Step({ n, active, done, children }) {
  return (
    <div className="flex gap-3">
      <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${
        done
          ? 'bg-emerald-100 text-emerald-700'
          : active
            ? 'bg-brand-600 text-white'
            : 'bg-slate-100 text-slate-500'
      }`}>{n}</span>
      <p>{children}</p>
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

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition ${
        checked ? 'bg-brand-600' : 'bg-slate-300'
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
