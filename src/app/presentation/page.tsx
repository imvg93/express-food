"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Grid3X3, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "The Problem",
    subtitle: "Why this system is needed",
    caption: "These are the exact operational gaps that cost money every month in a hotel kitchen without a system.",
    content: (
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "❌", text: "No record of daily purchases" },
          { icon: "❌", text: "Cash paid without receipts" },
          { icon: "❌", text: "Bills lost before submission" },
          { icon: "❌", text: "Owner has no real-time view" },
          { icon: "❌", text: "No budget tracking per category" },
          { icon: "❌", text: "Duplicate payments undetected" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 bg-red-50 rounded-xl p-3 text-xs text-red-700 font-medium">
            <span>{item.icon}</span> {item.text}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 2,
    title: "Owner Dashboard",
    subtitle: "What the owner sees every morning",
    caption: "This is what the owner sees every morning — all spending at a glance with pending approvals and budget health.",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Today's Expenses", value: "₹8,420", color: "text-[#1B3A5C]" },
            { label: "Month to Date", value: "₹2,14,560", color: "text-[#1B3A5C]" },
            { label: "Pending Approvals", value: "7", color: "text-amber-600" },
            { label: "Missing Proofs", value: "3", color: "text-red-600" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-[#E5E7EB] rounded-xl p-3">
              <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          ⚠️ Marketing budget at 87% — review before month end
        </div>
        <div className="bg-[#F8F9FB] rounded-xl p-3">
          <p className="text-[10px] font-semibold text-[#374151] mb-2">Budget Utilization</p>
          <div className="space-y-1.5">
            {[
              { label: "Goods", pct: 78 }, { label: "Maintenance", pct: 45 },
              { label: "Utilities", pct: 62 }, { label: "Marketing", pct: 87 },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-[10px] text-[#6B7280] w-20">{b.label}</span>
                <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.pct > 80 ? "#EF4444" : b.pct > 60 ? "#F59E0B" : "#22C55E" }} />
                </div>
                <span className={`text-[10px] font-semibold w-8 text-right ${b.pct > 80 ? "text-red-600" : b.pct > 60 ? "text-amber-600" : "text-green-600"}`}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "5-Step Approval Workflow",
    subtitle: "Every expense follows a structured path",
    caption: "No expense is approved without going through all 5 steps — each with a timestamp, actor name, and optional comment.",
    content: (
      <div className="space-y-2">
        {[
          { step: 1, role: "Supervisor", action: "Submits expense entry", status: "done", color: "bg-green-500" },
          { step: 2, role: "Supervisor", action: "Uploads bill proof", status: "done", color: "bg-green-500" },
          { step: 3, role: "Manager", action: "Verifies and forwards", status: "done", color: "bg-green-500" },
          { step: 4, role: "Owner", action: "Approves or rejects", status: "current", color: "bg-amber-500" },
          { step: 5, role: "System", action: "Added to monthly report", status: "pending", color: "bg-[#E5E7EB]" },
        ].map((s) => (
          <div key={s.step} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.step}</div>
            <div className="flex-1 flex items-center justify-between bg-[#F8F9FB] rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-[#374151]">{s.action}</span>
              <span className="text-[10px] text-[#9CA3AF]">{s.role}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 4,
    title: "14 Expense Modules",
    subtitle: "One system for all expense categories",
    caption: "Every type of hotel expense has its own module — with category-specific fields, vendor tracking, and bill upload.",
    content: (
      <div className="grid grid-cols-2 gap-2">
        {[
          { n: "01", name: "Goods & Inventory" }, { n: "02", name: "Maintenance" },
          { n: "03", name: "Utilities" }, { n: "04", name: "Cleaning" },
          { n: "05", name: "Marketing" }, { n: "06", name: "Transport" },
          { n: "07", name: "Petty Cash" }, { n: "08", name: "Approvals" },
          { n: "09", name: "Monthly Reports" }, { n: "10", name: "Vendor History" },
          { n: "11", name: "Reminders" }, { n: "12", name: "Budget Control" },
          { n: "13", name: "Missing Proofs" }, { n: "14", name: "Cash Leakage" },
        ].map((m) => (
          <div key={m.n} className="flex items-center gap-2 bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2">
            <span className="text-[10px] font-bold text-[#9CA3AF]">{m.n}</span>
            <span className="text-xs text-[#374151]">{m.name}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 5,
    title: "Petty Cash Register",
    subtitle: "Every rupee accounted for",
    caption: "The petty cash register shows running balance, daily entries, and a month-end reconciliation — nothing can go unrecorded.",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1B3A5C] text-white rounded-xl p-3 text-center">
            <p className="text-lg font-bold">₹5,000</p>
            <p className="text-[10px] text-white/60">Opening Balance</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-red-600">₹3,420</p>
            <p className="text-[10px] text-[#9CA3AF]">Total Disbursed</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-600">₹1,580</p>
            <p className="text-[10px] text-[#9CA3AF]">Remaining</p>
          </div>
        </div>
        <div className="bg-[#F8F9FB] rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 px-3 py-2 text-[10px] font-semibold text-[#9CA3AF] uppercase border-b border-[#E5E7EB]">
            <span>Date</span><span>Purpose</span><span className="text-right">Amount</span>
          </div>
          {[
            ["10-Jun", "Local vegetable purchase", "₹420"],
            ["09-Jun", "Quick plumbing repair", "₹350"],
            ["08-Jun", "Stationery & printing", "₹180"],
          ].map(([date, desc, amt]) => (
            <div key={date} className="grid grid-cols-3 px-3 py-2 text-[10px] text-[#374151] border-b border-[#F3F4F6] last:border-0">
              <span>{date}</span><span>{desc}</span><span className="text-right font-semibold text-red-600">{amt}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Monthly Reports",
    subtitle: "One-click monthly summary",
    caption: "The monthly report consolidates everything — total spend, category breakdown, budget comparison, and proof coverage — in one view.",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Total Expenses", value: "₹2,14,560", sub: "June 2026" },
            { label: "Goods (Largest)", value: "₹1,06,200", sub: "49.5% of total" },
            { label: "Verified Bills", value: "91%", sub: "218 of 239 entries" },
            { label: "vs Last Month", value: "+8.3%", sub: "₹16,320 more" },
          ].map((item) => (
            <div key={item.label} className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-3">
              <p className="text-sm font-bold text-[#111827]">{item.value}</p>
              <p className="text-[10px] text-[#9CA3AF]">{item.label}</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#F8F9FB] rounded-xl p-3">
          <p className="text-[10px] font-semibold text-[#374151] mb-2">Category Breakdown</p>
          {[
            { cat: "Goods", amt: "₹1,06,200", pct: 49 }, { cat: "Utilities", amt: "₹28,400", pct: 13 },
            { cat: "Maintenance", amt: "₹18,600", pct: 9 }, { cat: "Transport", amt: "₹6,200", pct: 3 },
          ].map((r) => (
            <div key={r.cat} className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#6B7280] w-16">{r.cat}</span>
              <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#1B3A5C] rounded-full" style={{ width: `${r.pct * 2}%` }} />
              </div>
              <span className="text-[10px] text-[#374151] w-16 text-right">{r.amt}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "Missing Proof & Cash Leakage",
    subtitle: "Preventing unverified spending",
    caption: "These two modules ensure no cash leaves the business without documentation — and flag existing gaps before month close.",
    content: (
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Missing Proof Alert</p>
          <p className="text-[11px] text-red-600">3 entries submitted without bill proof. Month cannot be closed until resolved.</p>
          <div className="mt-2 space-y-1">
            {[["08-Jun", "RK Poultry Farms", "₹4,200"], ["07-Jun", "Krishna AC Services", "₹2,500"], ["05-Jun", "Spice Route Distributors", "₹1,840"]].map(([d, v, a]) => (
              <div key={d} className="flex justify-between text-[10px] bg-white/70 rounded-lg px-2 py-1.5">
                <span className="text-[#374151]">{d} · {v}</span>
                <span className="font-semibold text-red-600">{a}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#F8F9FB] rounded-xl p-3 text-center">
            <p className="text-base font-bold text-[#111827]">₹38,420</p>
            <p className="text-[10px] text-[#9CA3AF]">Total Cash Out (Week)</p>
          </div>
          <div className="bg-[#F8F9FB] rounded-xl p-3 text-center">
            <p className="text-base font-bold text-red-600">17%</p>
            <p className="text-[10px] text-[#9CA3AF]">Unverified / Leakage</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "Ready to Implement",
    subtitle: "Your next step",
    caption: "The system is ready to deploy for Rayudu Gari Military Hotel. Contact Webresfolio to begin implementation.",
    content: (
      <div className="space-y-4">
        <div className="bg-[#1B3A5C] rounded-2xl p-5 text-white text-center">
          <p className="text-base font-bold mb-1">Webresfolio</p>
          <p className="text-white/60 text-xs mb-3">Software & Web Solutions · Hyderabad</p>
          <p className="text-sm font-semibold">info@webresfolio.com</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["14 Modules", "5-Step Approval", "3 User Roles", "Real-Time Dashboard"].map((item) => (
            <div key={item} className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
              <p className="text-xs font-semibold text-green-700">✓ {item}</p>
            </div>
          ))}
        </div>
        <Link href="/demo" className="flex items-center justify-center gap-2 bg-[#E67E22] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#F39C12] transition-colors">
          Explore Full Demo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    ),
  },
];

export default function PresentationPage() {
  const [current, setCurrent] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const slide = SLIDES[current];
  const total = SLIDES.length;

  return (
    <div className="min-h-screen bg-[#0F2035] flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1B3A5C] flex items-center justify-center text-white font-bold text-xs">W</div>
          <span className="text-white/60 text-xs">Expense Control System — Presentation Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            <Grid3X3 className="w-4 h-4" />
          </button>
          <Link href="/" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <div className="w-full max-w-2xl">
          {/* Caption */}
          <AnimatePresence mode="wait">
            <motion.div key={`cap-${current}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/60 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-2">
                {current + 1} / {total}
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>{slide.title}</h2>
              <p className="text-white/50 text-xs mt-1">{slide.subtitle}</p>
            </motion.div>
          </AnimatePresence>

          {/* Content card */}
          <AnimatePresence mode="wait">
            <motion.div key={`slide-${current}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl p-5 mb-5"
            >
              {slide.content}
            </motion.div>
          </AnimatePresence>

          {/* Presenter caption */}
          <AnimatePresence mode="wait">
            <motion.p key={`note-${current}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-white/40 text-xs text-center mb-6 max-w-md mx-auto">
              {slide.caption}
            </motion.p>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-[#E67E22]" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
                />
              ))}
            </div>

            {current < total - 1 ? (
              <button onClick={() => setCurrent(current + 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E67E22] hover:bg-[#F39C12] text-white text-xs font-semibold transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <Link href="/demo" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E67E22] hover:bg-[#F39C12] text-white text-xs font-semibold transition-colors">
                Open Demo <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Jump menu overlay */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
            onClick={() => setShowMenu(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-bold text-[#111827] mb-4">Jump to Section</p>
              <div className="space-y-1">
                {SLIDES.map((s, i) => (
                  <button key={i} onClick={() => { setCurrent(i); setShowMenu(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${i === current ? "bg-[#1B3A5C] text-white" : "hover:bg-[#F8F9FB] text-[#374151]"}`}>
                    <span className={`text-[10px] font-bold ${i === current ? "text-white/60" : "text-[#9CA3AF]"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xs font-medium">{s.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
