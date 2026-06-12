"use client";
import { useState } from "react";
import { AlertCircle, Upload, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ExpenseDetailDrawer from "@/components/expenses/ExpenseDetailDrawer";
import { useDemoStore } from "@/store/demoStore";
import { formatCurrency, formatDate, daysSince } from "@/lib/utils";
import type { Expense } from "@/types";

export default function MissingProofsPage() {
  const { expenses, updateExpenseStatus } = useDemoStore();
  const [selected, setSelected]   = useState<Expense | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const missing = expenses.filter((e) => !e.hasBillProof && !["owner-approved"].includes(e.status));

  const handleUpload = (expense: Expense) => {
    updateExpenseStatus(expense.id, "proof-uploaded", undefined, expense.submittedBy);
    toast.success(`Bill proof uploaded for ${expense.id}. Sent for verification.`);
  };

  const handleBulkReminder = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : missing.length;
    toast.success(`Reminder sent to supervisors for ${count} entries.`);
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Missing Proof Alerts</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            <span className="text-red-700 font-bold">{missing.length}</span> entries without bill proof
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}
          onClick={handleBulkReminder}>
          Send Reminder to Supervisors
        </Button>
      </div>

      {missing.length > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-sm font-semibold text-red-800">
            Month cannot be closed with <span className="font-bold">{missing.length}</span> unverified {missing.length === 1 ? "entry" : "entries"}.
            Upload all bills before month-end.
          </p>
        </div>
      )}

      {missing.length === 0 ? (
        <Card className="py-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-emerald-700">All entries have proof uploaded!</p>
            <p className="text-sm text-slate-400">Month-end reconciliation can proceed.</p>
          </div>
        </Card>
      ) : (
        <Card padding="none">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">Entries without bill proof</p>
            <button
              onClick={() => setSelectedIds(missing.map((m) => m.id))}
              className="text-sm font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors"
            >
              Select All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="w-10 px-5 py-3" />
                  {["Entry Date","Description","Vendor","Amount","Submitted By","Days Pending","Action"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {missing.map((expense) => {
                  const days = daysSince(expense.date);
                  return (
                    <tr key={expense.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(expense.id)}
                          onChange={() => toggleSelect(expense.id)}
                          className="w-4 h-4 rounded accent-[#1B3A5C]"
                        />
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 cursor-pointer" onClick={() => setSelected(expense)}>
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 max-w-[180px] truncate cursor-pointer" onClick={() => setSelected(expense)}>
                        {expense.itemDescription}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{expense.vendorName}</td>
                      <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900">{formatCurrency(expense.amount)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{expense.submittedBy}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={days > 7 ? "danger" : days > 3 ? "warning" : "gray"}>
                          {days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Button size="sm" leftIcon={<Upload className="w-3 h-3" />}
                          onClick={() => handleUpload(expense)}>
                          Upload Bill
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ExpenseDetailDrawer expense={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
