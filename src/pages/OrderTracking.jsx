import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Loader2, Users, Clock, Truck, ShoppingBag, Ticket } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'

const flows = {
  'dine-in': {
    title:       'Dine-in token',
    icon:        Ticket,
    token:       'T-1048',
    headerLeft:  { label: 'Queue position', value: '#3', icon: Users  },
    headerRight: { label: 'Estimated wait', value: '~ 8 min', icon: Clock },
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
    token:       'E-1048',
    headerLeft:  { label: 'Distance from store', value: '4.2 km', icon: Truck },
    headerRight: { label: 'Ready in',            value: '~ 12 min', icon: Clock },
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
    token:       'P-2031',
    headerLeft:  { label: 'Pickup in', value: '~ 22 min', icon: Clock },
    headerRight: { label: 'Ready in',  value: '~ 14 min', icon: Clock },
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

export default function OrderTracking() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') in flows ? params.get('type') : 'dine-in'
  const flow = flows[type]

  const [stage, setStage] = useState(type === 'dine-in' ? 1 : 2)
  const [position, setPosition] = useState(3)
  const [lastTick, setLastTick] = useState(Date.now())
  const [now, setNow] = useState(Date.now())

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
    <PhoneFrame title="Customer view">
      {/* tabs */}
      <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-stone-50/60 p-1">
        {Object.entries(flows).map(([key, f]) => {
          const active = type === key
          return (
            <button
              key={key}
              onClick={() => setParams({ type: key })}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition ${
                active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <f.icon className="h-3.5 w-3.5" />
              {key === 'dine-in' ? 'Dine-in' : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          )
        })}
      </div>

      {/* header */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <flow.icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold tracking-tight text-slate-900">{flow.title}</div>
          <div className="text-[11px] font-mono font-semibold text-slate-600">{flow.token}</div>
        </div>
      </div>

      {/* live stats */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {type === 'dine-in' ? (
          <>
            <Stat icon={Users} label="Queue position" value={position === 0 ? "It's your turn" : `#${position}`} live />
            <Stat icon={Clock} label="Estimated wait" value={position === 0 ? 'Now' : `~ ${liveWait} min`} live />
          </>
        ) : (
          <>
            <Stat icon={flow.headerLeft.icon}  label={flow.headerLeft.label}  value={flow.headerLeft.value} />
            <Stat icon={flow.headerRight.icon} label={flow.headerRight.label} value={flow.headerRight.value} />
          </>
        )}
      </div>

      {type === 'dine-in' && (
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-slate-300 opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-slate-900" />
          </span>
          Live · updated {secondsSinceTick === 0 ? 'just now' : `${secondsSinceTick}s ago`}
        </div>
      )}

      {/* stages timeline */}
      <ol className="mt-5 space-y-3.5">
        {flow.stages.map((s, i) => {
          const done = i < stage
          const current = i === stage
          return (
            <li key={s.key} className="flex items-center gap-3">
              <motion.span
                initial={false}
                animate={{
                  backgroundColor: done || current ? '#0f172a' : '#ffffff',
                  borderColor:    done || current ? '#0f172a' : '#cbd5e1',
                  color:          done || current ? '#ffffff' : '#94a3b8'
                }}
                transition={{ duration: 0.25 }}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold"
              >
                {done
                  ? <Check className="h-4 w-4" />
                  : current
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : i + 1}
              </motion.span>
              <div className="flex flex-1 items-center justify-between">
                <span className={`text-sm ${current ? 'font-semibold text-slate-900' : done ? 'text-slate-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {current && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-md border border-slate-200 bg-stone-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700"
                  >In progress</motion.span>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-5">
        <Helper>{flow.helper}</Helper>
      </div>
    </PhoneFrame>
  )
}

function Stat({ icon: Icon, label, value, live }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
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
          className="mt-1 text-base font-bold text-slate-900"
        >
          {value}
        </motion.div>
      ) : (
        <div className="mt-1 text-base font-bold text-slate-900">{value}</div>
      )}
    </div>
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
