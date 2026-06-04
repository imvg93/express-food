import { useEffect, useMemo, useState } from 'react'
import {
  IndianRupee, Receipt, Truck, ShoppingBag, Wallet, Clock,
  Ticket, CheckCircle2, ChefHat, Bell, AlertOctagon, Plus, Download,
  ArrowUpRight, ArrowDownRight, TrendingUp, Activity, Building2,
  CalendarDays, Sparkles, Users, MoreHorizontal, ArrowRight, QrCode,
  RefreshCw, Sun, Sunrise, Sunset, Moon
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  dashboardKpis, liveQueueStatus, kitchenStatus, liveOrderFlow,
  revenueBreakdown, paymentCollection, peakHourPerformance,
  operationalAlerts, quickActions
} from '../data/sampleData.js'

/* ─── icon + tone registries ─────────────────────────────────── */

const kpiIcons = {
  revenue: IndianRupee, orders: Receipt, tokens: Ticket, wait: Clock,
  express: Truck, parcel: ShoppingBag, pending: Wallet, completed: CheckCircle2
}
const kpiColors = {
  revenue: '#0f766e', orders: '#2563eb', tokens: '#7c3aed', wait: '#dc2626',
  express: '#16a34a', parcel: '#0ea5a4', pending: '#d97706', completed: '#15803d'
}
const alertIcons  = { AlertOctagon, Wallet, ChefHat, Clock, Truck, ShoppingBag }
const actionIcons = { Bell, Receipt, Plus, ChefHat, Wallet, ShoppingBag, Download }
const actionTones = {
  brand:   'bg-brand-50 text-brand-700 ring-brand-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  slate:   'bg-slate-100 text-slate-700 ring-slate-200',
  amber:   'bg-amber-50 text-amber-700 ring-amber-100',
  violet:  'bg-violet-50 text-violet-700 ring-violet-100',
  cyan:    'bg-cyan-50 text-cyan-700 ring-cyan-100'
}

/* ─── filter multipliers + jitter ────────────────────────────── */

const dateRanges = [
  { key: 'today',     label: 'Today',        mul: 1.0  },
  { key: 'yesterday', label: 'Yesterday',    mul: 0.92 },
  { key: '7d',        label: 'Last 7 days',  mul: 6.8  },
  { key: '30d',       label: 'Last 30 days', mul: 27.0 },
  { key: 'custom',    label: 'Custom',       mul: null }
]
const timeRanges = [
  { key: 'all',     label: 'All day', icon: Activity, mul: 1.0  },
  { key: 'morning', label: 'Morning', icon: Sunrise,  mul: 0.21 },
  { key: 'lunch',   label: 'Lunch',   icon: Sun,      mul: 0.47 },
  { key: 'evening', label: 'Evening', icon: Sunset,   mul: 0.16 },
  { key: 'night',   label: 'Night',   icon: Moon,     mul: 0.16 },
  { key: 'custom',  label: 'Custom',  icon: Clock,    mul: null }
]

/* business-day baseline used to derive a fraction for custom time ranges */
const BUSINESS_HOURS = 15  // 8:00 → 23:00
const DAY_MS = 86400000

function dateMul(key, customStart, customEnd) {
  if (key === 'custom') {
    if (!customStart || !customEnd) return 1
    const d1 = new Date(customStart).getTime()
    const d2 = new Date(customEnd).getTime()
    if (Number.isNaN(d1) || Number.isNaN(d2) || d2 < d1) return 1
    const days = Math.max(1, Math.floor((d2 - d1) / DAY_MS) + 1)
    return days * 0.95
  }
  return dateRanges.find(d => d.key === key)?.mul ?? 1
}

function timeMul(key, customStart, customEnd) {
  if (key === 'custom') {
    if (!customStart || !customEnd) return 1
    const [sh, sm = 0] = customStart.split(':').map(Number)
    const [eh, em = 0] = customEnd.split(':').map(Number)
    const hours = (eh + em / 60) - (sh + sm / 60)
    if (!Number.isFinite(hours) || hours <= 0) return 1
    return Math.min(1.2, Math.max(0.05, hours / BUSINESS_HOURS))
  }
  return timeRanges.find(t => t.key === key)?.mul ?? 1
}

const jitter = (tick, i) => 1 + Math.sin(tick * 0.73 + i * 1.31) * 0.018

/* ─── shared atoms ───────────────────────────────────────────── */

const inr = n => `₹${Math.round(n).toLocaleString('en-IN')}`

function formatKpi(format, v) {
  if (format === 'inr') return inr(v)
  if (format === 'min') return `${Math.max(1, Math.round(v))} min`
  return Math.round(v).toLocaleString('en-IN')
}

function DeltaChip({ value, positiveIsGood = true }) {
  const up = value >= 0
  const good = positiveIsGood ? up : !up
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
      good ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
           : 'bg-rose-50 text-rose-700 ring-rose-100'
    }`}>
      <Icon className="h-3 w-3" /> {Math.abs(value).toFixed(1)}%
    </span>
  )
}

function Sparkline({ data, color }) {
  const series = data.map((v, i) => ({ i, v }))
  const gid = `spark-${color.replace('#', '')}`
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={series} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0}   />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
              fill={`url(#${gid})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function SectionHeader({ icon: Icon, title, sub, right }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
        </div>
      </div>
      {right}
    </div>
  )
}

function LivePulseBadge({ secondsSinceTick }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Live · refreshed {secondsSinceTick}s ago
    </span>
  )
}

/* ─── hero header ────────────────────────────────────────────── */

function HeroHeader({ secondsSinceTick, onRefresh, derivedHero, dateLabel }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-violet-100/60 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative grid gap-5 p-6 md:grid-cols-[1.4fr_1fr] md:items-center md:p-7">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-50 to-violet-50 px-2.5 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-brand-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Smart Restaurant Operations
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Restaurant Control Center
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            One screen for queue, kitchen, billing, payments and revenue — built for the owner.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
              <CalendarDays className="h-3.5 w-3.5 text-slate-500" /> {dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
              <Building2 className="h-3.5 w-3.5 text-slate-500" /> Rayudu Gari Military Hotel · NH-48
            </span>
            <LivePulseBadge secondsSinceTick={secondsSinceTick} />
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:bg-slate-50"
              title="Refresh now"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {derivedHero.map(s => (
            <div key={s.k} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-inset"
                style={{ background: `${s.color}14`, color: s.color, borderColor: `${s.color}33` }}
              >
                <s.Icon className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1.5 text-xl font-bold text-slate-900">{s.v}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── filter bar ─────────────────────────────────────────────── */

function FilterBar({
  date, setDate, time, setTime,
  customDateStart, setCustomDateStart, customDateEnd, setCustomDateEnd,
  customTimeStart, setCustomTimeStart, customTimeEnd, setCustomTimeEnd
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
            Date
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dateRanges.map(d => (
              <button
                key={d.key}
                onClick={() => setDate(d.key)}
                className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                  date === d.key
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            Time
          </div>
          <div className="flex flex-wrap gap-1.5">
            {timeRanges.map(t => (
              <button
                key={t.key}
                onClick={() => setTime(t.key)}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium transition ${
                  time === t.key
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <t.icon className="h-3 w-3" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(date === 'custom' || time === 'custom') && (
        <div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 md:grid-cols-2">
          {date === 'custom' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date range</span>
              <input
                type="date"
                value={customDateStart}
                onChange={e => setCustomDateStart(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-800 outline-none focus:border-slate-400"
              />
              <span className="text-slate-400">→</span>
              <input
                type="date"
                value={customDateEnd}
                onChange={e => setCustomDateEnd(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-800 outline-none focus:border-slate-400"
              />
            </div>
          )}
          {time === 'custom' && (
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Time window</span>
              <input
                type="time"
                value={customTimeStart}
                onChange={e => setCustomTimeStart(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-800 outline-none focus:border-slate-400"
              />
              <span className="text-slate-400">→</span>
              <input
                type="time"
                value={customTimeEnd}
                onChange={e => setCustomTimeEnd(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-800 outline-none focus:border-slate-400"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── KPI card ───────────────────────────────────────────────── */

function KpiCard({ kpi }) {
  const Icon = kpiIcons[kpi.key] || Receipt
  const color = kpiColors[kpi.key] || '#0f766e'
  const positiveIsGood = !(kpi.key === 'pending' || kpi.key === 'wait')
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{kpi.label}</div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset"
             style={{ background: `${color}14`, color: color, borderColor: `${color}33` }}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-slate-900 tabular-nums">{kpi.value}</div>
      <div className="mt-1.5 flex items-center gap-2">
        <DeltaChip value={kpi.delta} positiveIsGood={positiveIsGood} />
        <span className="text-[11px] text-slate-500">vs previous</span>
      </div>
      <div className="mt-0.5 text-[11px] text-slate-500">{kpi.sub}</div>
      <div className="mt-2 -mx-1"><Sparkline data={kpi.spark} color={color} /></div>
    </div>
  )
}

/* ─── live queue card ────────────────────────────────────────── */

function LiveQueueCard({ q, secondsSinceTick }) {
  const stats = [
    { k: 'Waiting',   v: q.waitingCustomers, tone: 'amber'  },
    { k: 'Seated',    v: q.seatedCustomers,  tone: 'brand'  },
    { k: 'Completed', v: q.completedTokens,  tone: 'emerald'},
    { k: 'Avg wait',  v: `${q.avgWaitMinutes}m`, tone: 'slate' }
  ]
  const tones = {
    amber:   'bg-amber-50 text-amber-700',
    brand:   'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    slate:   'bg-slate-100 text-slate-700'
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <SectionHeader
        icon={QrCode}
        title="Live queue status"
        sub="Token flow at the counter"
        right={<LivePulseBadge secondsSinceTick={secondsSinceTick} />}
      />
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        <div className="rounded-xl bg-gradient-to-br from-brand-50 to-white p-4 ring-1 ring-brand-100">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">Now serving</div>
          <div className="mt-1 text-3xl font-bold tracking-tight text-brand-700 tabular-nums">{q.currentToken}</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-700/80">
            <ArrowRight className="h-3.5 w-3.5" /> Next · <span className="font-semibold">{q.nextToken}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {stats.map(s => (
            <div key={s.k} className={`rounded-lg p-3 ${tones[s.tone]}`}>
              <div className="text-lg font-bold tabular-nums">{s.v}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-80">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── kitchen status ─────────────────────────────────────────── */

function KitchenStatusCard({ k }) {
  const items = [
    { k: 'New',        v: k.new,       color: '#2563eb', desc: 'Awaiting accept' },
    { k: 'Preparing',  v: k.preparing, color: '#d97706', desc: 'On the stove'    },
    { k: 'Ready',      v: k.ready,     color: '#16a34a', desc: 'Pickup window'   },
    { k: 'Delayed',    v: k.delayed,   color: '#dc2626', desc: '> 15 min'        },
    { k: 'Completed',  v: k.completed, color: '#15803d', desc: 'Served today'    }
  ]
  const totalActive = k.new + k.preparing + k.ready
  const overloaded = totalActive >= 12 || k.delayed >= 1
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <SectionHeader
        icon={ChefHat}
        title="Kitchen status"
        sub="Live tickets from KDS"
        right={overloaded
          ? <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-100">
              <Activity className="h-3 w-3" /> High load
            </span>
          : <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
              Steady
            </span>}
      />
      <div className="grid grid-cols-5 gap-2 p-5">
        {items.map(i => (
          <div key={i.k} className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm tabular-nums"
                 style={{ background: i.color }}>
              {i.v}
            </div>
            <div className="mt-2 text-[12px] font-semibold text-slate-900">{i.k}</div>
            <div className="mt-0.5 text-[10px] leading-tight text-slate-500">{i.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── live order flow table ──────────────────────────────────── */

function statusPill(status) {
  const map = {
    New:       'bg-blue-50 text-blue-700 ring-blue-100',
    Accepted:  'bg-indigo-50 text-indigo-700 ring-indigo-100',
    Preparing: 'bg-amber-50 text-amber-700 ring-amber-100',
    Ready:     'bg-emerald-50 text-emerald-700 ring-emerald-100',
    Served:    'bg-slate-100 text-slate-700 ring-slate-200'
  }
  return <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${map[status] || map.Served}`}>{status}</span>
}
function paymentPill(payment) {
  const map = {
    Paid:    'bg-emerald-50 text-emerald-700 ring-emerald-100',
    Pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    Failed:  'bg-rose-50 text-rose-700 ring-rose-100'
  }
  return <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${map[payment] || map.Paid}`}>{payment}</span>
}
function typePill(type) {
  const map = {
    'QR Order':     'bg-brand-50 text-brand-700',
    'Express Food': 'bg-emerald-50 text-emerald-700',
    'Parcel':       'bg-cyan-50 text-cyan-700',
    'Counter Bill': 'bg-violet-50 text-violet-700'
  }
  return <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium ${map[type] || 'bg-slate-100 text-slate-700'}`}>{type}</span>
}

function LiveOrderFlowCard({ rows, secondsSinceTick }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <SectionHeader
        icon={Activity}
        title="Live order flow"
        sub={`All channels · last ${rows.length} orders`}
        right={
          <div className="flex items-center gap-2">
            <LivePulseBadge secondsSinceTick={secondsSinceTick} />
            <button className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-5 py-2.5 font-semibold">Order ID</th>
              <th className="px-3 py-2.5 font-semibold">Type</th>
              <th className="px-3 py-2.5 font-semibold">Customer</th>
              <th className="px-3 py-2.5 text-right font-semibold">Amount</th>
              <th className="px-3 py-2.5 font-semibold">Payment</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o, i) => (
              <tr key={o.id} className={`border-b border-slate-100 last:border-0 ${i % 2 ? 'bg-slate-50/30' : ''}`}>
                <td className="px-5 py-2.5 font-mono text-[12px] font-medium text-slate-800">{o.id}</td>
                <td className="px-3 py-2.5">{typePill(o.type)}</td>
                <td className="px-3 py-2.5 text-slate-800">{o.customer}</td>
                <td className="px-3 py-2.5 text-right font-semibold text-slate-900 tabular-nums">{inr(o.amount)}</td>
                <td className="px-3 py-2.5">{paymentPill(o.payment)}</td>
                <td className="px-3 py-2.5">{statusPill(o.status)}</td>
                <td className="px-5 py-2.5 text-right text-slate-400 hover:text-slate-600">
                  <MoreHorizontal className="ml-auto h-4 w-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── revenue breakdown donut ────────────────────────────────── */

function RevenueBreakdownCard({ data, deltaLabel }) {
  const total = data.reduce((s, x) => s + x.value, 0)
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <SectionHeader
        icon={TrendingUp}
        title="Revenue breakdown"
        sub="By channel"
        right={<span className="text-[11px] font-semibold text-emerald-700">{deltaLabel}</span>}
      />
      <div className="grid gap-4 p-5 sm:grid-cols-[180px_1fr] sm:items-center">
        <div className="relative h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="source"
                   innerRadius={50} outerRadius={78} paddingAngle={2}
                   stroke="#ffffff" strokeWidth={2} isAnimationActive={false}>
                {data.map(d => <Cell key={d.source} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [inr(v), n]}
                       contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Total</div>
            <div className="text-base font-bold text-slate-900 tabular-nums">{inr(total)}</div>
          </div>
        </div>
        <ul className="space-y-2">
          {data.map(d => {
            const pct = ((d.value / total) * 100).toFixed(0)
            return (
              <li key={d.source} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ background: d.color }} />
                  <span className="truncate text-slate-700">{d.source}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-900 tabular-nums">{inr(d.value)}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium tabular-nums">{pct}%</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/* ─── payment collection ─────────────────────────────────────── */

function PaymentCollectionCard({ data }) {
  const collected = data.filter(p => !['Pending', 'Failed', 'Refunds'].includes(p.mode))
  const totalCollected = collected.reduce((s, x) => s + x.amount, 0)
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <SectionHeader
        icon={Wallet}
        title="Payment collection"
        sub="By mode"
        right={<span className="text-[11px] font-semibold text-slate-700">Collected {inr(totalCollected)}</span>}
      />
      <div className="space-y-2.5 p-5">
        {data.map(p => {
          const pct = Math.max(4, (p.amount / Math.max(...data.map(x => x.amount))) * 100)
          return (
            <div key={p.mode}>
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  <span className="font-medium text-slate-800">{p.mode}</span>
                  <span className="text-[10px] text-slate-500 tabular-nums">· {p.txns} txn</span>
                </div>
                <span className="font-semibold text-slate-900 tabular-nums">{inr(p.amount)}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: p.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── peak hour ──────────────────────────────────────────────── */

function PeakHourCard({ data, periodLabel }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <SectionHeader
        icon={Activity}
        title="Peak hour performance"
        sub="Orders & revenue by daypart"
        right={<span className="text-[11px] text-slate-500">{periodLabel}</span>}
      />
      <div className="h-64 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 14, right: 16, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="orderBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2f6fff" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#2f6fff" stopOpacity={0.55} />
              </linearGradient>
              <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0f766e" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#0f766e" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 4" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="period" tickLine={false} axisLine={false} stroke="#64748b" fontSize={11} tickMargin={6} />
            <YAxis yAxisId="orders" tickLine={false} axisLine={false} stroke="#64748b" fontSize={11} />
            <YAxis yAxisId="rev" orientation="right" tickLine={false} axisLine={false} stroke="#64748b" fontSize={11}
                   tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip cursor={{ fill: '#f1f5f9' }}
                     contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
                     formatter={(v, n) => n === 'revenue' ? [inr(v), 'Revenue'] : [v, 'Orders']} />
            <Legend verticalAlign="top" align="right" height={28} iconType="circle"
                    wrapperStyle={{ fontSize: 12, color: '#475569' }}
                    formatter={(v) => v === 'orders' ? 'Orders' : 'Revenue (₹)'} />
            <Bar yAxisId="orders" dataKey="orders"  fill="url(#orderBar)" radius={[6, 6, 0, 0]} barSize={22} isAnimationActive={false} />
            <Bar yAxisId="rev"    dataKey="revenue" fill="url(#revBar)"   radius={[6, 6, 0, 0]} barSize={22} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ─── alerts ─────────────────────────────────────────────────── */

function AlertsCard() {
  const sev = {
    high:   { ring: 'ring-rose-100',   pill: 'bg-rose-50 text-rose-700',     dot: 'bg-rose-500'   },
    medium: { ring: 'ring-amber-100',  pill: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-500'  },
    info:   { ring: 'ring-sky-100',    pill: 'bg-sky-50 text-sky-700',       dot: 'bg-sky-500'    }
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <SectionHeader
        icon={AlertOctagon}
        title="Alerts & problems"
        sub="What needs your attention now"
        right={<span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-100">
          {operationalAlerts.filter(a => a.severity === 'high').length} high
        </span>}
      />
      <ul className="divide-y divide-slate-100">
        {operationalAlerts.map(a => {
          const Icon = alertIcons[a.icon] || AlertOctagon
          const s = sev[a.severity]
          return (
            <li key={a.id} className="flex items-start gap-3 px-5 py-3">
              <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${s.ring} ${s.pill}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  <div className="truncate text-sm font-semibold text-slate-900">{a.title}</div>
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">{a.sub}</div>
              </div>
              <button className="self-center rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="More">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ─── quick actions ──────────────────────────────────────────── */

function QuickActionsCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <SectionHeader icon={Bell} title="Quick actions" sub="One-tap controls for the floor" />
      <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {quickActions.map(a => {
          const Icon = actionIcons[a.icon] || Bell
          return (
            <button key={a.label}
              className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/30 hover:shadow-soft">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${actionTones[a.tone]}`}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[12px] font-medium leading-tight text-slate-700">{a.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── page ───────────────────────────────────────────────────── */

export default function AdminDashboard() {
  const [tick, setTick] = useState(0)
  const [lastTickAt, setLastTickAt] = useState(Date.now())
  const [now, setNow] = useState(Date.now())
  const [dateFilter, setDateFilter] = useState('today')
  const [timeFilter, setTimeFilter] = useState('all')
  const [customDateStart, setCustomDateStart] = useState('2026-05-20')
  const [customDateEnd,   setCustomDateEnd]   = useState('2026-05-26')
  const [customTimeStart, setCustomTimeStart] = useState('11:00')
  const [customTimeEnd,   setCustomTimeEnd]   = useState('15:00')

  /* 10-second polling tick — recomputes all derived values */
  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1)
      setLastTickAt(Date.now())
    }, 10000)
    return () => clearInterval(id)
  }, [])

  /* 1-second wall clock for "Xs ago" label */
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const refreshNow = () => { setTick(t => t + 1); setLastTickAt(Date.now()) }
  const secondsSinceTick = Math.max(0, Math.floor((now - lastTickAt) / 1000))
  const dMul = dateMul(dateFilter, customDateStart, customDateEnd)
  const tMul = timeMul(timeFilter, customTimeStart, customTimeEnd)
  const mul = dMul * tMul

  /* derive all displayed values from base × multiplier × jitter */
  const derived = useMemo(() => {
    /* kpis */
    const kpis = dashboardKpis.map((k, i) => {
      const stable = (k.key === 'wait' || k.key === 'tokens')
      const raw = k.base * (stable ? 1 : mul) * jitter(tick, i)
      return { ...k, value: formatKpi(k.format, raw) }
    })

    /* live queue (snapshot — not multiplied by date) */
    const q = {
      currentToken:     liveQueueStatus.currentToken,
      nextToken:        liveQueueStatus.nextToken,
      waitingCustomers: Math.max(0, Math.round(liveQueueStatus.waitingCustomers * jitter(tick, 11))),
      seatedCustomers:  Math.max(0, Math.round(liveQueueStatus.seatedCustomers  * jitter(tick, 12))),
      completedTokens:  Math.max(0, Math.round(liveQueueStatus.completedTokens  * mul * jitter(tick, 13))),
      avgWaitMinutes:   Math.max(1, Math.round(liveQueueStatus.avgWaitMinutes   * jitter(tick, 14)))
    }

    /* kitchen — counts of active tickets are snapshot; completed scales w/ date */
    const k = {
      new:        Math.max(0, Math.round(kitchenStatus.new       * jitter(tick, 15))),
      preparing:  Math.max(0, Math.round(kitchenStatus.preparing * jitter(tick, 16))),
      ready:      Math.max(0, Math.round(kitchenStatus.ready     * jitter(tick, 17))),
      delayed:    Math.max(0, Math.round(kitchenStatus.delayed   * jitter(tick, 18))),
      completed:  Math.max(0, Math.round(kitchenStatus.completed * mul * jitter(tick, 19)))
    }

    /* order rows — keep the same identities, just scale amounts */
    const rows = liveOrderFlow.map((o, i) => ({
      ...o, amount: Math.max(0, Math.round(o.amount * jitter(tick, 20 + i)))
    }))

    /* revenue breakdown — scaled by full multiplier */
    const rev = revenueBreakdown.map((d, i) => ({
      ...d, value: Math.max(0, Math.round(d.value * mul * jitter(tick, 30 + i)))
    }))

    /* payment collection — scaled, but txn counts only when date scales */
    const pay = paymentCollection.map((p, i) => ({
      ...p,
      amount: Math.max(0, Math.round(p.amount * mul * jitter(tick, 40 + i))),
      txns:   Math.max(0, Math.round(p.txns   * mul * jitter(tick, 50 + i)))
    }))

    /* peak hour bars — multiplied by date only (time bands shown independently) */
    const peak = peakHourPerformance.map((p, i) => ({
      ...p,
      orders:  Math.max(0, Math.round(p.orders  * dMul * jitter(tick, 60 + i))),
      revenue: Math.max(0, Math.round(p.revenue * dMul * jitter(tick, 70 + i)))
    }))

    /* hero mini-stats */
    const hero = [
      { k: 'Tokens issued', v: Math.round(92 * mul * jitter(tick, 80)).toLocaleString('en-IN'), Icon: Ticket,  color: '#2563eb' },
      { k: 'Orders',        v: Math.round(87 * mul * jitter(tick, 81)).toLocaleString('en-IN'), Icon: Receipt, color: '#0f766e' },
      { k: 'Active queue',  v: Math.round(14 * jitter(tick, 82)).toString(),                    Icon: Users,   color: '#7c3aed' }
    ]

    return { kpis, q, k, rows, rev, pay, peak, hero }
  }, [tick, mul, dMul])

  /* labels */
  const fmtDate = iso => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }
  const customDateLabel = (dateFilter === 'custom' && customDateStart && customDateEnd)
    ? `Custom · ${fmtDate(customDateStart)} – ${fmtDate(customDateEnd)}`
    : null
  const customTimeLabel = (timeFilter === 'custom' && customTimeStart && customTimeEnd)
    ? `Custom · ${customTimeStart} – ${customTimeEnd}`
    : null

  const dateLabel = customDateLabel || {
    today:     'Today · Tue, 26 May 2026',
    yesterday: 'Yesterday · Mon, 25 May 2026',
    '7d':      'Last 7 days · 20 May – 26 May',
    '30d':     'Last 30 days · Apr 27 – May 26'
  }[dateFilter]

  const dateChip = customDateLabel
    ? customDateLabel.replace('Custom · ', '')
    : dateRanges.find(d => d.key === dateFilter).label
  const timeChip = customTimeLabel
    ? customTimeLabel.replace('Custom · ', '')
    : timeRanges.find(t => t.key === timeFilter).label
  const periodLabel = `${dateChip} · ${timeChip}`
  const revDeltaLabel = dateFilter === 'today' ? '+12.4% vs yest.' : `vs prev. period`

  return (
    <div className="space-y-5">
      <HeroHeader
        secondsSinceTick={secondsSinceTick}
        onRefresh={refreshNow}
        derivedHero={derived.hero}
        dateLabel={dateLabel}
      />

      <FilterBar
        date={dateFilter} setDate={setDateFilter}
        time={timeFilter} setTime={setTimeFilter}
        customDateStart={customDateStart} setCustomDateStart={setCustomDateStart}
        customDateEnd={customDateEnd}     setCustomDateEnd={setCustomDateEnd}
        customTimeStart={customTimeStart} setCustomTimeStart={setCustomTimeStart}
        customTimeEnd={customTimeEnd}     setCustomTimeEnd={setCustomTimeEnd}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        {derived.kpis.map(k => <KpiCard key={k.key} kpi={k} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LiveQueueCard q={derived.q} secondsSinceTick={secondsSinceTick} />
        <KitchenStatusCard k={derived.k} />
      </div>

      <LiveOrderFlowCard rows={derived.rows} secondsSinceTick={secondsSinceTick} />

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueBreakdownCard data={derived.rev} deltaLabel={revDeltaLabel} />
        <PaymentCollectionCard data={derived.pay} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><PeakHourCard data={derived.peak} periodLabel={periodLabel} /></div>
        <AlertsCard />
      </div>

      <QuickActionsCard />
    </div>
  )
}
