"use client";
import { useState } from "react";
import { Search, ArrowUpDown, Download, Plus, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import type { Expense, ApprovalStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusVariant: Record<ApprovalStatus, "success" | "warning" | "danger" | "info" | "purple" | "gray"> = {
  "owner-approved": "success",
  submitted: "gray",
  "proof-uploaded": "info",
  "manager-verified": "purple",
  rejected: "danger",
};

const PAGE_SIZE = 8;

interface Props {
  expenses: Expense[];
  onRowClick: (expense: Expense) => void;
  onAdd: () => void;
  title: string;
  totalThisMonth?: number;
}

export default function ExpenseTable({ expenses, onRowClick, onAdd, title, totalThisMonth }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);

  const filtered = expenses
    .filter((e) => {
      const q = search.toLowerCase();
      return (
        (statusFilter === "all" || e.status === statusFilter) &&
        (!q || e.itemDescription.toLowerCase().includes(q) || e.vendorName.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const mul = sortDir === "desc" ? -1 : 1;
      if (sortField === "date") return mul * (a.date > b.date ? 1 : -1);
      return mul * (a.amount - b.amount);
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-white">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {totalThisMonth !== undefined && (
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              <span className="text-slate-700 font-extrabold">{formatCurrency(totalThisMonth)}</span> spent this month &middot; {expenses.length} entries
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => toast.success("Report exported as CSV.")}>
            Export
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={onAdd}>
            Add Entry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 flex items-center gap-3 border-b border-slate-100 shrink-0 flex-wrap bg-white">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search entries..."
            className="pl-8 pr-3 h-8 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/50 w-52 text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-8 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-medium"
        >
          <option value="all">All Status</option>
          <option value="submitted">Pending Proof</option>
          <option value="proof-uploaded">Awaiting Manager</option>
          <option value="manager-verified">Awaiting Owner</option>
          <option value="owner-approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <span className="text-sm font-medium text-slate-400">{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        {paginated.length === 0 ? (
          <EmptyState
            title="No entries found"
            description={search ? "Try different search terms or clear filters." : "Add your first expense entry."}
            action={{ label: "Add Entry", onClick: onAdd }}
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {[
                  { label: "Date", field: "date" as const },
                  { label: "Description", field: null },
                  { label: "Vendor", field: null },
                  { label: "Amount", field: "amount" as const },
                  { label: "Mode", field: null },
                  { label: "Status", field: null },
                  { label: "", field: null },
                ].map(({ label, field }, i) => (
                  <th
                    key={i}
                    onClick={field ? () => toggleSort(field) : undefined}
                    className={cn(
                      "text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3",
                      field && "cursor-pointer hover:text-slate-600 select-none"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {field && <ArrowUpDown className="w-3 h-3" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((expense) => (
                <tr
                  key={expense.id}
                  onClick={() => onRowClick(expense)}
                  className="border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-5 py-3.5 max-w-[200px]">
                    <p className="text-sm font-semibold text-slate-800 truncate">{expense.itemDescription}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{expense.id}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{expense.vendorName}</td>
                  <td className="px-5 py-3.5 text-sm font-extrabold text-slate-900 whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{expense.paymentMode}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <Badge variant={statusVariant[expense.status]} dot>
                      {getStatusLabel(expense.status)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => { e.stopPropagation(); onRowClick(expense); }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <p className="text-sm font-medium text-slate-400">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-slate-100 transition-colors text-slate-500"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={cn(
                  "w-7 h-7 text-xs font-semibold rounded-lg transition-colors",
                  page === i + 1 ? "bg-[#1B3A5C] text-white" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-slate-100 transition-colors text-slate-500"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
