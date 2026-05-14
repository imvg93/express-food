import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Flame, ArrowRight, Star } from 'lucide-react'
import { restaurant, revenueImpact, menu } from '../data/sampleData.js'

/* full-bleed public landing for the highway billboard QR.
   designed to be the first thing a driver sees on their phone. */
export default function HighwayBoard() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = now.getHours().toString().padStart(2, '0')
  const mm = now.getMinutes().toString().padStart(2, '0')

  const combo = menu.filter(m => m.popular).slice(0, 3)
  const comboPrice = 199

  return (
    <div className="min-h-[calc(100vh-3rem)] overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-white/80">{restaurant.tagline}</div>
            <div className="mt-0.5 text-xl font-semibold md:text-2xl">{restaurant.name}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl tracking-wider md:text-3xl">{hh}:{mm}</div>
            <div className="text-[11px] text-white/70">Live</div>
          </div>
        </div>

        {/* hero — wait time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 rounded-3xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur md:mt-10 md:p-10"
        >
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/80">
            <Clock className="h-3.5 w-3.5" /> Estimated wait right now
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="text-[20vw] font-bold leading-none tracking-tight md:text-[10rem]">
              {restaurant.estimatedWait}
            </div>
            <div className="text-2xl font-medium md:text-3xl">min</div>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm ring-1 ring-white/20">
            <MapPin className="h-4 w-4" /> 800 m ahead · NH-48 exit 14
          </div>
        </motion.div>

        {/* offer + cta */}
        <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-[1.3fr_1fr] md:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur"
          >
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-amber-100">
              <Flame className="h-3.5 w-3.5" /> Today's express combo
            </div>
            <div className="mt-2 text-xl font-semibold md:text-2xl">
              {combo[0]?.name} · {combo[1]?.name}
            </div>
            <div className="mt-0.5 text-sm text-white/80">+ {combo[2]?.name} on the side</div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-bold md:text-4xl">₹{comboPrice}</div>
              <div className="text-sm text-white/70 line-through">₹{(combo.reduce((s, c) => s + c.price, 0))}</div>
            </div>
            <div className="mt-1 text-xs text-amber-100">Pre-paid Express only · cooked when you reach 3 km</div>
          </motion.div>

          <motion.a
            href="/qr"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-col justify-between rounded-2xl bg-white p-5 text-slate-900 shadow-lift transition hover:shadow-2xl"
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500">Pre-book now</div>
              <div className="mt-1.5 text-lg font-semibold">Skip the wait. Eat hot.</div>
              <p className="mt-1 text-sm text-slate-600">
                Order from your car. Kitchen starts cooking when you're 3 km away.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-medium text-white">
              Order on phone <ArrowRight className="h-4 w-4" />
            </span>
          </motion.a>
        </div>

        {/* social proof + driver hook */}
        <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3">
          <Proof icon={Star}     value="4.7" label="Google rating · 2,140 reviews" />
          <Proof icon={MapPin}   value={`${revenueImpact.highway.stops}`} label={`drivers stopped today · ${revenueImpact.highway.conversion}% of QR scans`} />
          <Proof icon={Clock}    value="24×7" label="Open · clean restrooms · parking" />
        </div>
      </div>
    </div>
  )
}

function Proof({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/15">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-semibold leading-tight">{value}</div>
        <div className="truncate text-[11px] text-white/80">{label}</div>
      </div>
    </div>
  )
}
