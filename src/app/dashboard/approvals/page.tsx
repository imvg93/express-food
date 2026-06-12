"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ExpenseDetailDrawer from "@/components/expenses/ExpenseDetailDrawer";
import { useDemoStore } from "@/store/demoStore";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import type { Expense, ApprovalStatus } from "@/types";
import { cn } from "@/lib/utils";

const COLUMNS: { key: ApprovalStatus; label: string; color: string; bg: string; border: string }[] = [
  { key: "submitted",        label: "Pending Proof",   color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
  { key: "proof-uploaded",   label: "Proof Uploaded",  color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200"  },
  { key: "manager-verified", label: "Mgr Verified",    color: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200"},
  { key: "owner-approved",   label: "Owner Approved",  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200"},
  { key: "rejected",         label: "Rejected",        color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"   },
];

const statusVariant: Record<ApprovalStatus, "success"|"warning"|"danger"|"info"|"purple"|"gray"> = {
  "owner-approved":"success", submitted:"gray", "proof-uploaded":"info",
  "manager-verified":"purple", rejected:"danger",
};

export default function ApprovalsPage() {
  const { expenses, role, updateExpenseStatus } = useDemoStore();
  const [view, setView] = useState<"board"|"list">("board");
  const [selected, setSelected] = useState<Expense | null>(null);

  const getByStatus = (status: ApprovalStatus) => expenses.filter((e) => e.status === status);

  const handleApprove = (e: Expense) => {
    if (role === "manager" && e.status === "proof-uploaded") {
      updateExpenseStatus(e.id, "manager-verified", undefined, "Narasimha Rao");
      toast.success("Verified and forwarded to owner.");
    } else if (role === "owner" && e.status === "manager-verified") {
      updateExpenseStatus(e.id, "owner-approved", undefined, "Rayudu Gari");
      toast.success("Expense approved.");
    }
  };

  const active    = expenses.filter((e) => !["owner-approved","rejected"].includes(e.status)).length;
  const completed = expenses.filter((e) => e.status === "owner-approved").length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Approval & Proof Management</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            <span className="text-slate-700 font-bold">{active}</span> active &middot; <span className="text-slate-700 font-bold">{completed}</span> completed
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1">
          <button
            onClick={() => setView("board")}
            className={cn("p-2 rounded-lg transition-colors", view === "board" ? "bg-[#1B3A5C] text-white shadow-sm" : "text-slate-500 hover:text-slate-800")}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-2 rounded-lg transition-colors", view === "list" ? "bg-[#1B3A5C] text-white shadow-sm" : "text-slate-500 hover:text-slate-800")}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {view === "board" ? (
        <div className="flex-1 overflow-x-auto p-5 bg-[#EEF1F5]">
          <div className="flex gap-3 h-full" style={{ minWidth: 960 }}>
            {COLUMNS.map((col) => {
              const items = getByStatus(col.key);
              return (
                <div key={col.key} className="flex flex-col flex-1 min-w-[190px]">
                  <div className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 border", col.bg, col.border)}>
                    <span className={cn("text-[11px] font-bold uppercase tracking-wider", col.color)}>{col.label}</span>
                    <span className={cn("text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/80 shadow-sm", col.color)}>{items.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2.5">
                    {items.map((expense) => (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                        className="bg-white border border-slate-200/80 rounded-2xl p-4 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all"
                        style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
                        onClick={() => setSelected(expense)}
                      >
                        <p className="text-sm font-semibold text-slate-800 leading-tight mb-1 line-clamp-2">{expense.itemDescription}</p>
                        <p className="text-xs text-slate-400">{expense.vendorName}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-extrabold text-slate-900">{formatCurrency(expense.amount)}</span>
                          <span className="text-[11px] font-medium text-slate-400">{formatDate(expense.date)}</span>
                        </div>
                        {!expense.hasBillProof && (
                          <p className="text-[11px] font-semibold text-amber-600 mt-2 bg-amber-50 rounded-lg px-2 py-1">No bill uploaded</p>
                        )}
                        {((role === "manager" && expense.status === "proof-uploaded") ||
                          (role === "owner" && expense.status === "manager-verified")) && (
                          <div className="mt-3">
                            <Button
                              variant="success"
                              size="xs"
                              className="w-full justify-center"
                              onClick={(e) => { e.stopPropagation(); handleApprove(expense); }}
                            >
                              {role === "manager" ? "Verify" : "Approve"}
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {items.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-center bg-white/60 rounded-2xl border border-dashed border-slate-200">
                        <CheckCheck className="w-5 h-5 text-slate-300 mb-2" />
                        <p className="text-xs font-medium text-slate-400">No entries</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["ID","Description","Vendor","Amount","Date","Status","Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} onClick={() => setSelected(expense)}
                  className="border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono text-slate-400">{expense.id}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 max-w-[180px] truncate">{expense.itemDescription}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{expense.vendorName}</td>
                  <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900">{formatCurrency(expense.amount)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(expense.date)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant[expense.status]} dot>{getStatusLabel(expense.status)}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {((role === "manager" && expense.status === "proof-uploaded") ||
                      (role === "owner" && expense.status === "manager-verified")) && (
                      <Button
                        variant="success"
                        size="xs"
                        onClick={(e) => { e.stopPropagation(); handleApprove(expense); }}
                      >
                        {role === "manager" ? "Verify" : "Approve"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ExpenseDetailDrawer expense={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
