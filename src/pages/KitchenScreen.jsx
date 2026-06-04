import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat, Flame, MapPin, Clock, Bell, CheckCircle2,
  Soup, Timer, Users, ArrowRight, Check
} from 'lucide-react'
import HelperBanner from '../components/HelperBanner.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { liveQueue } from '../data/sampleData.js'

/* attach a sample order item list to each token, so the kitchen card feels real */
const sampleItemsByToken = {
  'T-1042': [{ name: 'Butter Chicken', qty: 1 }, { name: 'Butter Naan', qty: 4 }],
  'T-1043': [{ name: 'Paneer Butter Masala', qty: 2 }, { name: 'Veg Biryani', qty: 1 }, { name: 'Tandoori Roti', qty: 6 }],
  'T-1044': [{ name: 'Chicken Biryani', qty: 1 }],
  'T-1045': [{ name: 'Masala Dosa', qty: 3 }, { name: 'Filter Coffee', qty: 3 }],
  'T-1046': [{ name: 'Paneer Butter Masala', qty: 1 }, { name: 'Butter Naan', qty: 4 }],
  'T-1047': [{ name: 'Veg Biryani', qty: 1 }, { name: 'Filter Coffee', qty: 1 }]
}

const next = { New: 'Accepted', Accepted: 'Preparing', Preparing: 'Ready' }
const cta  = { New: 'Accept order', Accepted: 'Start cooking', Preparing: 'Mark ready', Ready: 'Hand to customer' }

/* the three lanes of the board. each lane owns one or more order statuses */
const LANES = [
  { key: 'incoming', title: 'New orders',     icon: Bell,         statuses: ['New', 'Accepted'], accent: 'blue'    },
  { key: 'cooking',  title: 'Cooking',        icon: Flame,        statuses: ['Preparing'],       accent: 'amber'   },
  { key: 'ready',    title: 'Ready to serve', icon: CheckCircle2, statuses: ['Ready'],           accent: 'emerald' }
]

const laneAccent = {
  blue:    { bar: 'bg-blue-500',    soft: 'bg-blue-50',    text: 'text-blue-700',    ring: 'ring-blue-100',    count: 'bg-blue-600' },
  amber:   { bar: 'bg-amber-500',   soft: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-100',   count: 'bg-amber-500' },
  emerald: { bar: 'bg-emerald-500', soft: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100', count: 'bg-emerald-600' }
}

export default function KitchenScreen() {
  const [orders, setOrders] = useState(liveQueue)

  const advance = (token) => {
    setOrders(curr => curr.flatMap(o => {
      if (o.token !== token) return [o]
      if (o.status === 'Ready') return []        // handed over → leaves the board
      return [{ ...o, status: next[o.status] }]
    }))
  }

  const stats = useMemo(() => {
    const by = s => orders.filter(o => s.includes(o.status)).length
    const active = orders.length
    const avg = active
      ? Math.round(orders.reduce((s, o) => s + o.minutes, 0) / active)
      : 0
    return {
      active,
      incoming: by(['New', 'Accepted']),
      cooking:  by(['Preparing']),
      ready:    by(['Ready']),
      avg
    }
  }, [orders])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Kitchen display</h1>
          <p className="mt-1 text-sm text-slate-500">
            Live ticket board — readable across the kitchen. One tap moves an order down the line.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 ring-1 ring-inset ring-emerald-100 sm:self-auto">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulseSoft" />
          Live · auto-syncs with customer phones
        </div>
      </div>

      {/* live kitchen pulse */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Soup}     label="Active tickets" value={stats.active}        tone="slate"   />
        <StatCard icon={Bell}     label="New / accepted"  value={stats.incoming}     tone="blue"    />
        <StatCard icon={Flame}    label="On the stove"    value={stats.cooking}      tone="amber"   />
        <StatCard icon={Timer}    label="Avg prep ETA"    value={`${stats.avg} min`} tone="emerald" />
      </div>

      <HelperBanner>
        Tickets flow left to right: <span className="font-medium">New → Cooking → Ready</span>. Express orders
        carry a priority flame and only start cooking once the customer enters the 3 km zone.
      </HelperBanner>

      <div className="grid gap-4 lg:grid-cols-3">
        {LANES.map(lane => {
          const laneOrders = orders.filter(o => lane.statuses.includes(o.status))
          const a = laneAccent[lane.accent]
          const LaneIcon = lane.icon
          return (
            <div key={lane.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60">
              {/* lane header */}
              <div className={`h-1 w-full ${a.bar}`} />
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${a.soft} ${a.text} ring-1 ring-inset ${a.ring}`}>
                    <LaneIcon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{lane.title}</span>
                </div>
                <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white ${a.count}`}>
                  {laneOrders.length}
                </span>
              </div>

              {/* tickets */}
              <div className="space-y-3 px-3 pb-3">
                <AnimatePresence mode="popLayout">
                  {laneOrders.map(o => (
                    <Ticket key={o.token} order={o} onAdvance={() => advance(o.token)} />
                  ))}
                </AnimatePresence>

                {laneOrders.length === 0 && <EmptyLane accent={lane.accent} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Ticket({ order: o, onAdvance }) {
  const items = sampleItemsByToken[o.token] || [{ name: 'Chef special', qty: 1 }]
  const isReady = o.status === 'Ready'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden rounded-xl border bg-white shadow-card transition hover:shadow-soft ${
        o.priority ? 'border-orange-200' : 'border-slate-200'
      }`}
    >
      {/* left accent stripe */}
      <span className={`absolute inset-y-0 left-0 w-1 ${o.priority ? 'bg-orange-400' : 'bg-slate-200'}`} />

      <div className="p-3.5 pl-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <ChefHat className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-base font-bold leading-tight tracking-tight text-slate-900">{o.token}</div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Users className="h-3 w-3" /> {o.name} · {o.people} pax
              </div>
            </div>
          </div>
          {o.priority && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700 ring-1 ring-inset ring-orange-100">
              <Flame className="h-3 w-3" /> Express
            </span>
          )}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={o.type} />
          <StatusBadge status={o.status} dot={o.status === 'Preparing'} />
          <StatusBadge status={o.payment} />
        </div>

        <ul className="mt-2.5 space-y-1 rounded-lg bg-slate-50 px-3 py-2 text-sm">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="text-slate-800">{it.name}</span>
              <span className="rounded bg-white px-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">× {it.qty}</span>
            </li>
          ))}
        </ul>

        <div className="mt-2.5 flex items-center justify-between">
          <PrepTimer minutes={o.minutes} ready={isReady} />
          {o.type === 'Express' && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-orange-500" /> within 3 km
            </span>
          )}
        </div>

        <button
          onClick={onAdvance}
          className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
            isReady
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-brand-600 text-white hover:bg-brand-700'
          }`}
        >
          {isReady ? <Check className="h-4 w-4" /> : null}
          {cta[o.status]}
          {!isReady && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  )
}

/* prep ETA chip — colour signals urgency (green fresh, amber watch, rose late) */
function PrepTimer({ minutes, ready }) {
  if (ready) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
        <CheckCircle2 className="h-3.5 w-3.5" /> Ready now
      </span>
    )
  }
  const tone =
    minutes >= 10 ? 'bg-rose-50 text-rose-700 ring-rose-100'
    : minutes >= 6 ? 'bg-amber-50 text-amber-700 ring-amber-100'
    : 'bg-slate-100 text-slate-600 ring-slate-200'
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${tone}`}>
      <Clock className="h-3.5 w-3.5" /> {minutes >= 10 ? `${minutes} min · running late` : `~${minutes} min`}
    </span>
  )
}

function EmptyLane({ accent }) {
  const a = laneAccent[accent]
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/50 py-8 text-center">
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${a.soft} ${a.text}`}>
        <CheckCircle2 className="h-4 w-4" />
      </span>
      <p className="mt-2 text-xs text-slate-400">All caught up</p>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    slate:   'bg-slate-100 text-slate-600',
    blue:    'bg-blue-50 text-blue-600',
    amber:   'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600'
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</div>
    </div>
  )
}
