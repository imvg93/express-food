"use client";
import { useState } from "react";
import { Plus, Download, RefreshCw, Wallet } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input, { Select } from "@/components/ui/Input";
import { PETTY_CASH_ENTRIES } from "@/data/expenses";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PETTY_CASH_SUB_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const OPENING_BALANCE = 5000;

export default function PettyCashPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [reconcileOpen, setReconcileOpen] = useState(false);
  const [entries, setEntries] = useState(PETTY_CASH_ENTRIES);
  const [form, setForm] = useState({ description:"", subCategory:"", amount:"" });

  const handleAdd = () => {
    if (!form.description || !form.amount) { toast.error("Fill in required fields."); return; }
    const newEntry = {
      id: "PC-" + String(entries.length + 1).padStart(3, "0"),
      date: "2026-06-12",
      description: form.description,
      subCategory: form.subCategory || "Miscellaneous",
      amount: Number(form.amount),
      submittedBy: "Venkat Reddy",
      receiptAvailable: false,
    };
    setEntries((prev) => [newEntry, ...prev]);
    toast.success("Petty cash entry added.");
    setForm({ description:"", subCategory:"", amount:"" });
    setAddOpen(false);
  };

  const newTotal   = entries.reduce((s, e) => s + e.amount, 0);
  const newBalance = OPENING_BALANCE - newTotal;

  const summaryCards = [
    { label:"Opening Balance", value:formatCurrency(OPENING_BALANCE), sub:"01-Jun-2026", valueClass:"text-slate-900", bg:"bg-slate-100" },
    { label:"Total Disbursed",  value:formatCurrency(newTotal),        sub:`${entries.length} entries`,  valueClass:"text-red-700",   bg:"bg-red-50"   },
    { label:"Current Balance",  value:formatCurrency(newBalance),      sub:"Available cash", valueClass: newBalance < 500 ? "text-red-700" : "text-emerald-700", bg: newBalance < 500 ? "bg-red-50" : "bg-emerald-50" },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Petty Cash Register</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Daily cash expenses — June 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => setReconcileOpen(true)}>
            Reconcile
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddOpen(true)}>
            Add Entry
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">{item.label}</p>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                  <Wallet className="w-4 h-4 text-slate-600" />
                </div>
              </div>
              <p className={cn("text-[28px] font-extrabold tracking-tight leading-none", item.valueClass)}>{item.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-1.5">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Entries table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <CardTitle>Cash Entries — June 2026</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">{entries.length} entries · {entries.filter((e) => e.receiptAvailable).length} with receipts</p>
          </div>
          <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => toast.success("Petty cash report exported.")}>
            Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Date","Description","Category","Amount","Submitted By","Receipt"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(entry.date)}</td>
                  <td className="px-5 py-3.5 max-w-[200px]">
                    <p className="text-sm font-semibold text-slate-800 truncate">{entry.description}</p>
                    {entry.note && <p className="text-xs text-amber-600 italic mt-0.5">{entry.note}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{entry.subCategory}</td>
                  <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900">{formatCurrency(entry.amount)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{entry.submittedBy}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={entry.receiptAvailable ? "success" : "warning"} dot>
                      {entry.receiptAvailable ? "Available" : "Not collected"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
          <p className="text-sm font-medium text-slate-500">{entries.length} entries</p>
          <p className="text-sm font-extrabold text-slate-900">Total: {formatCurrency(newTotal)}</p>
        </div>
      </Card>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Petty Cash Entry" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save Entry</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Description *" placeholder="What was the expense for?" value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Select label="Category" options={PETTY_CASH_SUB_CATEGORIES.map((s) => ({ value: s, label: s }))}
            placeholder="Select category" value={form.subCategory}
            onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))} />
          <Input label="Amount (₹) *" type="number" placeholder="0" value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
        </div>
      </Modal>

      {/* Reconcile Modal */}
      <Modal open={reconcileOpen} onClose={() => setReconcileOpen(false)} title="Monthly Reconciliation" size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setReconcileOpen(false)}>Close</Button>
            <Button onClick={() => { toast.success("Month reconciled successfully."); setReconcileOpen(false); }}>
              Confirm Reconciliation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
            {[
              ["Opening Balance",         formatCurrency(OPENING_BALANCE),                                         "text-slate-900"],
              ["Total Disbursed",         formatCurrency(newTotal),                                                 "text-red-700"  ],
              ["Expected Closing",        formatCurrency(newBalance),                                               "text-emerald-700"],
              ["Entries without receipt", `${entries.filter((e) => !e.receiptAvailable).length} entries`,          "text-amber-700"],
            ].map(([k, v, cls]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500 font-medium">{k}</span>
                <span className={`text-sm font-bold ${cls}`}>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400 text-center">
            {entries.filter((e) => !e.receiptAvailable).length > 0
              ? "Some entries are missing receipts — reconciliation will flag these."
              : "All entries have receipts. Safe to reconcile."}
          </p>
        </div>
      </Modal>
    </div>
  );
}
