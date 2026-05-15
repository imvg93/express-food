import { motion } from 'framer-motion'

/* "mobile preview" wrapper for customer-facing screens.
   on small screens the bezel/frame disappears and content fills the width
   so a real phone view is not nested inside a fake phone bezel. */
export default function PhoneFrame({ children, title }) {
  return (
    <div className="mx-auto w-full md:max-w-[420px]">
      {title && (
        <div className="mb-3 hidden text-center text-xs font-medium uppercase tracking-wider text-slate-400 md:block">
          {title}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-slate-200 bg-white p-0 shadow-card md:rounded-[28px] md:p-3 md:shadow-lift"
      >
        <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 md:rounded-[20px]">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
