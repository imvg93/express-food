import { Link } from 'react-router-dom'
import {
  Ticket, Truck, ShoppingBag, ArrowRight, Star, Clock, Users,
  ShieldCheck, Lock, Sparkles, Headphones, Utensils, Search,
  ChevronRight, BadgePercent, Leaf, Drumstick, Plus
} from 'lucide-react'
import { restaurant, menu, customerLanding, trustBadges } from '../data/sampleData.js'

const trustIcons = { ShieldCheck, Lock, Sparkles, Headphones }

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt={restaurant.name}
              className="h-12 w-12 rounded-2xl bg-white object-contain ring-1 ring-slate-200"
            />
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Welcome to</div>
              <div className="truncate text-xl font-bold tracking-tight text-slate-900">{restaurant.name}</div>
              <div className="truncate text-xs text-slate-500">{restaurant.tagline}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-slate-300 opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-slate-900" />
            </span>
            Open
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-200 bg-stone-50/60 p-2.5">
            <div className="flex items-center gap-1 text-slate-900">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold">{customerLanding.rating}</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{customerLanding.reviewsCount} reviews</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-stone-50/60 p-2.5">
            <div className="flex items-center gap-1 text-slate-900">
              <Clock className="h-3.5 w-3.5 text-slate-700" />
              <span className="text-sm font-bold">~{restaurant.estimatedWait}m</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Avg wait now</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-stone-50/60 p-2.5">
            <div className="flex items-center gap-1 text-slate-900">
              <Users className="h-3.5 w-3.5 text-slate-700" />
              <span className="text-sm font-bold">{customerLanding.liveCovers}</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Dining now</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-stone-50/60 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 ring-1 ring-slate-200">
            <BadgePercent className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">{customerLanding.promo.title}</div>
            <div className="truncate text-[11px] text-slate-500">{customerLanding.promo.sub}</div>
          </div>
          <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider text-white">
            {customerLanding.promo.code}
          </span>
        </div>
      </div>
    </div>
  )
}

function ActionCards() {
  const actions = [
    { to: '/token',   icon: Ticket,      title: 'Get a Table',       sub: 'Join the live dine-in queue — no waiting in line', eta: '~ 8 min',  etaLabel: 'Next available', tag: 'Dine-in' },
    { to: '/express', icon: Truck,       title: 'Express Food',       sub: 'Pre-order while you drive — fresh on arrival',     eta: '0 min',     etaLabel: 'Zero wait',       tag: 'Highway' },
    { to: '/parcel',  icon: ShoppingBag, title: 'Parcel / Takeaway',  sub: 'Order, pay, walk in & collect — kitchen-priority', eta: '~ 14 min',  etaLabel: 'Ready in',        tag: 'Pickup' }
  ]
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {actions.map(a => (
        <Link
          key={a.to}
          to={a.to}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lift"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <a.icon className="h-5 w-5" />
            </div>
            <span className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {a.tag}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-base font-bold tracking-tight text-slate-900">{a.title}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{a.sub}</p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{a.etaLabel}</div>
              <div className="text-sm font-bold text-slate-900">{a.eta}</div>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition group-hover:bg-slate-800">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function PopularDishes() {
  const popular = menu.filter(m => m.popular)
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Today's picks</div>
          <div className="mt-0.5 text-sm font-bold tracking-tight text-slate-900">Most loved</div>
        </div>
        <Link to="/parcel" className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 hover:text-slate-900">
          See full menu <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible">
        {popular.map(d => <DishCard key={d.id} dish={d} />)}
      </div>
    </div>
  )
}

function DishCard({ dish }) {
  return (
    <div className="group relative flex w-[230px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft md:w-auto">
      <div className="relative flex h-32 items-center justify-center bg-stone-50">
        <span className="text-6xl grayscale-0">{dish.emoji}</span>
        {dish.tag && (
          <span className="absolute left-2 top-2 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
            {dish.tag}
          </span>
        )}
        <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white">
          {dish.veg
            ? <Leaf className="h-3.5 w-3.5 text-emerald-600" />
            : <Drumstick className="h-3.5 w-3.5 text-rose-600" />}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="truncate text-sm font-bold text-slate-900">{dish.name}</div>
        <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">{dish.description}</div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-0.5 font-semibold text-slate-800">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {dish.rating}
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-0.5">
            <Clock className="h-3 w-3" /> {dish.prepTime} min
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
          <span className="text-base font-bold text-slate-900">₹{dish.price}</span>
          <button
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
            onClick={(e) => e.preventDefault()}
            aria-label={`Add ${dish.name}`}
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  )
}

function TrustStrip() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {trustBadges.map(t => {
          const Icon = trustIcons[t.icon] || ShieldCheck
          return (
            <div key={t.label} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-stone-50/60 px-3 py-2">
              <Icon className="h-4 w-4 flex-shrink-0 text-slate-700" />
              <span className="text-[12px] font-medium text-slate-700">{t.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AlreadyOrderedCTA() {
  return (
    <Link
      to="/check"
      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-slate-300 hover:bg-stone-50/30"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-stone-50 text-slate-700">
          <Search className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Already ordered?</div>
          <div className="text-[11px] text-slate-500">Check your live order status or token</div>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-400" />
    </Link>
  )
}

export default function CustomerQR() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 md:space-y-5">
      <Hero />
      <ActionCards />
      <PopularDishes />
      <TrustStrip />
      <AlreadyOrderedCTA />

      <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-slate-400">
        <Utensils className="h-3.5 w-3.5" />
        <span>Powered by Smart Queue Control</span>
      </div>
    </div>
  )
}
