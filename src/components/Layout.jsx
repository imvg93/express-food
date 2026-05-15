import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode, Ticket, Truck, ShoppingBag, CreditCard, MapPin,
  LayoutDashboard, ChefHat, Users, ClipboardList, Tv, Utensils,
  TrendingUp, MessageCircle, Menu, X, Search
} from 'lucide-react'

const groups = [
  {
    label: 'Customer flow',
    items: [
      { to: '/qr',       icon: QrCode,      label: 'QR Scan' },
      { to: '/token',    icon: Ticket,      label: 'Token Confirmation' },
      { to: '/express',  icon: Truck,       label: 'Express Food' },
      { to: '/parcel',   icon: ShoppingBag, label: 'Parcel Order' },
      { to: '/payment',  icon: CreditCard,  label: 'Payment Status' },
      { to: '/tracking', icon: MapPin,      label: 'Order Tracking' },
      { to: '/check',    icon: Search,      label: 'Check My Order' }
    ]
  },
  {
    label: 'Restaurant operations',
    items: [
      { to: '/admin',   icon: LayoutDashboard, label: 'Owner Dashboard' },
      { to: '/kitchen', icon: ChefHat,         label: 'Kitchen Screen' },
      { to: '/staff',   icon: Users,           label: 'Staff Screen' },
      { to: '/orders',  icon: ClipboardList,   label: "Today's Orders" },
      { to: '/display', icon: Tv,              label: 'Display Board' }
    ]
  },
  {
    label: 'Revenue boosters',
    items: [
      { to: '/highway',  icon: TrendingUp,    label: 'Highway QR Board' },
      { to: '/whatsapp', icon: MessageCircle, label: 'WhatsApp Engagement' }
    ]
  }
]

export default function Layout() {
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const fullBleed = location.pathname === '/display' || location.pathname === '/highway'

  useEffect(() => { setNavOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [navOpen])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <Brand />
        <NavList />
        <div className="border-t border-slate-200 px-5 py-3 text-[11px] text-slate-400">
          Demo build · client preview
        </div>
      </aside>

      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setNavOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.24 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-[300px] flex-col border-r border-slate-200 bg-white md:hidden"
            >
              <div className="flex items-center justify-between pr-2">
                <Brand />
                <button
                  onClick={() => setNavOpen(false)}
                  className="mr-2 flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavList />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur md:px-8 md:py-3">
          <button
            onClick={() => setNavOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 truncate text-xs text-slate-500">
            <span className="hidden sm:inline">Smart Queue Control </span>
            <span className="mx-1.5 hidden text-slate-300 sm:inline">/</span>
            <span className="text-slate-700">{currentLabel(location.pathname)}</span>
          </div>
        </div>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className={fullBleed ? '' : 'p-3 sm:p-6 md:p-8'}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Utensils className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">Smart Queue</div>
        <div className="text-xs text-slate-500">+ Express Food</div>
      </div>
    </div>
  )
}

function NavList() {
  return (
    <nav className="flex-1 overflow-y-auto px-3 pb-4">
      {groups.map(group => (
        <div key={group.label} className="mb-4">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {group.label}
          </div>
          <div className="space-y-0.5">
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function currentLabel(path) {
  for (const g of groups) {
    const found = g.items.find(i => i.to === path)
    if (found) return found.label
  }
  return 'Home'
}
