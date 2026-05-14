import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Volume2 } from 'lucide-react'
import { liveQueue, restaurant } from '../data/sampleData.js'

/* a digital-signage view designed for a TV in the waiting area.
   the "now serving" rotates every few seconds so the demo feels alive. */
export default function DisplayBoard() {
  const [now, setNow]             = useState(new Date())
  const [servingIdx, setServingIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setServingIdx(i => (i + 1) % liveQueue.length)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  const current = liveQueue[servingIdx]
  const upNext  = [...liveQueue.slice(servingIdx + 1), ...liveQueue.slice(0, servingIdx)].slice(0, 5)

  const hh = now.getHours().toString().padStart(2, '0')
  const mm = now.getMinutes().toString().padStart(2, '0')

  const goFullscreen = () => {
    document.documentElement.requestFullscreen?.()
  }

  return (
    <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[60%] -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />

      <div className="relative flex items-center justify-between px-6 py-5 md:px-12">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{restaurant.tagline}</div>
          <div className="text-xl font-semibold md:text-2xl">{restaurant.name}</div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={goFullscreen}
            className="hidden items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-slate-200 ring-1 ring-white/10 hover:bg-white/20 md:inline-flex"
          >
            <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
          </button>
          <div className="font-mono text-3xl tracking-wider text-slate-100 md:text-5xl">
            {hh}<span className="animate-pulseSoft">:</span>{mm}
          </div>
        </div>
      </div>

      <div className="relative grid gap-6 px-6 pb-8 md:grid-cols-[1.4fr_1fr] md:gap-10 md:px-12 md:pb-12">
        {/* NOW SERVING */}
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:p-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulseSoft" />
            Now serving
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.token}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div className="mt-3 text-[20vw] font-bold leading-none tracking-tight text-white md:text-[10rem]">
                {current.token}
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <div className="text-xl text-slate-100 md:text-2xl">{current.name}</div>
                <div className="text-sm text-slate-400">{current.type} · Counter</div>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                <Volume2 className="h-3.5 w-3.5" /> Please proceed to the counter
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* UP NEXT */}
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Up next</div>
          <div className="mt-3 space-y-2.5">
            <AnimatePresence initial={false}>
              {upNext.map((t, i) => (
                <motion.div
                  layout
                  key={t.token}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1 - i * 0.12, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                >
                  <div className="min-w-0">
                    <div className="text-2xl font-semibold tracking-tight md:text-3xl">{t.token}</div>
                    <div className="truncate text-xs text-slate-400">{t.name} · {t.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">in</div>
                    <div className="text-sm font-medium text-slate-200">{t.minutes}m</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-6 py-3 text-center text-xs tracking-wider text-slate-400 md:px-12">
        Show your token at the counter · Express orders are called separately
      </div>
    </div>
  )
}
