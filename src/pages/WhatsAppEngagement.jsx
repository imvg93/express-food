import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, CheckCheck, BadgeIndianRupee, UserCheck, Mail } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'
import { whatsappMessages, reengagementStats, restaurant } from '../data/sampleData.js'

export default function WhatsAppEngagement() {
  const [active, setActive] = useState(whatsappMessages[2].id) // default to re-engagement
  const chat = whatsappMessages.find(m => m.id === active)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">WhatsApp engagement</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every order captures the customer's WhatsApp. The system uses it three ways:
          live order updates, ready-to-pickup pings, and bringing past customers back.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ImpactStat
          tone="emerald"
          icon={BadgeIndianRupee}
          value={`₹${reengagementStats.recoveredRevenue.toLocaleString('en-IN')}`}
          label="Revenue recovered this month"
        />
        <ImpactStat
          tone="brand"
          icon={UserCheck}
          value={reengagementStats.recovered}
          label="Past customers brought back"
        />
        <ImpactStat
          tone="amber"
          icon={Mail}
          value={reengagementStats.sentThisMonth}
          label="Messages sent this month"
        />
      </div>

      <HelperBanner>
        Same WhatsApp number you captured on QR scan is what we use to send order
        updates and re-engagement offers. Customers reply right inside WhatsApp.
      </HelperBanner>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="rounded-xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">Auto re-engagement segments</div>
            <div className="text-xs text-slate-500">Owner picks who, system sends the message</div>
          </div>
          <ul className="divide-y divide-slate-100">
            {reengagementStats.segments.map(s => (
              <li key={s.label} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <div className="text-sm text-slate-900">{s.label}</div>
                  <div className="truncate text-[11px] text-slate-500">{s.template}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
                    {s.count} customers
                  </span>
                  <button className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                    <Send className="h-3 w-3" /> Send
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Owners typically send the 14-day segment weekly — recovers <span className="font-medium text-slate-900">~12-18%</span> of dormant customers.
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-slate-900">Live message previews</div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {whatsappMessages.map(m => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`rounded-full px-2.5 py-1 text-xs transition ${
                  active === m.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {labelFor(m.template)}
              </button>
            ))}
          </div>

          <PhoneFrame title="What the customer sees on WhatsApp">
            <ChatHeader name={chat.name} />
            <div className="mt-3 space-y-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {chat.body.map((b, i) => (
                  <motion.div
                    key={chat.id + '-' + i}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.22 }}
                    className={`flex ${b.from === 'us' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-sm ${
                        b.from === 'us'
                          ? 'rounded-tl-sm bg-white text-slate-800'
                          : 'rounded-tr-sm bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {b.text}
                      <div className="mt-0.5 flex items-center justify-end gap-0.5 text-[10px] text-slate-400">
                        {timeFor(i)}
                        {b.from === 'us' && <CheckCheck className="h-3 w-3 text-emerald-500" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">
              <span className="text-xs text-slate-400">Type a message…</span>
              <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Send className="h-3.5 w-3.5" />
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>
  )
}

function ImpactStat({ tone, icon: Icon, value, label }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700',
    brand:   'bg-brand-50 text-brand-700',
    amber:   'bg-amber-50 text-amber-700'
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-card"
    >
      <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </motion.div>
  )
}

function ChatHeader({ name }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
        <MessageCircle className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">{restaurant.name}</div>
        <div className="text-[11px] text-emerald-600">online · sending to {name}</div>
      </div>
    </div>
  )
}

function labelFor(template) {
  return {
    'token-ready':         'Order updates',
    'express-cook-start':  'Express trigger',
    'reengagement-14d':    '14-day re-engagement',
    'parcel-ready':        'Parcel ready'
  }[template] || template
}

function timeFor(i) {
  const base = 18 * 60 + 32
  const mins = base + i * 2
  const hh = Math.floor(mins / 60).toString().padStart(2, '0')
  const mm = (mins % 60).toString().padStart(2, '0')
  return `${hh}:${mm}`
}
