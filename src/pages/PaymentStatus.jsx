import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, ChefHat, MapPin } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

export default function PaymentStatus() {
  return (
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="max-w-md">
        <h1 className="text-xl font-semibold text-slate-900">Payment status</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Confirmation screen the customer sees right after payment.
          One screen answers all their questions — paid? what's next? what to show staff?
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
          <Stage label="Order placed"   done />
          <Stage label="Payment"        done />
          <Stage label="Kitchen"        pending />
        </div>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>• Paid / Pending / Failed status is always visible.</li>
          <li>• Token and order ID are large and scan-friendly at the counter.</li>
          <li>• One tap moves the customer to live tracking.</li>
        </ul>
      </div>

      <PhoneFrame title="Customer view">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-pop">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="mt-3 text-sm text-emerald-600">Payment successful</div>
          <div className="mt-1 text-2xl font-semibold tracking-wide text-slate-900">T-1048</div>
          <div className="text-[11px] text-slate-500">Order ID · ORD-20260514-1048</div>
        </motion.div>

        <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <Row label="Payment status"><StatusBadge status="Paid" /></Row>
          <Row label="Order amount"><span className="text-sm font-semibold text-slate-900">₹540</span></Row>
          <Row label="Order type"><StatusBadge status="Express" /></Row>
          <Row label="Food preparation">
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
              <ChefHat className="h-4 w-4 text-amber-500" /> Starts at 3 km
            </span>
          </Row>
          <Row label="Customer arrival" border={false}>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
              <MapPin className="h-4 w-4 text-brand-500" /> 5.2 km away
            </span>
          </Row>
        </div>

        <Link
          to="/tracking?type=express"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Track order status <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-3">
          <HelperBanner tone="success">
            Your order is confirmed. Keep this screen ready and show the token at the
            counter when you arrive.
          </HelperBanner>
        </div>
      </PhoneFrame>
    </div>
  )
}

function Row({ label, children, border = true }) {
  return (
    <div className={`flex items-center justify-between py-2 ${border ? 'border-b border-slate-100' : ''}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div>{children}</div>
    </div>
  )
}

function Stage({ label, done }) {
  return (
    <div className={`rounded-lg px-2 py-2 ring-1 ring-inset ${
      done
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
        : 'bg-slate-50 text-slate-500 ring-slate-200'
    }`}>
      <div className="text-[11px] uppercase tracking-wider opacity-75">Step</div>
      <div className="mt-0.5 text-xs font-medium">{label}</div>
    </div>
  )
}
