import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import HelperBanner from '../components/HelperBanner.jsx'

export default function TokenGeneration() {
  const [people, setPeople] = useState(2)

  /* token is created the moment the customer taps "Get Dine-in Token"
     on the QR screen — this page just confirms it */
  const token         = 'T-1048'
  const queuePosition = 6
  const wait          = 14

  return (
    <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[1fr_auto] md:items-start">
      <div className="max-w-md">
        <h1 className="text-xl font-semibold text-slate-900">Token confirmation</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          The token is generated the moment the customer taps "Get Dine-in Token" on
          the QR screen (name + mobile already captured). This page just confirms it,
          shows queue position, and asks how many people are dining.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>• Token instantly visible to kitchen and counter staff.</li>
          <li>• Customer sees their live queue position + ETA.</li>
          <li>• Number of people helps staff prepare seating.</li>
        </ul>
      </div>

      <PhoneFrame title="Customer view">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-pop">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="mt-3 text-sm text-emerald-600">Token added to live queue</div>
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="mt-1 text-3xl font-semibold tracking-wide text-slate-900"
          >
            {token}
          </motion.div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-left">
            <Stat icon={Users} label="Queue position" value={`#${queuePosition}`} />
            <Stat icon={Clock} label="Estimated wait" value={`${wait} min`} />
          </div>
        </motion.div>

        <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">How many people?</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="h-7 w-7 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              >−</button>
              <motion.div
                key={people}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
                className="w-8 text-center text-sm font-semibold text-slate-900"
              >{people}</motion.div>
              <button
                onClick={() => setPeople(people + 1)}
                className="h-7 w-7 rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100"
              >+</button>
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Helps staff prepare a suitable table — no other details needed.
          </p>
        </div>

        <Link
          to="/tracking?type=dine-in"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-brand-700"
        >
          Track queue position <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-3">
          <HelperBanner tone="success">
            Your token is for getting a seat. Show <span className="font-medium">{token}</span> at
            the counter when your number is called. No food order yet — you'll order at the table.
          </HelperBanner>
        </div>
      </PhoneFrame>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-white p-2.5 ring-1 ring-slate-200">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}
