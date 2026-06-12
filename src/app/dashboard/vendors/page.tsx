"use client";
import { useState } from "react";
import { Search, Phone, MapPin, Flag } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { VENDORS } from "@/data/vendors";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { Vendor } from "@/types";

export default function VendorsPage() {
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [selected, setSelected]   = useState<Vendor | null>(null);

  const filtered = VENDORS.filter((v) => {
    const q = search.toLowerCase();
    return (
      (catFilter === "all" || v.category === catFilter) &&
      (!q || v.name.toLowerCase().includes(q) || v.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vendor History</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            <span className="text-slate-700 font-bold">{VENDORS.length}</span> vendors · payment history and rate tracking
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
            placeholder="Search vendors..."
            className="pl-8 pr-3 h-9 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/50 w-52 text-slate-800 placeholder-slate-400 transition-all font-medium"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-semibold"
        >
          <option value="all">All Categories</option>
          <option value="goods">Goods</option>
          <option value="maintenance">Maintenance</option>
          <option value="utilities">Utilities</option>
          <option value="marketing">Marketing</option>
          <option value="transport">Transport</option>
        </select>
        <span className="text-sm font-medium text-slate-400">{filtered.length} vendors</span>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vendor, i) => (
          <motion.div key={vendor.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.04 }}>
            <div
              onClick={() => setSelected(vendor)}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all"
              style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1B3A5C] to-[#243F6B] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                  {vendor.name.charAt(0)}
                </div>
                <Badge variant={vendor.isActive ? "success" : "gray"} dot>
                  {vendor.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-800">{vendor.name}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{CATEGORY_LABELS[vendor.category]}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> {vendor.location}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Paid</p>
                  <p className="text-sm font-extrabold text-[#1B3A5C] mt-0.5">{formatCurrency(vendor.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transactions</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{vendor.transactionCount}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-2">Last paid: {formatDate(vendor.lastPaymentDate)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vendor Detail Modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected.name} size="xl"
          footer={
            <>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              <Button variant="danger" size="sm" leftIcon={<Flag className="w-3.5 h-3.5" />}
                onClick={() => { toast.success(`${selected.name} flagged for review.`); setSelected(null); }}>
                Flag for Review
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:"Total Paid",       value: formatCurrency(selected.totalPaid)         },
                { label:"Transactions",     value: String(selected.transactionCount)           },
                { label:"Avg Transaction",  value: formatCurrency(selected.avgTransactionValue)},
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {selected.phone && (
                <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium">{selected.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">{selected.location}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 mb-3">Monthly Payment History</p>
              <div className="space-y-2.5">
                {selected.paymentHistory.map((p) => (
                  <div key={p.month} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 w-16 shrink-0">{p.month}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#1B3A5C] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (p.amount / (selected.totalPaid / 3)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-20 text-right shrink-0">
                      {p.amount > 0 ? formatCurrency(p.amount) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
