"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, CheckCircle, XCircle, ShoppingBasket, Wrench, Zap, SprayCan,
  Megaphone, Truck, Wallet, ClipboardCheck, BarChart3, Users, Bell,
  ShieldCheck, FileText, TrendingDown, Building2, ChevronRight, Menu, X,
  PackageCheck, AlertTriangle, DollarSign, Eye, Lock,
} from "lucide-react";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = Math.ceil(target / 45);
    const id = setInterval(() => {
      s += step;
      if (s >= target) { setVal(target); clearInterval(id); } else setVal(s);
    }, 28);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const PROBLEMS = [
  { icon: <XCircle className="w-5 h-5 text-red-400" />, title: "No centralized records", desc: "Daily purchases, repairs, and bills are tracked manually or not at all — making month-end reconciliation impossible." },
  { icon: <XCircle className="w-5 h-5 text-red-400" />, title: "Cash given without proof", desc: "Petty cash and vendor payments leave the business with no digital trail — just verbal acknowledgement." },
  { icon: <XCircle className="w-5 h-5 text-red-400" />, title: "Delayed bill submission", desc: "Bills submitted days after purchase, often lost or incomplete, blocking any meaningful review." },
  { icon: <XCircle className="w-5 h-5 text-red-400" />, title: "No budget visibility", desc: "No real-time view of spend per category. Overspend discovered only at month end." },
  { icon: <XCircle className="w-5 h-5 text-red-400" />, title: "Owner has no oversight", desc: "The owner cannot approve or review expenses remotely. All decisions require physical presence." },
  { icon: <XCircle className="w-5 h-5 text-red-400" />, title: "Undetected duplicate payments", desc: "Same vendor, same week, different supervisor — without history, duplicate payments go unnoticed." },
];

const MODULES = [
  { num: "01", icon: <ShoppingBasket className="w-4 h-4" />, name: "Goods & Inventory", desc: "Every purchase logged with qty, rate and bill." },
  { num: "02", icon: <Wrench className="w-4 h-4" />, name: "Maintenance & Repair", desc: "Technician details, amount, and bill stored." },
  { num: "03", icon: <Zap className="w-4 h-4" />, name: "Utility Bills", desc: "EB, water, gas, internet — proof tracked per bill." },
  { num: "04", icon: <SprayCan className="w-4 h-4" />, name: "Cleaning & Hygiene", desc: "Vendor, quantity, and rate recorded per entry." },
  { num: "05", icon: <Megaphone className="w-4 h-4" />, name: "Marketing & Branding", desc: "Per-campaign tracking with vendor history." },
  { num: "06", icon: <Truck className="w-4 h-4" />, name: "Transport & Logistics", desc: "Freight, fuel, toll — vehicle and route captured." },
  { num: "07", icon: <Wallet className="w-4 h-4" />, name: "Petty Cash Register", desc: "Running balance with month-end reconciliation." },
  { num: "08", icon: <ClipboardCheck className="w-4 h-4" />, name: "Approval Workflow", desc: "5-step digital approval with timestamps." },
  { num: "09", icon: <BarChart3 className="w-4 h-4" />, name: "Monthly Reports", desc: "One-click summary with budget comparison." },
  { num: "10", icon: <Users className="w-4 h-4" />, name: "Vendor History", desc: "Lifetime payments — detect rate changes." },
  { num: "11", icon: <Bell className="w-4 h-4" />, name: "Recurring Reminders", desc: "EB, rent, AMC — due-date alerts with colors." },
  { num: "12", icon: <DollarSign className="w-4 h-4" />, name: "Budget Control", desc: "Alerts at 80% and 100% utilization." },
  { num: "13", icon: <FileText className="w-4 h-4" />, name: "Missing Proof Tracker", desc: "Block month-close until all bills are uploaded." },
  { num: "14", icon: <TrendingDown className="w-4 h-4" />, name: "Cash Leakage Report", desc: "Cash out vs. bill-verified — gap exposed." },
];

const WORKFLOW_STEPS = [
  { step: 1, role: "Supervisor", action: "Adds Expense", detail: "Item, vendor, amount, mode", color: "bg-[#1B3A5C]" },
  { step: 2, role: "Supervisor", action: "Uploads Proof", detail: "Photo or scan of bill", color: "bg-[#2A5080]" },
  { step: 3, role: "Manager", action: "Verifies & Forwards", detail: "Reviews and forwards", color: "bg-[#E67E22]" },
  { step: 4, role: "Owner", action: "Approves / Rejects", detail: "Final decision + comment", color: "bg-emerald-600" },
  { step: 5, role: "System", action: "Report Generated", detail: "Auto-added to monthly report", color: "bg-slate-600" },
];

const BEFORE_AFTER = [
  { area: "Expense Tracking", before: "No record kept", after: "100% categorized daily" },
  { area: "Bill Management", before: "Paper bills lost in days", after: "Digital proof stored forever" },
  { area: "Cash Control", before: "No audit trail", after: "Every rupee traceable" },
  { area: "Owner Oversight", before: "Needs physical presence", after: "Review from anywhere, anytime" },
  { area: "Approval Process", before: "Verbal, no record", after: "5-step digital workflow" },
  { area: "Month-End Close", before: "Hours of confusion", after: "One-click reconciliation" },
];

const IMPACT_POINTS = [
  { icon: "📊", title: "Complete Visibility", desc: "Owner sees all spending across categories in one dashboard — no surprises at month end." },
  { icon: "💰", title: "Better Cash Control", desc: "Petty cash register with running balance prevents untracked disbursements." },
  { icon: "🔍", title: "Reduced Leakage", desc: "Cash leakage report shows exactly which entries have no corresponding bill proof." },
  { icon: "⏱️", title: "5-Minute Monthly Review", desc: "What previously took hours is now a quick review of the monthly report dashboard." },
  { icon: "✅", title: "Proof-Based Approvals", desc: "No approval without a bill. Every entry needs documentary evidence." },
  { icon: "📅", title: "Never Miss a Payment", desc: "Recurring reminders for rent, EB, AMC, gas — due-date alerts prevent late fees." },
  { icon: "🏷️", title: "Budget Adherence", desc: "Real-time budget bars with 80%/100% alerts prevent overspend before it happens." },
  { icon: "🤝", title: "Vendor Accountability", desc: "Full payment history per vendor to compare rates and detect overbilling." },
];

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm" : "bg-white/90 backdrop-blur-sm"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B3A5C] to-[#2A5080] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-slate-900/20">W</div>
            <div>
              <span className="text-[15px] font-bold text-slate-900 leading-none" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>Webresfolio</span>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Expense Control System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#solution" className="hover:text-slate-900 transition-colors">Solution</a>
            <a href="#modules" className="hover:text-slate-900 transition-colors">Modules</a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">Workflow</a>
            <a href="#impact" className="hover:text-slate-900 transition-colors">Impact</a>
            <Link href="/impact" className="hover:text-slate-900 transition-colors">Business Case</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/presentation" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100">
              Presentation
            </Link>
            <Link href="/demo" className="hidden md:flex items-center gap-1.5 bg-[#1B3A5C] hover:bg-[#2A5080] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-slate-900/20">
              Launch Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600" onClick={() => setNavOpen((v) => !v)}>
              {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-5 space-y-1">
            {["solution", "modules", "workflow", "impact"].map((s) => (
              <a key={s} href={`#${s}`} onClick={() => setNavOpen(false)}
                className="block capitalize text-slate-700 py-2.5 text-sm font-medium hover:text-[#1B3A5C] transition-colors">{s}</a>
            ))}
            <Link href="/demo" onClick={() => setNavOpen(false)}
              className="flex items-center justify-center gap-2 mt-3 w-full bg-[#1B3A5C] text-white font-semibold py-3 rounded-xl text-sm">
              Launch Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(27,58,92,0.06),transparent_70%)]" />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-[#1B3A5C]/8 text-[#1B3A5C] text-xs font-semibold px-4 py-2 rounded-full border border-[#1B3A5C]/15 mb-6">
              <Building2 className="w-3.5 h-3.5" />
              Proposed for Rayudu Gari Military Hotel
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
              Complete Expense<br />
              <span className="text-[#E67E22]">Visibility & Control</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              One centralized system to track, approve, and report every expense — goods, repairs, utilities, and petty cash.
              Built for the way your team actually works.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
              <a href="#solution" className="flex items-center gap-2 bg-[#1B3A5C] hover:bg-[#2A5080] text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-slate-900/20">
                View Solution <ChevronRight className="w-4 h-4" />
              </a>
              <Link href="/demo" className="flex items-center gap-2 bg-[#E67E22] hover:bg-[#F39C12] text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/25">
                Launch Interactive Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: "Expense Modules", value: 14, suffix: "", desc: "Fully integrated" },
              { label: "Approval Steps", value: 5, suffix: "", desc: "Digital workflow" },
              { label: "Bill Coverage", value: 100, suffix: "%", desc: "Proof-based" },
              { label: "Dashboard Views", value: 3, suffix: "", desc: "Role-aware" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left hover:shadow-md transition-shadow">
                <p className="text-3xl font-extrabold text-[#1B3A5C] leading-none" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-2">{s.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-full border border-red-100 mb-4">
              <AlertTriangle className="w-3.5 h-3.5" /> The Current Situation
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
              6 Operational Problems Without This System
            </h2>
            <p className="text-slate-500 text-base mt-3 max-w-xl mx-auto leading-relaxed">
              These are not hypothetical — they are the day-to-day realities in hotel kitchens without a structured expense system.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROBLEMS.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.07}>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 h-full hover:border-red-200 hover:bg-red-50/30 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    {p.icon}
                    <p className="text-sm font-bold text-slate-800">{p.title}</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section id="solution" className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#1B3A5C]/8 text-[#1B3A5C] text-xs font-semibold px-4 py-2 rounded-full border border-[#1B3A5C]/15 mb-4">
              <CheckCircle className="w-3.5 h-3.5" /> The Solution
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
              A Centralized Expense Control Portal
            </h2>
            <p className="text-slate-500 text-base mt-3 max-w-xl mx-auto leading-relaxed">
              Purpose-built for Rayudu Gari Military Hotel — internal, admin-controlled, and designed around the owner&apos;s need for visibility.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Lock className="w-5 h-5 text-white" />, title: "Internal Only", desc: "Strictly for authorized hotel staff. No public access.", bg: "bg-[#1B3A5C]", border: "border-blue-200" },
              { icon: <ShieldCheck className="w-5 h-5 text-white" />, title: "Admin Controlled", desc: "All user roles and permissions managed by the owner.", bg: "bg-[#E67E22]", border: "border-orange-200" },
              { icon: <Eye className="w-5 h-5 text-white" />, title: "Owner Visibility", desc: "Real-time dashboard so the owner always knows where money is going.", bg: "bg-emerald-500", border: "border-emerald-200" },
              { icon: <FileText className="w-5 h-5 text-white" />, title: "Proof-Based", desc: "No approval without a bill. Every entry needs documentary evidence.", bg: "bg-indigo-500", border: "border-indigo-200" },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <div className={`bg-white border ${item.border} rounded-2xl p-6 h-full hover:shadow-lg transition-all`}>
                  <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center mb-4 shadow-lg`}>{item.icon}</div>
                  <p className="text-base font-bold text-slate-900 mb-2">{item.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-semibold px-4 py-2 rounded-full border border-purple-100 mb-4">
              <PackageCheck className="w-3.5 h-3.5" /> 14 Integrated Modules
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
              Every Expense Category. One System.
            </h2>
            <p className="text-slate-500 text-base mt-3">From daily goods purchases to recurring utility bills — all 14 modules in one portal.</p>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {MODULES.map((mod, i) => (
              <FadeUp key={mod.num} delay={(i % 4) * 0.06}>
                <div className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 h-full hover:bg-white hover:shadow-md hover:border-[#1B3A5C]/30 transition-all cursor-default">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-xs font-bold text-slate-300">{mod.num}</span>
                    <div className="w-8 h-8 rounded-xl bg-[#1B3A5C] text-white flex items-center justify-center group-hover:bg-[#E67E22] transition-colors shadow-sm">
                      {mod.icon}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">{mod.name}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section id="workflow" className="py-20 px-6 bg-[#0D1B2E] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(27,58,92,0.8),transparent_70%)]" />
        <div className="max-w-4xl mx-auto relative">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-4 py-2 rounded-full border border-white/15 mb-4">
              <ClipboardCheck className="w-3.5 h-3.5" /> 5-Step Approval Flow
            </div>
            <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
              Every Expense Follows a Structured Path
            </h2>
            <p className="text-white/50 text-base mt-3 max-w-lg mx-auto">From supervisor entry to owner approval — with proof required at every stage.</p>
          </FadeUp>

          {/* Desktop stepper */}
          <div className="hidden md:flex items-start gap-0 relative">
            <div className="absolute top-5 left-[10%] right-[10%] h-px bg-white/10" />
            {WORKFLOW_STEPS.map((step, i) => (
              <FadeUp key={step.action} delay={i * 0.1} className="flex-1">
                <div className="flex flex-col items-center text-center px-3">
                  <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-sm z-10 relative shadow-lg mb-4`}>
                    {step.step}
                  </div>
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1">{step.role}</p>
                  <p className="text-sm font-bold text-white mb-1">{step.action}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{step.detail}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Mobile stepper */}
          <div className="md:hidden space-y-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <FadeUp key={step.action} delay={i * 0.1}>
                <div className="flex items-start gap-4 bg-white/5 rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {step.step}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wide">{step.role}</p>
                    <p className="text-sm font-bold text-white mt-0.5">{step.action}</p>
                    <p className="text-xs text-white/40 mt-0.5">{step.detail}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
              Before vs. After
            </h2>
            <p className="text-slate-500 text-base mt-3">A clear operational comparison across key business areas.</p>
          </FadeUp>
          <FadeUp>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="grid grid-cols-3 bg-slate-50 px-6 py-3.5 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Area</span>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Before System</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">After System</span>
              </div>
              {BEFORE_AFTER.map((row, i) => (
                <div key={row.area} className={`grid grid-cols-3 px-6 py-4 text-sm border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <span className="font-semibold text-slate-700">{row.area}</span>
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{row.before}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{row.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section id="impact" className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full border border-emerald-100 mb-4">
              <CheckCircle className="w-3.5 h-3.5" /> Business Impact
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
              What This System Delivers
            </h2>
            <p className="text-slate-500 text-base mt-3">Operational benefits designed around the real needs of a hotel business.</p>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {IMPACT_POINTS.map((item, i) => (
              <FadeUp key={item.title} delay={(i % 4) * 0.07}>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 h-full hover:shadow-md hover:border-slate-300 transition-all">
                  <span className="text-2xl block mb-3">{item.icon}</span>
                  <p className="text-sm font-bold text-slate-900 mb-2">{item.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.3} className="mt-8 text-center">
            <Link href="/impact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors">
              View full business impact analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── WHY WEBRESFOLIO ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
              Why Webresfolio
            </h2>
            <p className="text-slate-500 text-base mt-3">We don&apos;t build generic software. We build what your business actually needs.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { icon: <Lock className="w-5 h-5 text-[#1B3A5C]" />, title: "Internal-Only Access", desc: "No public-facing portal. Access is strictly for authorized staff of Rayudu Gari Military Hotel." },
              { icon: <ShieldCheck className="w-5 h-5 text-[#1B3A5C]" />, title: "Built for Your Business", desc: "Designed specifically around the workflows and challenges of a large commercial kitchen operation." },
              { icon: <Eye className="w-5 h-5 text-[#1B3A5C]" />, title: "Owner in Control", desc: "The system is designed from the owner's perspective — you see everything, approve everything." },
              { icon: <Building2 className="w-5 h-5 text-[#1B3A5C]" />, title: "Hyderabad-Based Team", desc: "Webresfolio is a Hyderabad software team with domain understanding of local business operations." },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.07}>
                <div className="flex items-start gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-[#1B3A5C]/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#1B3A5C]/8 border border-[#1B3A5C]/15 flex items-center justify-center shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp>
            <div className="bg-[#1B3A5C]/4 border border-[#1B3A5C]/15 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-base font-bold text-slate-900">Webresfolio — Software & Web Solutions</p>
                <p className="text-sm text-slate-500 mt-1">info@webresfolio.com · Hyderabad, Telangana</p>
              </div>
              <Link href="/demo" className="flex items-center gap-2 bg-[#1B3A5C] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#2A5080] transition-colors whitespace-nowrap shadow-md">
                Start the Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0D1B2E] via-[#1B3A5C] to-[#0D1B2E] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(230,126,34,0.12),transparent_65%)]" />
        <FadeUp className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-semibold px-4 py-2 rounded-full border border-white/15 mb-6">
            Interactive Demo Available
          </div>
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
            See It Working — Right Now
          </h2>
          <p className="text-white/55 text-base mb-10 max-w-xl mx-auto leading-relaxed">
            The interactive demo uses real sample data from a hotel operation.
            Log in as Owner, Manager, or Supervisor and explore the full system.
          </p>
          <Link href="/demo"
            className="inline-flex items-center gap-3 bg-[#E67E22] hover:bg-[#F39C12] text-white text-base font-bold px-10 py-4 rounded-2xl transition-colors shadow-2xl shadow-orange-500/30">
            Launch Interactive Demo <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-white/30 text-sm mt-6">No login required · All data is sample · Nothing is stored</p>
        </FadeUp>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080E18] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-bold text-xs">W</div>
            <span className="text-white/30 text-sm">Webresfolio — Expense Control System Demo</span>
          </div>
          <span className="text-white/20 text-xs">Proposed for Rayudu Gari Military Hotel · Hyderabad</span>
        </div>
      </footer>
    </div>
  );
}
