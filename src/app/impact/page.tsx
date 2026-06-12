"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown, CheckCircle, Mail, MapPin, Phone } from "lucide-react";

const IMPACTS = [
  {
    area: "Expense Tracking",
    before: "0% expenses documented", beforeSub: "No record of daily spending",
    after: "100% categorized daily", afterSub: "Every entry logged with category",
    icon: "📊",
  },
  {
    area: "Bill Recovery",
    before: "Receipts lost within days", beforeSub: "No physical storage system",
    after: "Digital proof stored permanently", afterSub: "Bill images stored in system",
    icon: "📄",
  },
  {
    area: "Cash Accountability",
    before: "No audit trail", beforeSub: "Cash given out, no record",
    after: "Every rupee traceable", afterSub: "UPI/cash with payment reference",
    icon: "💰",
  },
  {
    area: "Owner Review Time",
    before: "Hours of manual sorting", beforeSub: "Sifting through paper receipts",
    after: "Under 5 minutes monthly", afterSub: "Dashboard with one-click reports",
    icon: "⏱️",
  },
  {
    area: "Payment Accuracy",
    before: "Duplicate payments undetected", beforeSub: "No vendor rate history",
    after: "Vendor history prevents over-billing", afterSub: "Compare rates across periods",
    icon: "✅",
  },
  {
    area: "Approval Process",
    before: "Verbal approvals, no record", beforeSub: "No accountability chain",
    after: "Structured 5-step workflow", afterSub: "Digital approval with timestamps",
    icon: "🔄",
  },
  {
    area: "Budget Adherence",
    before: "No budget visibility", beforeSub: "Overspending discovered at end of month",
    after: "Real-time alerts at 80% and 100%", afterSub: "Proactive budget management",
    icon: "📈",
  },
  {
    area: "Month-End Close",
    before: "Cannot reconcile cash", beforeSub: "Month ends with unknown balances",
    after: "Reconciliation in one click", afterSub: "Automated cash vs. bill comparison",
    icon: "📅",
  },
];

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Nav */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1B3A5C] flex items-center justify-center text-white font-bold text-sm">W</div>
          <span className="text-sm font-semibold text-[#1B3A5C]">Webresfolio</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-[#6B7280] hover:text-[#374151]">← Solution Overview</Link>
          <Link href="/demo" className="px-4 py-2 text-xs font-semibold bg-[#1B3A5C] text-white rounded-lg hover:bg-[#2A5080] transition-colors">
            Start Demo
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <TrendingUp className="w-3.5 h-3.5" /> Business Impact
          </div>
          <h1 className="text-3xl font-bold text-[#111827]" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
            What Changes When You Implement This System
          </h1>
          <p className="text-[#6B7280] mt-3 text-sm max-w-xl mx-auto">
            A side-by-side view of operational reality before and after the Webresfolio Expense Control System.
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-2">
            * Sample projections based on operational assumptions. Actual results vary by business.
          </p>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {IMPACTS.map((item, i) => (
            <motion.div
              key={item.area}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{item.icon}</span>
                <p className="text-sm font-semibold text-[#111827]">{item.area}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wide">Before</span>
                  </div>
                  <p className="text-xs font-semibold text-red-700">{item.before}</p>
                  <p className="text-[10px] text-red-400 mt-0.5">{item.beforeSub}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wide">After</span>
                  </div>
                  <p className="text-xs font-semibold text-green-700">{item.after}</p>
                  <p className="text-[10px] text-green-400 mt-0.5">{item.afterSub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1B3A5C] rounded-2xl p-8 text-white text-center"
        >
          <p className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-jakarta, Plus Jakarta Sans, sans-serif)" }}>
            Ready to implement this system?
          </p>
          <p className="text-white/70 text-sm mb-6">
            Contact Webresfolio to discuss the implementation for Rayudu Gari Military Hotel.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm text-white/80">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@webresfolio.com</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Hyderabad, Telangana</div>
          </div>
          <Link href="/demo"
            className="inline-flex items-center gap-2 bg-[#E67E22] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#F39C12] transition-colors">
            Start Interactive Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
