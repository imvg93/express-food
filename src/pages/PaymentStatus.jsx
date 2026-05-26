import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, ChefHat, MapPin, Download } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'

export default function PaymentStatus() {
  return (
    <PhoneFrame title="Customer view">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Payment successful</div>
        <div className="mt-1 text-3xl font-bold tracking-tight text-slate-900">T-1048</div>
        <div className="text-[11px] text-slate-500">Order ID · ORD-20260514-1048</div>
      </motion.div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <Row label="Payment status">
          <span className="rounded-md border border-slate-200 bg-stone-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">Paid</span>
        </Row>
        <Row label="Order amount">
          <span className="text-sm font-bold text-slate-900">₹540</span>
        </Row>
        <Row label="Order type">
          <span className="rounded-md border border-slate-200 bg-stone-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">Express</span>
        </Row>
        <Row label="Food preparation">
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
            <ChefHat className="h-4 w-4 text-slate-500" /> Starts at 3 km
          </span>
        </Row>
        <Row label="Customer arrival" border={false}>
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-slate-500" /> 5.2 km away
          </span>
        </Row>
      </div>

      <Link
        to="/tracking?type=express"
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Track order status <ArrowRight className="h-4 w-4" />
      </Link>

      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-stone-50"
      >
        <Download className="h-4 w-4" /> Download invoice
      </button>

      <div className="mt-3">
        <Helper>Your order is confirmed. Keep this screen ready and show the token at the counter when you arrive.</Helper>
      </div>
    </PhoneFrame>
  )
}

function Row({ label, children, border = true }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${border ? 'border-b border-slate-100' : ''}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div>{children}</div>
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
