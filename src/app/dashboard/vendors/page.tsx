"use client";
import { useState, useMemo } from "react";
import {
  Search, Phone, Mail, MapPin, Flag, Plus, Building2, CreditCard,
  AlertTriangle, CalendarClock, Landmark, Hash, Percent, ChevronRight,
  Image as ImageIcon, Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input, { Select as UiSelect, Textarea } from "@/components/ui/Input";
import ExpenseDetailDrawer from "@/components/expenses/ExpenseDetailDrawer";
import { VENDORS } from "@/data/vendors";
import { useDemoStore } from "@/store/demoStore";
import { formatCurrency, formatDate, getPaymentStatusLabel, paymentStatusVariant, cn } from "@/lib/utils";
import { getVendorOutstanding, isOverdue, remainingAmount, hasBill } from "@/lib/payables";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { Vendor, Expense } from "@/types";

export default function VendorsPage() {
  const { expenses } = useDemoStore();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Vendor | null>(null);
  const [selExpId, setSelExpId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Per-vendor outstanding, computed live from expenses.
  const outstandingById = useMemo(() => {
    const map: Record<string, ReturnType<typeof getVendorOutstanding>> = {};
    for (const v of VENDORS) map[v.id] = getVendorOutstanding(v.id, expenses);
    return map;
  }, [expenses]);

  const portfolio = useMemo(() => {
    const vals = Object.values(outstandingById);
    return {
      payable: vals.reduce((s, o) => s + o.totalPending, 0),
      overdue: vals.reduce((s, o) => s + o.overdueAmount, 0),
      upcoming: vals.reduce((s, o) => s + o.upcomingDue, 0),
      vendorsWithDues: vals.filter((o) => o.totalPending > 0).length,
    };
  }, [outstandingById]);

  const filtered = VENDORS.filter((v) => {
    const q = search.toLowerCase();
    const o = outstandingById[v.id];
    return (
      (catFilter === "all" || v.category === catFilter) &&
      (statusFilter === "all" ||
        (statusFilter === "dues" && o.totalPending > 0) ||
        (statusFilter === "overdue" && o.overdueAmount > 0) ||
        (statusFilter === "clear" && o.totalPending === 0)) &&
      (!q || v.name.toLowerCase().includes(q) || v.location.toLowerCase().includes(q) || (v.vendorCode ?? "").toLowerCase().includes(q))
    );
  });

  const selOut = selected ? outstandingById[selected.id] : null;
  const selLedger = selected
    ? expenses.filter((e) => e.vendorId === selected.id).sort((a, b) => (a.date < b.date ? 1 : -1))
    : [];
  const selExpense = selExpId ? expenses.find((e) => e.id === selExpId) ?? null : null;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vendor Management</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            <span className="text-slate-700 font-bold">{VENDORS.length}</span> vendors · outstanding payables & ledger
          </p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddOpen(true)}>
          Add Vendor
        </Button>
      </div>

      {/* Outstanding dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Payable", value: formatCurrency(portfolio.payable), icon: CreditCard, tone: "text-[#1B3A5C]", bg: "bg-blue-50" },
          { label: "Overdue", value: formatCurrency(portfolio.overdue), icon: AlertTriangle, tone: "text-red-600", bg: "bg-red-50" },
          { label: "Due in 7 Days", value: formatCurrency(portfolio.upcoming), icon: CalendarClock, tone: "text-amber-600", bg: "bg-amber-50" },
          { label: "Vendors with Dues", value: String(portfolio.vendorsWithDues), icon: Building2, tone: "text-slate-800", bg: "bg-slate-100" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-200/80 p-4" style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${k.tone}`} />
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{k.label}</p>
              <p className={`text-lg font-extrabold mt-0.5 ${k.tone}`}>{k.value}</p>
            </div>
          );
        })}
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer font-semibold"
        >
          <option value="all">All Vendors</option>
          <option value="dues">With Dues</option>
          <option value="overdue">Overdue</option>
          <option value="clear">Fully Settled</option>
        </select>
        <span className="text-sm font-medium text-slate-400">{filtered.length} vendors</span>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vendor, i) => {
          const o = outstandingById[vendor.id];
          return (
            <motion.div key={vendor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div
                onClick={() => setSelected(vendor)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all"
                style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1B3A5C] to-[#243F6B] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                    {vendor.name.charAt(0)}
                  </div>
                  {o.overdueAmount > 0 ? (
                    <Badge variant="danger" dot>Overdue</Badge>
                  ) : o.totalPending > 0 ? (
                    <Badge variant="warning" dot>Dues</Badge>
                  ) : (
                    <Badge variant="success" dot>Settled</Badge>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-800">{vendor.name}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{vendor.vendorCode} · {CATEGORY_LABELS[vendor.category]}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {vendor.location}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
                    <p className={`text-sm font-extrabold mt-0.5 ${o.totalPending > 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {formatCurrency(o.totalPending)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Paid</p>
                    <p className="text-sm font-extrabold text-[#1B3A5C] mt-0.5">{formatCurrency(vendor.totalPaid)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-2">
                  {o.pendingBills} pending bill{o.pendingBills === 1 ? "" : "s"} · Last paid {formatDate(vendor.lastPaymentDate)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Vendor Detail Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        subtitle={selected ? `${selected.vendorCode} · ${CATEGORY_LABELS[selected.category]}` : ""}
        width="560px"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            <Button variant="danger" size="sm" leftIcon={<Flag className="w-3.5 h-3.5" />}
              onClick={() => { toast.success(`${selected?.name} flagged for review.`); setSelected(null); }}>
              Flag for Review
            </Button>
          </>
        }
      >
        {selected && selOut && (
          <div className="divide-y divide-slate-100">
            {/* Outstanding summary */}
            <div className="px-5 py-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Outstanding Summary</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Purchased", value: formatCurrency(selOut.totalPurchase), tone: "text-slate-900" },
                  { label: "Paid", value: formatCurrency(selOut.totalPaid), tone: "text-emerald-600" },
                  { label: "Pending", value: formatCurrency(selOut.totalPending), tone: "text-red-600" },
                ].map((m) => (
                  <div key={m.label} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
                    <p className={`text-base font-extrabold mt-1 ${m.tone}`}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <InfoRow label="Overdue Amount" value={formatCurrency(selOut.overdueAmount)} danger={selOut.overdueAmount > 0} />
                <InfoRow label="Due in 7 Days" value={formatCurrency(selOut.upcomingDue)} />
                <InfoRow label="Pending Bills" value={String(selOut.pendingBills)} />
                <InfoRow
                  label="Last Payment"
                  value={selOut.lastPaymentDate ? `${formatCurrency(selOut.lastPaymentAmount ?? 0)} · ${formatDate(selOut.lastPaymentDate)}` : "—"}
                />
              </div>
            </div>

            {/* Vendor info */}
            <div className="px-5 py-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Vendor Details</p>
              <div className="space-y-2">
                <DetailRow icon={Phone} label="Phone" value={selected.phone} />
                {selected.email && <DetailRow icon={Mail} label="Email" value={selected.email} />}
                {selected.contactPerson && <DetailRow icon={Building2} label="Contact Person" value={selected.contactPerson} />}
                <DetailRow icon={MapPin} label="Billing Address" value={selected.billingAddress ?? selected.location} />
                {selected.gstin && <DetailRow icon={Hash} label="GSTIN" value={selected.gstin} />}
                {selected.pan && <DetailRow icon={Hash} label="PAN" value={selected.pan} />}
                {selected.bankDetails && <DetailRow icon={Landmark} label="Bank Details" value={selected.bankDetails} />}
                {selected.paymentTerms && <DetailRow icon={CreditCard} label="Payment Terms" value={selected.paymentTerms} />}
                {selected.creditDays !== undefined && <DetailRow icon={Percent} label="Credit Days" value={`${selected.creditDays} days`} />}
              </div>
            </div>

            {/* Ledger */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Ledger</p>
                <span className="text-[11px] font-semibold text-slate-400">{selLedger.length} invoices</span>
              </div>
              {selLedger.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No tracked invoices for this vendor.</p>
              ) : (
                <>
                  <p className="text-[11px] text-slate-400 font-medium mb-2">Tap an invoice to view its bill & payment history.</p>
                  <div className="space-y-2">
                    {selLedger.map((e) => {
                      const overdue = isOverdue(e);
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setSelExpId(e.id)}
                          className="w-full text-left border border-slate-200 rounded-2xl p-3.5 hover:border-slate-300 hover:bg-slate-50/70 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{e.itemDescription}</p>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                {formatDate(e.date)} · {e.id}{overdue ? " · " : ""}
                                {overdue && <span className="text-red-500 font-bold">Overdue</span>}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge variant={paymentStatusVariant(e.paymentStatus)}>{getPaymentStatusLabel(e.paymentStatus)}</Badge>
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                          </div>
                          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500">Invoice <span className="font-bold text-slate-700">{formatCurrency(e.amount)}</span></span>
                            <span className="text-emerald-600 font-semibold">{formatCurrency(e.amountPaid)} paid</span>
                            {remainingAmount(e) > 0 && <span className="text-red-600 font-semibold">{formatCurrency(remainingAmount(e))} due</span>}
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold">
                            <span className={cn("inline-flex items-center gap-1", hasBill(e) ? "text-blue-600" : "text-slate-400")}>
                              <ImageIcon className="w-3 h-3" /> {hasBill(e) ? "Bill available" : "No bill"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Wallet className="w-3 h-3" /> {e.payments.length} payment{e.payments.length === 1 ? "" : "s"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Invoice detail — bill & payment history */}
      <ExpenseDetailDrawer expense={selExpense} open={!!selExpense} onClose={() => setSelExpId(null)} />

      {/* Add Vendor Modal (demo) */}
      <AddVendorModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function InfoRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${danger ? "text-red-600" : "text-slate-700"}`}>{value}</p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <p className="font-semibold text-slate-700 break-words">{value}</p>
      </div>
    </div>
  );
}

function AddVendorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", contact: "", phone: "", email: "", gstin: "", category: "goods", terms: "Net 15 days", notes: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name || !form.phone) { toast.error("Vendor name and phone are required."); return; }
    toast.success(`Vendor "${form.name}" added (demo).`);
    setForm({ name: "", contact: "", phone: "", email: "", gstin: "", category: "goods", terms: "Net 15 days", notes: "" });
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Vendor"
      size="lg"
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={submit}>Save Vendor</Button></>}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Input label="Vendor Name *" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Vendor / supplier name" /></div>
        <Input label="Contact Person" value={form.contact} onChange={(e) => set("contact", e.target.value)} />
        <Input label="Mobile Number *" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 ..." />
        <Input label="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <Input label="GST Number" value={form.gstin} onChange={(e) => set("gstin", e.target.value)} />
        <UiSelect
          label="Category"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          options={[
            { value: "goods", label: "Goods & Inventory" },
            { value: "maintenance", label: "Maintenance & Repair" },
            { value: "utilities", label: "Utilities" },
            { value: "cleaning", label: "Cleaning & Hygiene" },
            { value: "marketing", label: "Marketing" },
            { value: "transport", label: "Transport" },
          ]}
        />
        <UiSelect
          label="Payment Terms"
          value={form.terms}
          onChange={(e) => set("terms", e.target.value)}
          options={[
            { value: "Payment on receipt", label: "Payment on receipt" },
            { value: "Net 7 days", label: "Net 7 days" },
            { value: "Net 15 days", label: "Net 15 days" },
            { value: "Net 30 days", label: "Net 30 days" },
          ]}
        />
        <div className="col-span-2"><Textarea label="Notes / Bank Details" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Bank account, IFSC, remarks..." /></div>
      </div>
    </Modal>
  );
}
