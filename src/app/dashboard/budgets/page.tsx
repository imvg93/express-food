"use client";
import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import { useDemoStore } from "@/store/demoStore";
import { MONTHLY_COMPARISON } from "@/data/reports";
import { formatCurrency, getBudgetTextColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function BudgetsPage() {
  const { budgets, updateBudgetLimit } = useDemoStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const totalBudget = budgets.reduce((s, b) => s + b.monthlyLimit, 0);
  const totalSpend  = budgets.reduce((s, b) => s + b.currentSpend, 0);
  const overallPct  = Math.round((totalSpend / totalBudget) * 100);

  const handleSave = (id: string) => {
    const val = Number(editVal);
    if (!val || val < 1000) { toast.error("Enter a valid budget amount (min ₹1,000)."); return; }
    updateBudgetLimit(id, val);
    toast.success("Budget limit updated.");
    setEditing(null);
    setEditVal("");
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Budget Limits</h1>
        <p className="text-sm text-slate-400 font-medium mt-0.5">
          <span className="text-slate-700 font-extrabold">{formatCurrency(totalSpend)}</span> spent of{" "}
          <span className="text-slate-700 font-bold">{formatCurrency(totalBudget)}</span> total budget —{" "}
          <span className={cn("font-extrabold", overallPct >= 100 ? "text-red-600" : overallPct >= 80 ? "text-amber-600" : "text-emerald-600")}>{overallPct}%</span>
        </p>
      </div>

      {/* Over-budget alert */}
      {budgets.some((b) => b.currentSpend >= b.monthlyLimit) && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <X className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-sm font-semibold text-red-800">
            One or more categories have exceeded their monthly limit — review and adjust.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {budgets.map((budget, i) => {
          const pct = Math.min(100, Math.round((budget.currentSpend / budget.monthlyLimit) * 100));
          const isEditing = editing === budget.id;
          return (
            <motion.div key={budget.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}>
              <div className={cn(
                "bg-white rounded-2xl border p-5 shadow-[0_1px_4px_rgba(15,23,42,0.06)]",
                pct >= 100 ? "border-red-200 bg-gradient-to-br from-red-50/60 via-white to-white"
                : pct >= 80  ? "border-amber-200 bg-gradient-to-br from-amber-50/60 via-white to-white"
                : "border-slate-200/80"
              )}>
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{budget.label}</p>
                    <p className={cn("text-xs font-bold mt-0.5", getBudgetTextColor(pct))}>
                      {pct >= 100 ? "Budget Exceeded" : pct >= 80 ? "Approaching Limit" : "On Track"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <Button variant="ghost" size="xs" onClick={() => setEditing(null)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="xs"
                        onClick={() => { setEditing(budget.id); setEditVal(String(budget.monthlyLimit)); }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                <ProgressBar value={budget.currentSpend} max={budget.monthlyLimit} showPercent height="md" />

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-sm font-extrabold text-slate-900">{formatCurrency(budget.currentSpend)}</span>
                    <span className="text-sm text-slate-400 font-medium"> spent</span>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-500">₹</span>
                      <input
                        type="number"
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        className="w-28 h-8 px-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 font-semibold"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleSave(budget.id)}
                      />
                      <Button size="xs" onClick={() => handleSave(budget.id)}>
                        <Save className="w-3 h-3 mr-1" /> Save
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500 font-medium">
                      Limit: <span className="font-bold text-slate-700">{formatCurrency(budget.monthlyLimit)}</span>
                    </span>
                  )}
                </div>

                {pct >= 80 && (
                  <p className="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-100">
                    Alert at {budget.alertThreshold}% — {formatCurrency(budget.monthlyLimit * (budget.alertThreshold / 100))}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div><CardTitle>6-Month Spending Trend</CardTitle><p className="text-xs text-slate-400 mt-0.5">Category comparison Jan–Jun 2026</p></div>
        </CardHeader>
        <MonthlyBarChart data={MONTHLY_COMPARISON} simplified />
      </Card>
    </div>
  );
}
