import { motion } from 'framer-motion'
import {
  Receipt, Ticket, Truck, ShoppingBag, BadgeIndianRupee,
  Clock, Users, AlertCircle, CheckCircle2, Sparkles, MessageCircle, MapPin, TrendingUp
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import HelperBanner from '../components/HelperBanner.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { dashboardStats, revenueByHour, todaysOrders, revenueImpact } from '../data/sampleData.js'

const stats = [
  { label: "Today's orders",   value: dashboardStats.totalOrders,         icon: Receipt,        tone: 'brand' },
  { label: 'Tokens generated', value: dashboardStats.tokensGenerated,     icon: Ticket,         tone: 'indigo' },
  { label: 'Express orders',   value: dashboardStats.expressOrders,       icon: Truck,          tone: 'accent' },
  { label: 'Parcel orders',    value: dashboardStats.parcelOrders,        icon: ShoppingBag,    tone: 'violet' },
  { label: 'Paid orders',      value: dashboardStats.paidOrders,          icon: CheckCircle2,   tone: 'emerald' },
  { label: 'Pending payments', value: dashboardStats.pendingPayments,     icon: AlertCircle,    tone: 'amber' },
  { label: 'Revenue today',    value: `₹${dashboardStats.revenue.toLocaleString('en-IN')}`, icon: BadgeIndianRupee, tone: 'emerald' },
  { label: 'Avg waiting time', value: `${dashboardStats.avgWaitMinutes} min`, icon: Clock,      tone: 'slate' },
  { label: 'Active queue',     value: dashboardStats.activeQueue,         icon: Users,          tone: 'brand' }
]

const tones = {
  brand:   'bg-brand-50 text-brand-700',
  indigo:  'bg-indigo-50 text-indigo-700',
  accent:  'bg-orange-50 text-orange-700',
  violet:  'bg-violet-50 text-violet-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber:   'bg-amber-50 text-amber-700',
  slate:   'bg-slate-100 text-slate-700'
}

function RevenueImpactStrip() {
  const items = [
    { icon: Sparkles,      tone: 'orange', label: 'Upsell at checkout',  amount: revenueImpact.upsell.amount,  sub: `${revenueImpact.upsell.orders} orders · +${revenueImpact.upsell.aovLift}% AOV` },
    { icon: MessageCircle, tone: 'emerald', label: 'WhatsApp re-visits', amount: revenueImpact.repeat.amount,  sub: `${revenueImpact.repeat.customers} repeat customers today` },
    { icon: MapPin,        tone: 'amber',  label: 'Highway QR capture',  amount: revenueImpact.highway.amount, sub: `${revenueImpact.highway.scans} scans · ${revenueImpact.highway.stops} stops` }
  ]
  const tones = {
    orange:  'bg-orange-50 text-orange-700 ring-orange-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber:   'bg-amber-50 text-amber-700 ring-amber-100'
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white shadow-card"
    >
      <div className="grid gap-4 p-5 md:grid-cols-[1.1fr_2fr] md:items-center md:p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/30">
            <TrendingUp className="h-3.5 w-3.5" /> Smart features impact
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">₹{revenueImpact.totalToday.toLocaleString('en-IN')}</span>
            <span className="text-sm text-slate-300">added today</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Extra revenue attributable to upsells, WhatsApp recovery and highway QR captures.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {items.map(it => (
            <div key={it.label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className={`mb-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-inset ${tones[it.tone]}`}>
                <it.icon className="h-3.5 w-3.5" />
              </div>
              <div className="text-base font-semibold">₹{it.amount.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-300">{it.label}</div>
              <div className="mt-0.5 truncate text-[10px] text-slate-400">{it.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Owner dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            One-glance view of queue, payments and revenue — built for the owner, not for analysts.
          </p>
        </div>
        <div className="hidden text-right text-xs text-slate-500 md:block">
          <div>Today · 14 May 2026</div>
          <div className="font-medium text-slate-700">Live</div>
        </div>
      </div>

      <RevenueImpactStrip />

      <HelperBanner>
        This dashboard gives the owner a quick view of queue activity, payments, revenue
        and order flow — no training needed.
      </HelperBanner>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.22 }}
            className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card hover:shadow-soft"
          >
            <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${tones[s.tone]}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="text-lg font-semibold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Revenue by hour</div>
              <div className="text-xs text-slate-500">Today · live</div>
            </div>
            <div className="text-xs text-slate-500">₹</div>
          </div>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  cursor={{ fill: '#eef5ff' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
                <Bar dataKey="revenue" fill="#2f6fff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="text-sm font-semibold text-slate-900">Recent activity</div>
          <div className="text-xs text-slate-500">Last 6 orders</div>
          <ul className="mt-3 space-y-2.5">
            {todaysOrders.slice(-6).reverse().map(o => (
              <li key={o.token} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <div className="truncate text-slate-900">{o.name}</div>
                  <div className="text-[11px] text-slate-500">{o.token} · {o.time}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-700">₹{o.amount}</span>
                  <StatusBadge status={o.payment} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
