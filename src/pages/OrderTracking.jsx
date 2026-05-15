import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Loader2, Users, Clock, Truck, ShoppingBag, Ticket, Radio } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'

/* each flow has its own timeline.
   dine-in token = seat queue (no food prep stages)
   express + parcel = food order lifecycle */
const flows = {
  'dine-in': {
    title:       'Dine-in token',
    icon:        Ticket,
    accent:      'brand',
    token:       'T-1048',
    headerLeft:  { label: 'Queue position', value: '#3' },
    headerRight: { label: 'Estimated wait', value: '~ 8 min' },
    helper:      "You'll be called to the counter when a seat is free. Keep this page open — your position updates live.",
    stages: [
      { key: 'generated', label: 'Token generated' },
      { key: 'queue',     label: 'Waiting in queue' },
      { key: 'called',    label: 'Called to counter' },
      { key: 'seated',    label: 'Seated' }
    ]
  },
  express: {
    title:       'Express food',
    icon:        Truck,
    accent:      'accent',
    token:       'E-1048',
    headerLeft:  { label: 'Distance from store', value: '4.2 km' },
    headerRight: { label: 'Estimated ready in',  value: '~ 12 min' },
    helper:      'Cooking starts when you enter the 3 km zone. Your live order progress is shown here.',
    stages: [
      { key: 'placed',    label: 'Order placed' },
      { key: 'accepted',  label: 'Accepted by kitchen' },
      { key: 'preparing', label: 'Preparing' },
      { key: 'ready',     label: 'Ready for pickup' },
      { key: 'served',    label: 'Served' }
    ]
  },
  parcel: {
    title:       'Parcel order',
    icon:        ShoppingBag,
    accent:      'violet',
    token:       'P-2031',
    headerLeft:  { label: 'Pickup in',          value: '~ 22 min' },
    headerRight: { label: 'Estimated ready in', value: '~ 14 min' },
    helper:      'Kitchen has started cooking. Show your token at the counter to collect when ready.',
    stages: [
      { key: 'placed',    label: 'Order placed' },
      { key: 'accepted',  label: 'Accepted by kitchen' },
      { key: 'preparing', label: 'Preparing' },
      { key: 'ready',     label: 'Ready for pickup' },
      { key: 'picked',    label: 'Picked up' }
    ]
  }
}

const accentMap = {
  brand:  { dot: '#2f6fff', soft: 'bg-brand-50 text-brand-700',   chip: 'text-brand-700' },
  accent: { dot: '#f97316', soft: 'bg-orange-50 text-orange-700', chip: 'text-orange-700' },
  violet: { dot: '#7c3aed', soft: 'bg-violet-50 text-violet-700', chip: 'text-violet-700' }
}

export default function OrderTracking() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') in flows ? params.get('type') : 'dine-in'
  const flow = flows[type]
  const accent = accentMap[flow.accent]

  const [stage, setStage] = useState(type === 'dine-in' ? 1 : 2)
  const [position, setPosition] = useState(3)
  const [lastTick, setLastTick] = useState(Date.now())
  const [now, setNow] = useState(Date.now())

  /* subtle auto-progression so the demo feels alive */
  useEffect(() => {
    setStage(type === 'dine-in' ? 1 : 2)
    setPosition(3)
    setLastTick(Date.now())
    const id = setInterval(() => {
      setStage(s => (s >= flow.stages.length - 1 ? (type === 'dine-in' ? 1 : 2) : s + 1))
      if (type === 'dine-in') {
        setPosition(p => (p <= 0 ? 3 : p - 1))
        setLastTick(Date.now())
      }
    }, 3000)
    return () => clearInterval(id)
  }, [type])

  useEffect(() => {
    if (type !== 'dine-in') return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [type])

  const liveWait        = Math.max(0, position * 3)
  const secondsSinceTick = Math.max(0, Math.floor((now - lastTick) / 1000))

  return (
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="hidden max-w-md md:block">
        <h1 className="text-xl font-semibold text-slate-900">Order tracking</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          The tracker switches based on what the customer chose. A <span className="font-medium text-slate-900">dine-in token</span> is
          a seat-queue ticket. <span className="font-medium text-slate-900">Express</span> and <span className="font-medium text-slate-900">Parcel</span> are
          food orders with prep stages.
        </p>

        <div className="mt-4 inline-flex rounded-lg bg-white p-1 ring-1 ring-slate-200">
          {Object.entries(flows).map(([key, f]) => {
            const active = type === key
            return (
              <button
                key={key}
                onClick={() => setParams({ type: key })}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition ${
                  active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <f.icon className="h-3.5 w-3.5" />
                {key === 'dine-in' ? 'Dine-in' : key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            )
          })}
        </div>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          {type === 'dine-in' && (
            <>
              <li>• No food-prep stages — token is for getting a seat.</li>
              <li>• Live queue position + ETA update automatically.</li>
              <li>• Staff just calls the next token when a seat is free.</li>
            </>
          )}
          {type === 'express' && (
            <>
              <li>• Cooking only starts inside the 3 km zone.</li>
              <li>• Customer sees prep + ready stages in real time.</li>
              <li>• Reduces "how long?" interruptions for staff.</li>
            </>
          )}
          {type === 'parcel' && (
            <>
              <li>• Kitchen starts cooking right after payment.</li>
              <li>• Customer walks in, shows token, collects parcel.</li>
              <li>• Counter staff search by parcel token to hand over.</li>
            </>
          )}
        </ul>
      </div>

      <PhoneFrame title="Customer view">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent.soft}`}>
            <flow.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">{flow.title}</div>
            <div className={`text-[11px] font-medium ${accent.chip}`}>{flow.token}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {type === 'dine-in' ? (
            <>
              <Stat
                icon={Users}
                label="Queue position"
                value={position === 0 ? "It's your turn!" : `#${position}`}
                live
              />
              <Stat
                icon={Clock}
                label="Estimated wait"
                value={position === 0 ? 'Now' : `~ ${liveWait} min`}
                live
              />
            </>
          ) : (
            <>
              <Stat icon={flow.headerLeft.label.includes('position') ? Users : Clock} label={flow.headerLeft.label} value={flow.headerLeft.value} />
              <Stat icon={Clock} label={flow.headerRight.label} value={flow.headerRight.value} />
            </>
          )}
        </div>

        {type === 'dine-in' && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <Radio className="h-3 w-3 text-emerald-500" />
            Live · updated {secondsSinceTick === 0 ? 'just now' : `${secondsSinceTick}s ago`}
          </div>
        )}

        <ol className="mt-4 space-y-3">
          {flow.stages.map((s, i) => {
            const done = i < stage
            const current = i === stage
            return (
              <li key={s.key} className="flex items-center gap-3">
                <motion.span
                  initial={false}
                  animate={{
                    backgroundColor: done ? '#10b981' : current ? accent.dot : '#e5e7eb',
                    color: done || current ? '#ffffff' : '#94a3b8'
                  }}
                  transition={{ duration: 0.25 }}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs"
                >
                  {done
                    ? <Check className="h-3.5 w-3.5" />
                    : current
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : i + 1}
                </motion.span>
                <div className="flex flex-1 items-center justify-between">
                  <span className={`text-sm ${current ? 'font-medium text-slate-900' : done ? 'text-slate-700' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                  {current && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-[11px] font-medium ${accent.chip}`}
                    >In progress</motion.span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-4">
          <HelperBanner>{flow.helper}</HelperBanner>
        </div>
      </PhoneFrame>
    </div>
  )
}

function Stat({ icon: Icon, label, value, live }) {
  return (
    <div className="rounded-lg bg-white p-2.5 ring-1 ring-slate-200">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      {live ? (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-0.5 text-sm font-semibold text-slate-900"
        >
          {value}
        </motion.div>
      ) : (
        <div className="mt-0.5 text-sm font-semibold text-slate-900">{value}</div>
      )}
    </div>
  )
}
