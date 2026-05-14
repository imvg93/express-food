import { motion } from 'framer-motion'

const styles = {
  New:        'bg-slate-100 text-slate-700 ring-slate-200',
  Accepted:   'bg-blue-50 text-blue-700 ring-blue-200',
  Preparing:  'bg-amber-50 text-amber-700 ring-amber-200',
  Ready:      'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Served:     'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Completed:  'bg-slate-100 text-slate-700 ring-slate-200',
  Paid:       'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Pending:    'bg-amber-50 text-amber-700 ring-amber-200',
  Failed:     'bg-rose-50 text-rose-700 ring-rose-200',
  Express:    'bg-orange-50 text-orange-700 ring-orange-200',
  'Dine-in':  'bg-indigo-50 text-indigo-700 ring-indigo-200',
  Parcel:     'bg-violet-50 text-violet-700 ring-violet-200'
}

export default function StatusBadge({ status, dot = false }) {
  const cls = styles[status] || 'bg-slate-100 text-slate-700 ring-slate-200'
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulseSoft" />}
      {status}
    </motion.span>
  )
}
