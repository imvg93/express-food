"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, Download, Plus, Eye, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDate, getStatusLabel, getPaymentStatusLabel, paymentStatusVariant } from "@/lib/utils";
import { isOverdue, remainingAmount, hasBill } from "@/lib/payables";
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
  const [payFilter, setPayFilter] = useState("all");
  const [docFilter, setDocFilter] = useState("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);

  const filtered = expenses
    .filter((e) => {
      const q = search.toLowerCase();
      const payMatch =
        payFilter === "all" ||
        (payFilter === "overdue" ? isOverdue(e) : e.paymentStatus === payFilter);
      const docMatch =
        docFilter === "all" ||
        (docFilter === "bill" && hasBill(e)) ||
        (docFilter === "no-bill" && !hasBill(e)) ||
        (docFilter === "proof" && e.payments.some((p) => p.hasProof));
      return (
        (statusFilter === "all" || e.status === statusFilter) &&
        payMatch &&
        docMatch &&
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
      {/* Header - Responsive */}
      <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between shrink-0 bg-white">
        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-slate-900">{title}</h1>
          {totalThisMonth !== undefined && (
            <p className="text-xs md:text-sm text-slate-400 mt-1 font-medium hidden md:block">
              <span className="text-slate-700 font-extrabold">{formatCurrency(totalThisMonth)}</span> spent this month &middot; {expenses.length} entries
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => toast.success("Report exported as CSV.")}
            className="hidden md:inline-flex">
            Export
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={onAdd} className="flex-1 md:flex-none">
            Add Entry
          </Button>
        </div>
      </div>

      {/* Filters - Responsive */}
      <div className="px-4 md:px-6 py-3 flex items-center gap-2 md:gap-3 border-b border-slate-100 shrink-0 flex-wrap bg-white">
        <div className="relative flex-1 md:flex-none w-full md:w-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="w-full md:w-52 h-9 md:h-8 pl-8 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/50 text-slate-800 placeholder-slate-400 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-9 md:h-8 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-medium flex-1 md:flex-none"
        >
          <option value="all">All Status</option>
          <option value="submitted">Pending Proof</option>
          <option value="proof-uploaded">Awaiting Manager</option>
          <option value="manager-verified">Awaiting Owner</option>
          <option value="owner-approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={payFilter}
          onChange={(e) => { setPayFilter(e.target.value); setPage(1); }}
          className="h-9 md:h-8 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-medium flex-1 md:flex-none"
        >
          <option value="all">All Payments</option>
          <option value="unpaid">Unpaid</option>
          <option value="partially-paid">Partially Paid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={docFilter}
          onChange={(e) => { setDocFilter(e.target.value); setPage(1); }}
          className="h-9 md:h-8 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-medium flex-1 md:flex-none"
        >
          <option value="all">All Documents</option>
          <option value="bill">Bill Available</option>
          <option value="no-bill">No Bill</option>
          <option value="proof">Payment Proof</option>
        </select>
        <span className="text-sm font-medium text-slate-400">{filtered.length} records</span>
      </div>

      {/* Content - Responsive */}
      <div className="flex-1 overflow-auto bg-white">
        {paginated.length === 0 ? (
          <EmptyState
            title="No entries found"
            description={search ? "Try different search terms or clear filters." : "Add your first expense entry."}
            action={{ label: "Add Entry", onClick: onAdd }}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {[
                      { label: "Date", field: "date" as const },
                      { label: "Description", field: null },
                      { label: "Vendor", field: null },
                      { label: "Amount", field: "amount" as const },
                      { label: "Payment", field: null },
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
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant={paymentStatusVariant(expense.paymentStatus)} dot>
                          {getPaymentStatusLabel(expense.paymentStatus)}
                        </Badge>
                        {isOverdue(expense) ? (
                          <p className="text-[10px] font-bold text-red-500 mt-1">Overdue · {formatCurrency(remainingAmount(expense))}</p>
                        ) : remainingAmount(expense) > 0 ? (
                          <p className="text-[10px] font-semibold text-slate-400 mt-1">{formatCurrency(remainingAmount(expense))} due</p>
                        ) : null}
                      </td>
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
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-3 space-y-2">
              {paginated.map((expense, i) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onRowClick(expense)}
                  className="card-hover bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-2xl p-4 active:scale-98"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{expense.itemDescription}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{expense.id}</p>
                    </div>
                    <Badge variant={statusVariant[expense.status]} dot>
                      {getStatusLabel(expense.status)}
                    </Badge>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-2 mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Vendor</span>
                      <span className="font-semibold text-slate-800">{expense.vendorName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Date</span>
                      <span className="font-semibold text-slate-800">{formatDate(expense.date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Payment</span>
                      <Badge variant={paymentStatusVariant(expense.paymentStatus)} dot>
                        {getPaymentStatusLabel(expense.paymentStatus)}
                      </Badge>
                    </div>
                    {remainingAmount(expense) > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Balance</span>
                        <span className={cn("font-bold", isOverdue(expense) ? "text-red-600" : "text-slate-800")}>
                          {formatCurrency(remainingAmount(expense))}{isOverdue(expense) ? " · Overdue" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatCurrency(expense.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => { e.stopPropagation(); onRowClick(expense); }}
                      className="text-[#1B3A5C]"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <div className="px-4 md:px-5 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white gap-3 flex-wrap md:flex-nowrap">
          <p className="text-xs md:text-sm font-medium text-slate-400">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-slate-100 transition-colors text-slate-500"
            >
              <ChevronLeft className="w-4 h-4 md:w-3.5 md:h-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "w-8 h-8 md:w-7 md:h-7 text-xs font-semibold rounded-lg transition-colors",
                    page === pageNum ? "bg-[#1B3A5C] text-white" : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-slate-100 transition-colors text-slate-500"
            >
              <ChevronRight className="w-4 h-4 md:w-3.5 md:h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
