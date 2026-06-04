import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, ArrowRight, ArrowLeft, CheckCircle2, Clock, Minus, Plus,
  MessageCircle, User, Phone
} from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import WhatsAppCheck, { useWhatsAppCheck } from '../components/WhatsAppCheck.jsx'

const TOKEN              = 'T-1048'
const INITIAL_POSITION   = 6
const MIN_PER_POSITION   = 2.5
const TICK_MS            = 6000

export default function TokenGeneration() {
  const [step, setStep]       = useState('contact')   // 'contact' | 'queue'
  const [name, setName]       = useState('')
  const [mobile, setMobile]   = useState('')
  const [whatsappDifferent, setWhatsappDifferent] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')

  const [people, setPeople] = useState(2)
  const [queuePosition, setQueuePosition] = useState(INITIAL_POSITION)
  const [lastTick, setLastTick] = useState(Date.now())
  const [now, setNow] = useState(Date.now())
  const intervalRef = useRef(null)

  const nameValid  = name.trim().length >= 2
  const phoneValid = /^\d{10}$/.test(mobile)
  const waValid    = !whatsappDifferent || /^\d{10}$/.test(whatsapp)
  // the number we actually check WhatsApp against
  const waTarget   = whatsappDifferent ? whatsapp : mobile
  const waStatus   = useWhatsAppCheck(waTarget)
  const canContinue = nameValid && phoneValid && waValid && waStatus !== 'checking'

  /* queue position ticks down — only starts once the token is issued */
  useEffect(() => {
    if (step !== 'queue') return
    intervalRef.current = setInterval(() => {
      setQueuePosition(p => (p > 0 ? p - 1 : 0))
      setLastTick(Date.now())
    }, TICK_MS)
    return () => clearInterval(intervalRef.current)
  }, [step])

  useEffect(() => {
    if (step !== 'queue') return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [step])

  const wait              = Math.max(0, Math.round(queuePosition * MIN_PER_POSITION))
  const secondsSinceTick  = Math.max(0, Math.floor((now - lastTick) / 1000))
  const isYourTurn        = queuePosition === 0

  return (
    <PhoneFrame title="Customer view">
      <AnimatePresence mode="wait">
        {step === 'contact' ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold tracking-tight text-slate-900">Get a Table</div>
                <div className="text-[11px] text-slate-500">Tell us who you are</div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
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

                {/* WhatsApp availability check */}
                <WhatsAppCheck
                  status={waStatus}
                  number={waTarget}
                  idleHint="We'll check this number for WhatsApp and send your queue updates there."
                />
              </div>

              <PrimaryButton onClick={() => canContinue && setStep('queue')} disabled={!canContinue}>
                Join the queue <ArrowRight className="h-4 w-4" />
              </PrimaryButton>

              <Helper>
                We need your name and number to call you when your table is ready and to send live queue updates.
              </Helper>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="queue"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* who's in the queue */}
            <div className="flex items-center justify-between text-[11px]">
              <button
                onClick={() => setStep('contact')}
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

            {/* status icon */}
            <div className="mt-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Token added to live queue
              </div>
              <div className="mt-1 text-4xl font-bold tracking-tight text-slate-900">{TOKEN}</div>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-slate-300 opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-slate-900" />
                </span>
                Live · updated {secondsSinceTick === 0 ? 'just now' : `${secondsSinceTick}s ago`}
              </div>
            </div>

            {/* queue stats */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <LiveStat
                icon={Users}
                label="Queue position"
                value={isYourTurn ? "It's your turn" : `#${queuePosition}`}
                highlight={isYourTurn}
              />
              <LiveStat
                icon={Clock}
                label="Estimated wait"
                value={isYourTurn ? 'Now' : `${wait} min`}
                highlight={isYourTurn}
              />
            </div>

            {/* people counter */}
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">How many people?</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">Helps staff prepare your table.</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-stone-50"
                    aria-label="Fewer people"
                  ><Minus className="h-4 w-4" /></button>
                  <motion.div
                    key={people}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className="w-8 text-center text-lg font-bold text-slate-900"
                  >{people}</motion.div>
                  <button
                    onClick={() => setPeople(people + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                    aria-label="More people"
                  ><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {/* primary CTA */}
            <Link
              to="/tracking?type=dine-in"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Track queue position <ArrowRight className="h-4 w-4" />
            </Link>

            {/* helper rows */}
            <div className="mt-3 space-y-2">
              <HelperRow>
                Show <span className="font-semibold text-slate-900">{TOKEN}</span> at the counter when your number is called. No food order yet — you'll order at the table.
              </HelperRow>
              <HelperRow icon={MessageCircle}>
                {waStatus === 'no'
                  ? `We'll send your live tracking link by SMS to +91 ${waTarget.replace(/(\d{5})(\d{5})/, '$1 $2')} — that number isn't on WhatsApp.`
                  : `A tracking link has been sent to your WhatsApp — tap it any time to see your live position.`}
              </HelperRow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  )
}

function LiveStat({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`rounded-2xl border p-3 transition ${
      highlight ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
    }`}>
      <div className={`flex items-center gap-1.5 text-[11px] ${highlight ? 'text-white/70' : 'text-slate-500'}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-1 text-base font-bold"
      >
        {value}
      </motion.div>
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
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-100 bg-stone-50/60 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />
      <span>{children}</span>
    </div>
  )
}

function HelperRow({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-stone-50/60 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
      {Icon
        ? <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
        : <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />}
      <span>{children}</span>
    </div>
  )
}
