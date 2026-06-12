"use client";
import { useState } from "react";
import { Download, Printer, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import ExpenseLineChart from "@/components/charts/ExpenseLineChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import Modal from "@/components/ui/Modal";
import { MONTHLY_REPORTS, MONTHLY_COMPARISON } from "@/data/reports";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MONTHS = ["Jun-2026","May-2026","Apr-2026"];

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("Jun-2026");
  const [printModal, setPrintModal] = useState(false);
  const report = MONTHLY_REPORTS.find((r) => r.month === selectedMonth) || MONTHLY_REPORTS[0];
  const totalBudget = 182000;

  const summaryCards = [
    {
      label: "Total Expenses",
      value: formatCurrency(report.totalExpenses),
      icon: <span className="text-base font-extrabold text-[#1B3A5C]">₹</span>,
      color: "text-slate-900",
      bg: "bg-slate-100",
    },
    {
      label: "Verified %",
      value: `${report.verifiedPercentage}%`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Top Category",
      value: "Goods & Inventory",
      icon: <TrendingUp className="w-4 h-4 text-amber-600" />,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "Missing Proofs",
      value: String(report.missingProofs),
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      color: report.missingProofs > 0 ? "text-red-700" : "text-emerald-700",
      bg: report.missingProofs > 0 ? "bg-red-50" : "bg-emerald-50",
    },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Monthly Expense Reports</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Complete expense breakdown and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-semibold shadow-sm"
          >
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <Button variant="outline" size="sm" leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => setPrintModal(true)}>
            Print
          </Button>
          <Button size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => toast.success(`${selectedMonth} report downloaded as PDF.`)}>
            Download PDF
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
            <p className="text-xs text-slate-400 font-medium mt-1.5">{selectedMonth}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div><CardTitle>Daily Expense Trend</CardTitle><p className="text-xs text-slate-400 mt-0.5">{selectedMonth}</p></div>
          </CardHeader>
          <ExpenseLineChart data={report.dailyTrend} />
        </Card>
        <Card>
          <CardHeader>
            <div><CardTitle>Category Breakdown</CardTitle><p className="text-xs text-slate-400 mt-0.5">{formatCurrency(report.totalExpenses)} total</p></div>
          </CardHeader>
          <CategoryDonutChart data={report.categoryBreakdown} />
        </Card>
      </div>

      {/* 6-month comparison */}
      <Card>
        <CardHeader>
          <div><CardTitle>6-Month Category Comparison</CardTitle><p className="text-xs text-slate-400 mt-0.5">Jan–Jun 2026</p></div>
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </CardHeader>
        <MonthlyBarChart data={MONTHLY_COMPARISON} />
      </Card>

      {/* Category table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100">
          <CardTitle>Category Expense Breakdown — {selectedMonth}</CardTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Category","Amount","% of Total","vs Budget","Budget Used"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.categoryBreakdown.map((cat) => {
                const pct = Math.round((cat.amount / report.totalExpenses) * 100);
                const budgetPct = Math.min(100, Math.round((cat.amount / (totalBudget / 7)) * 100));
                return (
                  <tr key={cat.category} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                        <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900">{formatCurrency(cat.amount)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-500">{pct}%</td>
                    <td className="px-5 py-3.5 w-36">
                      <ProgressBar value={budgetPct} max={100} height="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-600">{budgetPct}%</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td className="px-5 py-3.5 text-sm font-bold text-slate-900">Total</td>
                <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900">{formatCurrency(report.totalExpenses)}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Print Preview Modal */}
      <Modal open={printModal} onClose={() => setPrintModal(false)} title="Print Preview" size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setPrintModal(false)}>Close</Button>
            <Button onClick={() => { window.print(); setPrintModal(false); }} leftIcon={<Printer className="w-3.5 h-3.5" />}>
              Print Report
            </Button>
          </>
        }
      >
        <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <p className="font-extrabold text-sm text-slate-900">Rayudu Gari Military Hotel</p>
              <p className="text-sm text-slate-500 mt-0.5">Expense Control Report — {selectedMonth}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Generated: 12-Jun-2026</p>
              <p className="text-xs text-slate-400">By: Webresfolio System</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              ["Total Expenses", formatCurrency(report.totalExpenses), "text-slate-900"],
              ["Verified %", `${report.verifiedPercentage}%`, "text-emerald-600"],
              ["Missing Proof Entries", String(report.missingProofs), "text-red-600"],
            ].map(([k, v, cls]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{k}</span>
                <span className={`text-sm font-bold ${cls}`}>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center">Full report with charts will print. Ensure printer is connected.</p>
        </div>
      </Modal>
    </div>
  );
}
