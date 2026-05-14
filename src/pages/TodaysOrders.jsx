import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import HelperBanner from '../components/HelperBanner.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { todaysOrders } from '../data/sampleData.js'

const typeFilters    = ['All', 'Dine-in', 'Express', 'Parcel']
const paymentFilters = ['Any', 'Paid', 'Pending', 'Failed']

export default function TodaysOrders() {
  const [type, setType]       = useState('All')
  const [payment, setPayment] = useState('Any')

  const filtered = useMemo(() => {
    return todaysOrders.filter(o => {
      const t = type === 'All' || o.type === type
      const p = payment === 'Any' || o.payment === payment
      return t && p
    })
  }, [type, payment])

  const total = filtered.reduce((s, o) => s + o.amount, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Today's orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Daily ledger of every token, payment and order status — exportable in one click.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 self-start rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 sm:self-auto">
          <Download className="h-3.5 w-3.5" /> Export report
        </button>
      </div>

      <HelperBanner>
        Owner can review daily business activity, filter by order type or payment status,
        and export the report for accounting.
      </HelperBanner>

      <div className="rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-3">
          <FilterGroup label="Type"    options={typeFilters}    value={type}    onChange={setType} />
          <FilterGroup label="Payment" options={paymentFilters} value={payment} onChange={setPayment} />
          <div className="ml-auto text-xs text-slate-500">
            {filtered.length} orders · <span className="font-semibold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Token</th>
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Amount</th>
                <th className="px-4 py-2.5">Payment</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o, i) => (
                <motion.tr
                  key={o.token}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-4 py-2.5 font-medium text-slate-900">{o.token}</td>
                  <td className="px-4 py-2.5 text-slate-700">{o.name}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={o.type} /></td>
                  <td className="px-4 py-2.5 font-medium text-slate-900">₹{o.amount}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={o.payment} /></td>
                  <td className="px-4 py-2.5"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-2.5 text-slate-500">{o.time}</td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    No orders match these filters.
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

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] uppercase tracking-wider text-slate-400">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full px-2.5 py-1 text-xs transition ${
              value === o
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >{o}</button>
        ))}
      </div>
    </div>
  )
}
