import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import HelperBanner from '../components/HelperBanner.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { liveQueue } from '../data/sampleData.js'

const statusFilters = ['All', 'New', 'Accepted', 'Preparing', 'Ready', 'Served']
const flow = { New: 'Preparing', Preparing: 'Served', Served: 'Completed' }

export default function StaffScreen() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const [rows, setRows] = useState(liveQueue.map(o => ({ ...o, table: pickTable(o) })))

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchesQ = !q || r.token.toLowerCase().includes(q.toLowerCase()) || r.name.toLowerCase().includes(q.toLowerCase())
      const matchesF = filter === 'All' || r.status === filter
      return matchesQ && matchesF
    })
  }, [rows, q, filter])

  const update = (token, status) => {
    setRows(curr => curr.map(r => r.token === token ? { ...r, status } : r))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Staff screen</h1>
          <p className="mt-1 text-sm text-slate-500">
            Counter and service staff find any order in one tap and update progress.
          </p>
        </div>
      </div>

      <HelperBanner>
        Search by token or customer name. Tap a status button to move an order forward —
        the customer's phone updates instantly.
      </HelperBanner>

      <div className="rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by token number or customer name..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statusFilters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  filter === f
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Token</th>
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Table</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r, i) => (
                <motion.tr
                  key={r.token}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-4 py-2.5 font-medium text-slate-900">{r.token}</td>
                  <td className="px-4 py-2.5">
                    <div className="text-slate-900">{r.name}</div>
                    <div className="text-[11px] text-slate-500">{r.type} · {r.people} pax</div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">{r.table}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <ActionBtn
                        label="Preparing"
                        tone="amber"
                        selected={r.status === 'Preparing'}
                        onClick={() => update(r.token, 'Preparing')}
                      />
                      <ActionBtn
                        label="Served"
                        tone="emerald"
                        selected={r.status === 'Served'}
                        onClick={() => update(r.token, 'Served')}
                      />
                      <ActionBtn
                        label="Completed"
                        tone="slate"
                        selected={r.status === 'Completed'}
                        onClick={() => update(r.token, 'Completed')}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const toneStyles = {
  amber:   {
    selected: 'bg-amber-500 text-white ring-1 ring-amber-500 shadow-sm',
    idle:     'bg-white text-amber-700 ring-1 ring-amber-200 hover:bg-amber-50'
  },
  emerald: {
    selected: 'bg-emerald-600 text-white ring-1 ring-emerald-600 shadow-sm',
    idle:     'bg-white text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50'
  },
  slate:   {
    selected: 'bg-slate-800 text-white ring-1 ring-slate-800 shadow-sm',
    idle:     'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
  }
}

function ActionBtn({ label, onClick, selected, tone = 'slate' }) {
  const t = toneStyles[tone]
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      animate={{ scale: selected ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        selected ? t.selected : t.idle
      }`}
    >
      {label}
    </motion.button>
  )
}

function pickTable(o) {
  if (o.type === 'Parcel')  return 'Counter'
  if (o.type === 'Express') return 'Pickup'
  return `T-${(parseInt(o.token.replace('T-', ''), 10) % 9) + 1}`
}
