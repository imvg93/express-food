"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, ShoppingCart, Wrench, Zap, Sparkles, Megaphone, Truck, Wallet, Clock, AlertTriangle } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import ExpenseDetailDrawer from "@/components/expenses/ExpenseDetailDrawer";
import { useDemoStore } from "@/store/demoStore";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import type { Expense, ExpenseCategory } from "@/types";

const STATUS_V: Record<string, "success"|"warning"|"danger"|"info"|"purple"|"gray"> = {
  "owner-approved":"success", submitted:"gray", "proof-uploaded":"info",
  "manager-verified":"purple", rejected:"danger",
};

const QUICK: { label: string; icon: React.ReactNode; category: ExpenseCategory; color: string; bg: string }[] = [
  { label:"Goods",       icon:<ShoppingCart className="w-5 h-5" />, category:"goods",       color:"text-[#1B3A5C]",  bg:"bg-blue-50"   },
  { label:"Maintenance", icon:<Wrench       className="w-5 h-5" />, category:"maintenance", color:"text-amber-600",  bg:"bg-amber-50"  },
  { label:"Utilities",   icon:<Zap          className="w-5 h-5" />, category:"utilities",   color:"text-blue-600",   bg:"bg-blue-50"   },
  { label:"Cleaning",    icon:<Sparkles     className="w-5 h-5" />, category:"cleaning",    color:"text-emerald-600",bg:"bg-emerald-50"},
  { label:"Marketing",   icon:<Megaphone    className="w-5 h-5" />, category:"marketing",   color:"text-purple-600", bg:"bg-purple-50" },
  { label:"Transport",   icon:<Truck        className="w-5 h-5" />, category:"transport",   color:"text-cyan-600",   bg:"bg-cyan-50"   },
  { label:"Petty Cash",  icon:<Wallet       className="w-5 h-5" />, category:"petty-cash",  color:"text-orange-600", bg:"bg-orange-50" },
];

export default function SupervisorDashboard() {
  const { expenses } = useDemoStore();
  const [addModal, setAddModal] = useState<ExpenseCategory | null>(null);
  const [sel, setSel] = useState<Expense | null>(null);

  const mine          = expenses.filter(e => e.submittedById === "u3");
  const todayEntries  = mine.filter(e => e.date === "2026-06-12");
  const pendingUpload = mine.filter(e => !e.hasBillProof && e.status === "submitted");
  const approved      = mine.filter(e => e.status === "owner-approved" && e.date >= "2026-06-06");
  const rejected      = mine.filter(e => e.status === "rejected");

  return (
    <div className="p-6 space-y-5">

      {/* Upload Alert */}
      {pendingUpload.length > 0 && (
        <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600" style={{width:18,height:18}} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">
              {pendingUpload.length} {pendingUpload.length===1?"entry is":"entries are"} missing bill proof
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Upload before 6:00 PM — manager cannot verify without proof</p>
          </div>
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0">
            Upload Now
          </Button>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="My Entries Today" value={todayEntries.length} subtitle="12-Jun-2026"
          icon={<Plus className="w-5 h-5 text-[#1B3A5C]" />} iconBg="bg-slate-100" />
        <KPICard title="Proof Upload Pending" value={pendingUpload.length} subtitle="need bill upload"
          alert={pendingUpload.length > 0 ? "warning" : undefined}
          icon={<Upload className="w-5 h-5 text-amber-500" />} iconBg="bg-amber-50" />
        <KPICard title="Approved This Week" value={approved.length} subtitle="06–12 Jun"
          icon={<ShoppingCart className="w-5 h-5 text-emerald-600" />} iconBg="bg-emerald-50" />
        <KPICard title="Rejected" value={rejected.length} subtitle="this month"
          alert={rejected.length > 0 ? "danger" : undefined}
          icon={<Clock className="w-5 h-5 text-red-500" />} iconBg="bg-red-50" />
      </div>

      {/* Quick Add */}
      <Card>
        <CardHeader>
          <div><CardTitle>Quick Add Expense</CardTitle><p className="text-xs text-slate-400 mt-0.5">Click any category to open the entry form</p></div>
        </CardHeader>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {QUICK.map(a => (
            <motion.button key={a.category} whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }}
              onClick={() => setAddModal(a.category)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md bg-white transition-all">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${a.bg}`}>
                <span className={a.color}>{a.icon}</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* My Recent Entries */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100">
          <CardTitle>My Recent Entries</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Click any entry to view details or upload proof</p>
        </div>
        <div className="divide-y divide-slate-50">
          {mine.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-semibold text-slate-400">No entries yet</p>
              <p className="text-xs text-slate-300 mt-1">Use the quick add buttons above</p>
            </div>
          ) : (
            mine.slice(0,8).map(exp => (
              <div key={exp.id} onClick={() => setSel(exp)}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 cursor-pointer transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{exp.itemDescription}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{exp.vendorName} · {formatDate(exp.date)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-sm font-extrabold text-slate-900">{formatCurrency(exp.amount)}</p>
                  <Badge variant={STATUS_V[exp.status]} dot>{getStatusLabel(exp.status)}</Badge>
                  {!exp.hasBillProof && exp.status === "submitted" && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                      Upload Bill
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {addModal && (
        <AddExpenseModal open={!!addModal} onClose={() => setAddModal(null)}
          category={addModal} categoryLabel={QUICK.find(a => a.category === addModal)?.label || ""} />
      )}
      <ExpenseDetailDrawer expense={sel} open={!!sel} onClose={() => setSel(null)} />
    </div>
  );
}
