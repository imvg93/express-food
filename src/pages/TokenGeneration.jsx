import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ArrowRight, CheckCircle2, Clock, Minus, Plus, MessageCircle } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'

const TOKEN              = 'T-1048'
const INITIAL_POSITION   = 6
const MIN_PER_POSITION   = 2.5
const TICK_MS            = 6000

export default function TokenGeneration() {
  const [people, setPeople] = useState(2)
  const [queuePosition, setQueuePosition] = useState(INITIAL_POSITION)
  const [lastTick, setLastTick] = useState(Date.now())
  const [now, setNow] = useState(Date.now())
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setQueuePosition(p => (p > 0 ? p - 1 : 0))
      setLastTick(Date.now())
    }, TICK_MS)
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const wait              = Math.max(0, Math.round(queuePosition * MIN_PER_POSITION))
  const secondsSinceTick  = Math.max(0, Math.floor((now - lastTick) / 1000))
  const isYourTurn        = queuePosition === 0

  return (
    <PhoneFrame title="Customer view">
      {/* status icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
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
      </motion.div>

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
          A tracking link has been sent to your WhatsApp — tap it any time to see your live position.
        </HelperRow>
      </div>
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
