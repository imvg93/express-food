"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign, CheckSquare, AlertCircle, TrendingUp, ArrowRight,
  ShoppingCart, Wrench, Zap, Clock, CheckCheck, AlertTriangle, Flame,
} from "lucide-react";
import { toast } from "sonner";
import KPICard from "@/components/dashboard/KPICard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import ExpenseLineChart from "@/components/charts/ExpenseLineChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import ExpenseDetailDrawer from "@/components/expenses/ExpenseDetailDrawer";
import { useDemoStore } from "@/store/demoStore";
import { MONTHLY_REPORTS } from "@/data/reports";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import type { Expense } from "@/types";

const report = MONTHLY_REPORTS[0];

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "purple" | "gray"> = {
  "owner-approved": "success", submitted: "gray", "proof-uploaded": "info",
  "manager-verified": "purple", rejected: "danger",
};

const CAT_ICON: Record<string, React.ReactNode> = {
  goods: <ShoppingCart className="w-4 h-4 text-[#1B3A5C]" />,
  maintenance: <Wrench className="w-4 h-4 text-amber-500" />,
  utilities: <Zap className="w-4 h-4 text-blue-500" />,
};

export default function OwnerDashboard() {
  const { expenses, budgets, updateExpenseStatus } = useDemoStore();
  const [sel, setSel] = useState<Expense | null>(null);

  const pending     = expenses.filter(e => ["submitted","proof-uploaded","manager-verified"].includes(e.status));
  const missing     = expenses.filter(e => !e.hasBillProof && e.status !== "owner-approved" && e.status !== "rejected");
  const todayTotal  = expenses.filter(e => e.date === "2026-06-12").reduce((s,e) => s + e.amount, 0);
  const recent      = [...expenses].sort((a,b) => b.date.localeCompare(a.date)).slice(0,5);
  const forOwner    = expenses.filter(e => e.status === "manager-verified");
  const hotBudgets  = budgets.filter(b => b.currentSpend / b.monthlyLimit >= 0.8);

  const approve = (exp: Expense) => {
    updateExpenseStatus(exp.id, "owner-approved", undefined, "Rayudu Gari");
    toast.success("Expense approved — " + exp.itemDescription);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">

      {/* ── Alerts ── */}
      {(hotBudgets.length > 0 || missing.length > 0) && (
        <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-2.5">
          {hotBudgets.map(b => (
            <motion.div key={b.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
              className="flex items-center gap-2 md:gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-3 md:px-4 py-2">
              <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-xs md:text-sm font-semibold text-amber-800">
                <span className="font-bold">{b.label}</span> at {Math.round((b.currentSpend/b.monthlyLimit)*100)}%
              </p>
              <Link href="/dashboard/budgets"
                className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded-lg px-2 py-1 hover:bg-amber-200 transition-colors ml-auto shrink-0">
                Review
              </Link>
            </motion.div>
          ))}
          {missing.length > 0 && (
            <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
              className="flex items-center gap-2 md:gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-3 md:px-4 py-2">
              <div className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Flame className="w-3.5 h-3.5 text-red-600" />
              </div>
              <p className="text-xs md:text-sm font-semibold text-red-800">
                <span className="font-bold">{missing.length}</span> entries missing proof
              </p>
              <Link href="/dashboard/missing-proofs"
                className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 rounded-lg px-2 py-1 hover:bg-red-200 transition-colors ml-auto shrink-0">
                View
              </Link>
            </motion.div>
          )}
        </div>
      )}

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard title="Today's Expenses" value={formatCurrency(todayTotal || 8420)}
          subtitle="as of 6:00 PM" trend={{ value:22, label:"vs yesterday" }}
          icon={<DollarSign className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-50" />
        <KPICard title="Month to Date" value={formatCurrency(214560)}
          subtitle="June 2026" trend={{ value:8, label:"vs May" }}
          icon={<TrendingUp className="w-5 h-5 text-[#1B3A5C]" />} iconBg="bg-slate-100" />
        <KPICard title="Pending" value={pending.length}
          subtitle="awaiting" alert={pending.length > 3 ? "warning" : undefined}
          icon={<CheckSquare className="w-5 h-5 text-amber-500" />} iconBg="bg-amber-50"
          onClick={() => toast.info("Navigate to Approvals to review all pending items.")} />
        <KPICard title="Missing Proofs" value={missing.length}
          subtitle="follow-up" alert={missing.length > 0 ? "danger" : undefined}
          icon={<AlertCircle className="w-5 h-5 text-red-500" />} iconBg="bg-red-50"
          onClick={() => toast.info("Navigate to Missing Proofs.")} />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 auto-rows-min">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Daily Expense Trend</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">June 2026 — last 12 days</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">₹ India</span>
          </CardHeader>
          <ExpenseLineChart data={report.dailyTrend} />
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Expense by Category</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">June 2026</p>
            </div>
          </CardHeader>
          <CategoryDonutChart data={report.categoryBreakdown} />
        </Card>
      </div>

      {/* ── Budget ── */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Budget Utilization</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">June 2026 — spend vs. limit</p>
          </div>
          <Link href="/dashboard/budgets"
            className="flex items-center gap-1 text-sm font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors">
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {budgets.map(b => {
            const pct = Math.round((b.currentSpend / b.monthlyLimit) * 100);
            return (
              <div key={b.id}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700">{b.label}</span>
                  <span className={`text-sm font-extrabold ${pct>=100?"text-red-600":pct>=80?"text-amber-600":"text-emerald-600"}`}>{pct}%</span>
                </div>
                <ProgressBar value={b.currentSpend} max={b.monthlyLimit} height="sm" />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[11px] text-slate-600 font-semibold">{formatCurrency(b.currentSpend)}</span>
                  <span className="text-[11px] text-slate-400">of {formatCurrency(b.monthlyLimit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Bottom ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Expenses */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Latest entries across all categories</p>
            </div>
            <Link href="/dashboard/expenses/goods" className="flex items-center gap-1 text-sm font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recent.map(exp => (
              <div key={exp.id} onClick={() => setSel(exp)}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 cursor-pointer transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center shrink-0 transition-colors">
                  {CAT_ICON[exp.category] || <ShoppingCart className="w-4 h-4 text-slate-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{exp.itemDescription}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{exp.vendorName} · {formatDate(exp.date)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-slate-900">{formatCurrency(exp.amount)}</p>
                  <Badge variant={STATUS_VARIANT[exp.status]} className="mt-1" dot>{getStatusLabel(exp.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Awaiting Approval */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <CardTitle>Awaiting Your Approval</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Manager-verified, needs your sign-off</p>
            </div>
            <Link href="/dashboard/approvals" className="flex items-center gap-1 text-sm font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {forOwner.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-8 text-sm text-slate-500">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCheck className="w-4.5 h-4.5 text-emerald-500" style={{width:18,height:18}} />
                </div>
                All caught up — no pending approvals right now.
              </div>
            ) : (
              forOwner.slice(0,5).map(exp => (
                <div key={exp.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{exp.itemDescription}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{exp.vendorName} · <span className="font-semibold text-slate-600">{formatCurrency(exp.amount)}</span></p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setSel(exp)}>Review</Button>
                    <Button variant="success" size="sm" onClick={() => approve(exp)}>Approve</Button>
                  </div>
                </div>
              ))
            )}
          </div>
          {pending.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2 bg-amber-50/60">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">{pending.length} total pending</span>
              <span className="text-xs text-amber-500">across all stages</span>
            </div>
          )}
        </Card>
      </div>

      <ExpenseDetailDrawer expense={sel} open={!!sel} onClose={() => setSel(null)} />
    </div>
  );
}
