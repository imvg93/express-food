import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ArrowRight, CheckCircle2, Clock, Radio } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'

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
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="hidden max-w-md md:block">
        <h1 className="text-xl font-semibold text-slate-900">Token confirmation</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          The token is generated the moment the customer taps "Get Dine-in Token" on
          the QR screen (name + mobile already captured). This page just confirms it,
          shows queue position, and asks how many people are dining.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>• Token instantly visible to kitchen and counter staff.</li>
          <li>• Customer sees their live queue position + ETA.</li>
          <li>• Number of people helps staff prepare seating.</li>
        </ul>
      </div>

      <PhoneFrame title="Customer view">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-pop">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="mt-3 text-sm text-emerald-600">Token added to live queue</div>
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="mt-1 text-3xl font-semibold tracking-wide text-slate-900"
          >
            {TOKEN}
          </motion.div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-left">
            <LiveStat
              icon={Users}
              label="Queue position"
              value={isYourTurn ? "It's your turn!" : `#${queuePosition}`}
              highlight={isYourTurn}
            />
            <LiveStat
              icon={Clock}
              label="Estimated wait"
              value={isYourTurn ? 'Now' : `${wait} min`}
              highlight={isYourTurn}
            />
          </div>

          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <Radio className="h-3 w-3 text-emerald-500" />
            Live · updated {secondsSinceTick === 0 ? 'just now' : `${secondsSinceTick}s ago`}
          </div>
        </motion.div>

        <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">How many people?</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="h-7 w-7 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              >−</button>
              <motion.div
                key={people}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
                className="w-8 text-center text-sm font-semibold text-slate-900"
              >{people}</motion.div>
              <button
                onClick={() => setPeople(people + 1)}
                className="h-7 w-7 rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100"
              >+</button>
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Helps staff prepare a suitable table — no other details needed.
          </p>
        </div>

        <Link
          to="/tracking?type=dine-in"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-brand-700"
        >
          Track queue position <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-3">
          <HelperBanner tone="success">
            Your token is for getting a seat. Show <span className="font-medium">{TOKEN}</span> at
            the counter when your number is called. No food order yet — you'll order at the table.
          </HelperBanner>
        </div>

        <div className="mt-2 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800 ring-1 ring-emerald-100">
          <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.66 14.99L2 22l5.16-1.34A10 10 0 1012 2z"/></svg>
          <span>
            We've also sent a tracking link to your WhatsApp — tap it any time to
            see your live position.
          </span>
        </div>
      </PhoneFrame>
    </div>
  )
}

function LiveStat({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`rounded-lg p-2.5 ring-1 transition ${
      highlight
        ? 'bg-emerald-50 ring-emerald-200'
        : 'bg-white ring-slate-200'
    }`}>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`mt-0.5 text-sm font-semibold ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}
      >
        {value}
      </motion.div>
    </div>
  )
}
