"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckSquare, Building2, TrendingUp, ArrowRight, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import KPICard from "@/components/dashboard/KPICard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import ExpenseDetailDrawer from "@/components/expenses/ExpenseDetailDrawer";
import { useDemoStore } from "@/store/demoStore";
import { MONTHLY_COMPARISON } from "@/data/reports";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import type { Expense } from "@/types";

const STATUS_V: Record<string, "success"|"warning"|"danger"|"info"|"purple"|"gray"> = {
  "owner-approved":"success", submitted:"gray", "proof-uploaded":"info",
  "manager-verified":"purple", rejected:"danger",
};

export default function ManagerDashboard() {
  const { expenses, updateExpenseStatus } = useDemoStore();
  const [sel, setSel] = useState<Expense | null>(null);

  const pendingVerification = expenses.filter(e => e.status === "proof-uploaded");
  const verified            = expenses.filter(e => e.status === "manager-verified" || e.status === "owner-approved");
  const weekTotal           = expenses.reduce((s,e) => e.date >= "2026-06-06" ? s + e.amount : s, 0);

  const handleVerify = (exp: Expense) => {
    updateExpenseStatus(exp.id, "manager-verified", undefined, "Narasimha Rao");
    toast.success(exp.itemDescription + " — verified and sent to owner.");
  };

  return (
    <div className="p-6 space-y-5">

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Pending Verification" value={pendingVerification.length}
          subtitle="awaiting your review" alert={pendingVerification.length > 0 ? "warning" : undefined}
          icon={<CheckSquare className="w-5 h-5 text-amber-500" />} iconBg="bg-amber-50" />
        <KPICard title="Verified This Month" value={verified.length}
          subtitle="June 2026" icon={<CheckCheck className="w-5 h-5 text-emerald-600" style={{width:20,height:20}} />} iconBg="bg-emerald-50" />
        <KPICard title="This Week Expenses" value={formatCurrency(weekTotal)}
          subtitle="06–12 Jun 2026" icon={<TrendingUp className="w-5 h-5 text-blue-500" />} iconBg="bg-blue-50" />
        <KPICard title="Active Vendors" value={8}
          subtitle="with transactions" icon={<Building2 className="w-5 h-5 text-purple-500" />} iconBg="bg-purple-50" />
      </div>

      {/* Charts + Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3">
          <CardHeader>
            <div><CardTitle>Category Trend — 6 Months</CardTitle><p className="text-xs text-slate-400 mt-0.5">Jan–Jun 2026</p></div>
          </CardHeader>
          <MonthlyBarChart data={MONTHLY_COMPARISON} simplified />
        </Card>

        <Card className="xl:col-span-2" padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <CardTitle>Verification Queue</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Entries with bill proof uploaded</p>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingVerification.length === 0 ? (
              <div className="px-5 py-10 flex flex-col items-center gap-2 text-sm text-slate-400">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-1">
                  <CheckCheck className="w-5 h-5 text-emerald-500" />
                </div>
                Queue empty — all verified!
              </div>
            ) : (
              pendingVerification.slice(0,5).map(exp => (
                <div key={exp.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{exp.itemDescription}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{exp.vendorName} · {formatCurrency(exp.amount)} · {formatDate(exp.date)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setSel(exp)}>Review</Button>
                    <Button size="sm" onClick={() => handleVerify(exp)}>Verify</Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <Link href="/dashboard/approvals" className="flex items-center gap-1 text-sm font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors">
              View All Approvals <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* All Recent */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div><CardTitle>All Recent Expense Entries</CardTitle><p className="text-xs text-slate-400 mt-0.5">Click any row to review details</p></div>
          <Link href="/dashboard/expenses/goods" className="flex items-center gap-1 text-sm font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors">
            Goods Module <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["ID","Description","Vendor","Amount","Date","Submitted By","Status"].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.slice(0,8).map(e => (
                <tr key={e.id} onClick={() => setSel(e)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                  <td className="px-5 py-3.5 text-xs font-mono text-slate-400">{e.id}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 max-w-[200px] truncate">{e.itemDescription}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{e.vendorName}</td>
                  <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900">{formatCurrency(e.amount)}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(e.date)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{e.submittedBy}</td>
                  <td className="px-5 py-3.5"><Badge variant={STATUS_V[e.status]} dot>{getStatusLabel(e.status)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ExpenseDetailDrawer expense={sel} open={!!sel} onClose={() => setSel(null)} />
    </div>
  );
}
