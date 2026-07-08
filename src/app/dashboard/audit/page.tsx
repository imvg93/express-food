"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, FilePlus2, Pencil, Wallet, ShieldCheck, FileCheck2,
  GitCommitVertical, History,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useDemoStore } from "@/store/demoStore";
import { formatDateTime } from "@/lib/utils";
import type { AuditAction, AuditEntry } from "@/types";

const ACTION_META: Record<AuditAction, { label: string; icon: React.ElementType; variant: "success" | "warning" | "danger" | "info" | "purple" | "gray" }> = {
  "expense-created": { label: "Created", icon: FilePlus2, variant: "info" },
  "expense-updated": { label: "Updated", icon: Pencil, variant: "gray" },
  "payment-added": { label: "Payment", icon: Wallet, variant: "success" },
  "payment-edited": { label: "Payment Edited", icon: Pencil, variant: "warning" },
  "payment-deleted": { label: "Payment Deleted", icon: Pencil, variant: "danger" },
  "proof-uploaded": { label: "Proof", icon: ShieldCheck, variant: "purple" },
  "bill-uploaded": { label: "Bill", icon: FileCheck2, variant: "info" },
  "status-changed": { label: "Status", icon: GitCommitVertical, variant: "gray" },
};

export default function AuditTrailPage() {
  const { auditLog } = useDemoStore();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = auditLog.filter((a) => {
    const q = search.toLowerCase();
    return (
      (actionFilter === "all" || a.action === actionFilter) &&
      (!q ||
        a.expenseLabel.toLowerCase().includes(q) ||
        a.expenseId.toLowerCase().includes(q) ||
        a.user.toLowerCase().includes(q) ||
        a.label.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
          <History className="w-5 h-5 text-[#1B3A5C]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            <span className="text-slate-700 font-bold">{auditLog.length}</span> activity records · every expense & payment action logged
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by expense, user, action..."
            className="pl-8 pr-3 h-9 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/50 w-64 text-slate-800 placeholder-slate-400 transition-all font-medium"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-semibold"
        >
          <option value="all">All Activity</option>
          <option value="expense-created">Created</option>
          <option value="status-changed">Status Changed</option>
          <option value="payment-added">Payment Added</option>
          <option value="proof-uploaded">Proof Uploaded</option>
          <option value="bill-uploaded">Bill Uploaded</option>
        </select>
        <span className="text-sm font-medium text-slate-400">{filtered.length} records</span>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/80" style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">No activity matches your filters.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((entry, i) => (
              <AuditRow key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AuditRow({ entry, index }: { entry: AuditEntry; index: number }) {
  const meta = ACTION_META[entry.action];
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
      className="flex items-start gap-4 px-5 py-4"
    >
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={meta.variant}>{meta.label}</Badge>
          <p className="text-sm font-semibold text-slate-800">{entry.label}</p>
        </div>
        <p className="text-xs text-slate-400 font-medium mt-1">
          {entry.expenseLabel} · <span className="font-mono">{entry.expenseId}</span>
        </p>
        {(entry.previousValue || entry.newValue) && (
          <p className="text-xs text-slate-500 mt-1">
            {entry.previousValue && <span className="line-through text-slate-400">{entry.previousValue}</span>}
            {entry.previousValue && entry.newValue && <span className="mx-1 text-slate-300">→</span>}
            {entry.newValue && <span className="font-semibold text-slate-700">{entry.newValue}</span>}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-semibold text-slate-700">{entry.user}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{formatDateTime(entry.timestamp)}</p>
      </div>
    </motion.div>
  );
}
