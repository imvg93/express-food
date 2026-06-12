"use client";
import { useState } from "react";
import { TrendingDown, Download, DollarSign, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CashLeakageChart from "@/components/charts/CashLeakageChart";
import { useDemoStore } from "@/store/demoStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const LEAKAGE_CATEGORIES = [
  { label:"Goods & Inventory",     cashOut:42000, verified:38200, color:"#1B3A5C" },
  { label:"Maintenance & Repair",  cashOut:8200,  verified:5800,  color:"#E67E22" },
  { label:"Transport & Logistics", cashOut:4200,  verified:3400,  color:"#06B6D4" },
  { label:"Petty Cash",            cashOut:2000,  verified:1400,  color:"#F59E0B" },
  { label:"Cleaning & Hygiene",    cashOut:1800,  verified:1850,  color:"#22C55E" },
];

export default function CashLeakagePage() {
  const { expenses } = useDemoStore();
  const [period, setPeriod] = useState<"week"|"month">("week");

  const totalCashOut = period === "week" ? 38420 : 86620;
  const totalVerified = period === "week" ? 31870 : 72480;
  const unverified = totalCashOut - totalVerified;
  const leakagePct = Math.round((unverified / totalCashOut) * 100);

  const cashExpenses = expenses.filter((e) => e.paymentMode === "Cash" && !e.hasBillProof);

  const summaryCards = [
    { label:"Total Cash Out",       value: formatCurrency(totalCashOut),  color:"text-slate-900", bg:"bg-slate-100", icon:<DollarSign className="w-4 h-4 text-slate-600" /> },
    { label:"Bill-Verified Cash",   value: formatCurrency(totalVerified), color:"text-emerald-700", bg:"bg-emerald-50", icon:<ShieldCheck className="w-4 h-4 text-emerald-600" /> },
    { label:"Unverified / Leakage", value: formatCurrency(unverified),    color:"text-red-700",   bg:"bg-red-50",    icon:<TrendingDown className="w-4 h-4 text-red-500" /> },
    { label:"Leakage %",            value: `${leakagePct}%`,              color: leakagePct > 20 ? "text-red-700" : "text-amber-700", bg: leakagePct > 20 ? "bg-red-50" : "bg-amber-50", icon:<AlertTriangle className={cn("w-4 h-4", leakagePct > 20 ? "text-red-500" : "text-amber-500")} /> },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cash Leakage Report</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Cash vs. bill-verified expense comparison</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1">
            {(["week","month"] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={cn("px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors", period === p ? "bg-[#1B3A5C] text-white shadow-sm" : "text-slate-500 hover:text-slate-800")}>
                {p === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => toast.success("Leakage report exported.")}>
            Export
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((item) => (
          <div key={item.label}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">{item.label}</p>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                {item.icon}
              </div>
            </div>
            <p className={cn("text-[28px] font-extrabold tracking-tight leading-none", item.color)}>{item.value}</p>
            <p className="text-xs text-slate-400 font-medium mt-1.5">{period === "week" ? "Jun 2026 (Wk 2)" : "Jun 2026"}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div><CardTitle>Cash Out vs. Bill-Verified</CardTitle><p className="text-xs text-slate-400 mt-0.5">{period === "week" ? "June 2026 — Week 2" : "June 2026"}</p></div>
          <TrendingDown className="w-4 h-4 text-red-400" />
        </CardHeader>
        <CashLeakageChart />
        <div className="flex items-center gap-5 mt-3 justify-center">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <div className="w-3 h-1.5 bg-red-500 rounded" /> Cash Out
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <div className="w-3 h-1.5 bg-emerald-500 rounded" /> Bill-Verified
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <div><CardTitle>Category Leakage Breakdown</CardTitle><p className="text-xs text-slate-400 mt-0.5">Higher % = more unverified cash</p></div>
        </CardHeader>
        <div className="space-y-4">
          {LEAKAGE_CATEGORIES.map((cat) => {
            const leak    = cat.cashOut - cat.verified;
            const leakPct = Math.max(0, Math.round((leak / cat.cashOut) * 100));
            return (
              <div key={cat.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                    <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-5 text-sm">
                    <span className="text-slate-500 font-medium">Out: <span className="font-bold text-slate-700">{formatCurrency(cat.cashOut)}</span></span>
                    <span className="text-emerald-600 font-bold">{formatCurrency(cat.verified)}</span>
                    <span className={cn("font-extrabold", leakPct > 20 ? "text-red-600" : "text-amber-600")}>
                      {leakPct}% leak
                    </span>
                  </div>
                </div>
                <div className="relative h-2 bg-red-100 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.round((cat.verified / cat.cashOut) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Unverified cash entries */}
      {cashExpenses.length > 0 && (
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <CardTitle>Cash Entries Without Proof ({cashExpenses.length})</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Date","Description","Category","Amount","Submitted By"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cashExpenses.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(e.date)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 max-w-[180px] truncate">{e.itemDescription}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 capitalize">{e.category}</td>
                    <td className="px-5 py-3.5 text-sm font-extrabold text-red-600">{formatCurrency(e.amount)}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{e.submittedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
