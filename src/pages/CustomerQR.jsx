import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ticket, Clock, Phone, MessageCircle, ArrowRight, User, Search } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'
import { restaurant } from '../data/sampleData.js'

export default function CustomerQR() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [whatsappDifferent, setWhatsappDifferent] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')

  const nameValid  = name.trim().length >= 2
  const phoneValid = /^\d{10}$/.test(mobile)
  const waValid    = !whatsappDifferent || /^\d{10}$/.test(whatsapp)
  const canContinue = nameValid && phoneValid && waValid

  const handleContinue = () => {
    if (!canContinue) return
    navigate('/token')
  }

  return (
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="hidden max-w-md md:block">
        <h1 className="text-xl font-semibold text-slate-900">After QR scan</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          This is what the customer sees when they scan the table or signboard QR.
          Name and mobile are captured, then the customer joins the live dine-in queue
          straight away. Express Food and Parcel each have their own separate QR / flow.
        </p>

        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <Step n={1} active done={false}>
            Enter name and mobile number. If WhatsApp is different, capture that too —
            order updates are sent there.
          </Step>
          <Step n={2} active={false} done={false}>
            Token is generated and added to the live dine-in queue instantly.
          </Step>
          <Step n={3} active={false} done={false}>
            Kitchen and counter staff see the new token in real time.
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

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 space-y-3"
        >
          <p className="text-center text-sm text-slate-600">
            Welcome! Enter your details to join the dine-in queue.
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
              We'll send token and order updates to your WhatsApp.
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              canContinue
                ? 'bg-brand-600 text-white shadow-soft hover:bg-brand-700'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            Join the queue <ArrowRight className="h-4 w-4" />
          </button>

          <HelperBanner>
            Scanning the table QR puts you straight into the dine-in queue.
            Express Food and Parcel orders use their own separate QR codes.
          </HelperBanner>

          <Link
            to="/check"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            <Search className="h-3.5 w-3.5" />
            Already ordered? Check my status
          </Link>
        </motion.div>
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
