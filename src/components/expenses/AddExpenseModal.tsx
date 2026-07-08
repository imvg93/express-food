"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Upload, ImageIcon, X, ShieldCheck, AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input, { Select, Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useDemoStore } from "@/store/demoStore";
import { VENDORS } from "@/data/vendors";
import { formatCurrency, cn } from "@/lib/utils";
import type { ExpenseCategory, Expense, PaymentRecord, PaymentStatus, Attachment, PaymentMode } from "@/types";
import {
  GOODS_SUB_CATEGORIES, MAINTENANCE_SUB_CATEGORIES, UTILITY_SUB_CATEGORIES,
  CLEANING_SUB_CATEGORIES, MARKETING_SUB_CATEGORIES, TRANSPORT_SUB_CATEGORIES,
} from "@/lib/constants";

const CREDIT_DAYS: Record<ExpenseCategory, number> = {
  goods: 7, maintenance: 15, utilities: 10, cleaning: 15, marketing: 30, transport: 7, "petty-cash": 0,
};

const SUB_CATS: Record<ExpenseCategory, string[]> = {
  goods: GOODS_SUB_CATEGORIES,
  maintenance: MAINTENANCE_SUB_CATEGORIES,
  utilities: UTILITY_SUB_CATEGORIES,
  cleaning: CLEANING_SUB_CATEGORIES,
  marketing: MARKETING_SUB_CATEGORIES,
  transport: TRANSPORT_SUB_CATEGORIES,
  "petty-cash": [],
};

const OTHER = "__other__";
const TODAY = "2026-06-12";

interface Props {
  open: boolean;
  onClose: () => void;
  category: ExpenseCategory;
  categoryLabel: string;
}

const EMPTY = {
  description: "", subCategory: "", vendorId: "", vendorName: "",
  amount: "", qty: "", unit: "", paymentMode: "Cash" as PaymentMode, notes: "",
  paymentStatus: "unpaid" as PaymentStatus, amountPaid: "",
};

export default function AddExpenseModal({ open, onClose, category, categoryLabel }: Props) {
  const { addExpense } = useDemoStore();
  const [form, setForm] = useState({ ...EMPTY });
  const [billFile, setBillFile] = useState<File | null>(null);
  const [billPreview, setBillPreview] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Vendors for this category (fall back to all if the category has none seeded).
  const catVendors = VENDORS.filter((v) => v.category === category);
  const vendorOptions = (catVendors.length ? catVendors : VENDORS).map((v) => ({ value: v.id, label: v.name }));

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  // Build/tear down object URLs for image previews.
  useEffect(() => {
    if (!billFile) { setBillPreview(null); return; }
    const url = URL.createObjectURL(billFile);
    setBillPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [billFile]);
  useEffect(() => {
    if (!proofFile) { setProofPreview(null); return; }
    const url = URL.createObjectURL(proofFile);
    setProofPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [proofFile]);

  const total = Number(form.amount) || 0;
  const isPaying = form.paymentStatus !== "unpaid";
  const paidNow = form.paymentStatus === "paid" ? total : Number(form.amountPaid) || 0;

  const reset = () => {
    setForm({ ...EMPTY });
    setBillFile(null); setProofFile(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = () => {
    if (!form.description || !form.vendorId || !form.amount) {
      toast.error("Please fill in Description, Vendor and Amount.");
      return;
    }
    if (form.vendorId === OTHER && !form.vendorName.trim()) {
      toast.error("Please enter the new vendor's name.");
      return;
    }
    if (form.paymentStatus === "partially-paid") {
      if (paidNow <= 0) { toast.error("Enter the amount paid."); return; }
      if (paidNow >= total) { toast.error("Partial payment must be less than the total. Choose 'Paid' instead."); return; }
    }
    // Payment proof is mandatory whenever money is being paid.
    if (isPaying && !proofFile) {
      toast.error("Payment proof is required when recording a payment.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const invoiceDate = TODAY;
      const creditDays = CREDIT_DAYS[category] ?? 15;
      const due = new Date(invoiceDate);
      due.setDate(due.getDate() + creditDays);

      const vendor = VENDORS.find((v) => v.id === form.vendorId);
      const vendorId = form.vendorId === OTHER ? `v-new-${Math.random().toString(36).slice(2, 6)}` : form.vendorId;
      const vendorName = form.vendorId === OTHER ? form.vendorName.trim() : vendor?.name ?? form.vendorName;

      const id = "EXP-" + Math.random().toString(36).substr(2, 5).toUpperCase();

      // Payment record (if any) — carries the mandatory proof.
      const payments: PaymentRecord[] = [];
      if (isPaying && paidNow > 0) {
        payments.push({
          id: `${id}-P1`,
          date: invoiceDate,
          amount: paidNow,
          method: form.paymentMode,
          paidBy: "Venkat Reddy",
          hasProof: true,
          proofName: proofFile?.name,
        });
      }
      const amountPaid = payments.reduce((s, p) => s + p.amount, 0);
      const paymentStatus: PaymentStatus =
        amountPaid <= 0 ? "unpaid" : amountPaid >= total ? "paid" : "partially-paid";

      // Attachments (bill + payment proof).
      const attachments: Attachment[] = [];
      if (billFile) attachments.push({ id: `${id}-A1`, type: "bill", name: billFile.name, uploadedBy: "Venkat Reddy", uploadedAt: new Date().toISOString() });
      if (proofFile) attachments.push({ id: `${id}-A2`, type: "payment-proof", name: proofFile.name, uploadedBy: "Venkat Reddy", uploadedAt: new Date().toISOString() });

      const newExpense: Expense = {
        id,
        date: TODAY,
        category,
        subCategory: form.subCategory || undefined,
        itemDescription: form.description,
        vendorId,
        vendorName,
        quantity: form.qty ? Number(form.qty) : undefined,
        unit: form.unit || undefined,
        amount: total,
        paymentMode: form.paymentMode,
        status: billFile ? "proof-uploaded" : "submitted",
        paymentStatus,
        amountPaid,
        payments,
        invoiceDate,
        dueDate: due.toISOString().slice(0, 10),
        creditDays,
        branch: "Main Branch",
        attachments: attachments.length ? attachments : undefined,
        submittedBy: "Venkat Reddy",
        submittedById: "u3",
        hasBillProof: !!billFile,
        approvalHistory: [
          { stage: "submitted", label: "Submitted", doneBy: "Venkat Reddy", doneAt: new Date().toISOString() },
          ...(billFile ? [{ stage: "proof-uploaded" as const, label: "Proof Uploaded", doneBy: "Venkat Reddy", doneAt: new Date().toISOString() }] : []),
        ],
        notes: form.notes || undefined,
      };

      addExpense(newExpense);
      toast.success(
        paymentStatus === "paid"
          ? `Entry saved & marked Paid — linked to ${vendorName}.`
          : paymentStatus === "partially-paid"
          ? `Entry saved. ${formatCurrency(amountPaid)} paid, ${formatCurrency(total - amountPaid)} due to ${vendorName}.`
          : `Entry saved as Unpaid — added to ${vendorName}'s payables.`
      );
      reset();
      setLoading(false);
      onClose();
    }, 700);
  };

  const subcats = SUB_CATS[category] || [];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Add ${categoryLabel} Entry`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Save Entry</Button>
        </>
      }
    >
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Input label="Description *" placeholder="Brief description of the expense"
              value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          {subcats.length > 0 && (
            <div className="col-span-2">
              <Select label="Sub-Category"
                options={subcats.map((s) => ({ value: s, label: s }))}
                placeholder="Select sub-category"
                value={form.subCategory} onChange={(e) => set("subCategory", e.target.value)} />
            </div>
          )}

          <div className={form.vendorId === OTHER ? "" : "col-span-2"}>
            <Select label="Vendor / Supplier *"
              options={[...vendorOptions, { value: OTHER, label: "＋ Other / New vendor" }]}
              placeholder="Select vendor"
              value={form.vendorId}
              onChange={(e) => set("vendorId", e.target.value)} />
          </div>
          {form.vendorId === OTHER && (
            <Input label="New Vendor Name *" placeholder="Type vendor name"
              value={form.vendorName} onChange={(e) => set("vendorName", e.target.value)} />
          )}

          <div className="col-span-2">
            <Input label="Total Amount (₹) *" type="number" placeholder="0.00"
              value={form.amount} onChange={(e) => set("amount", e.target.value)} />
          </div>

          {(category === "goods" || category === "transport") && (
            <>
              <Input label="Quantity" type="number" placeholder="Qty"
                value={form.qty} onChange={(e) => set("qty", e.target.value)} />
              <Input label="Unit" placeholder="kg / L / pcs"
                value={form.unit} onChange={(e) => set("unit", e.target.value)} />
            </>
          )}
        </div>

        {/* Bill / Invoice photo */}
        <FileDrop
          id="bill-upload"
          label="Bill / Invoice Photo"
          hint="Vendor invoice or bill — JPG, PNG or PDF"
          file={billFile}
          preview={billPreview}
          onSelect={setBillFile}
          onClear={() => setBillFile(null)}
        />

        {/* Payment status */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Payment Status</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: "unpaid", label: "Unpaid", tone: "text-red-600 border-red-300 bg-red-50" },
              { key: "partially-paid", label: "Partial", tone: "text-amber-600 border-amber-300 bg-amber-50" },
              { key: "paid", label: "Paid", tone: "text-emerald-600 border-emerald-300 bg-emerald-50" },
            ] as const).map((opt) => (
              <button key={opt.key} type="button"
                onClick={() => set("paymentStatus", opt.key)}
                className={cn(
                  "h-10 rounded-xl border text-sm font-bold transition-all",
                  form.paymentStatus === opt.key ? opt.tone : "border-slate-200 text-slate-500 hover:border-slate-300"
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment details (shown when paying) */}
        {isPaying && (
          <div className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">Payment Details</p>
              {total > 0 && (
                <Badge variant={form.paymentStatus === "paid" ? "success" : "warning"}>
                  {form.paymentStatus === "paid" ? `Paying ${formatCurrency(total)}` : `Balance ${formatCurrency(Math.max(0, total - paidNow))}`}
                </Badge>
              )}
            </div>
            {form.paymentStatus === "partially-paid" && (
              <Input label="Amount Paid (₹) *" type="number" placeholder="0.00"
                value={form.amountPaid} onChange={(e) => set("amountPaid", e.target.value)} />
            )}
            <FileDrop
              id="proof-upload"
              label="Payment Proof *"
              hint="Bank receipt · UPI screenshot · cheque image"
              file={proofFile}
              preview={proofPreview}
              onSelect={setProofFile}
              onClear={() => setProofFile(null)}
            />
            {!proofFile && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Proof is mandatory to record this payment.
              </div>
            )}
          </div>
        )}

        <Textarea label="Notes (optional)" placeholder="Any additional information"
          value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
    </Modal>
  );
}

// Reusable image/file dropzone with thumbnail preview.
function FileDrop({
  id, label, hint, file, preview, onSelect, onClear,
}: {
  id: string; label: string; hint: string;
  file: File | null; preview: string | null;
  onSelect: (f: File) => void; onClear: () => void;
}) {
  const isImage = file?.type.startsWith("image/");
  return (
    <div>
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">{label}</label>
      <div className={cn(
        "border-2 border-dashed rounded-xl p-4 transition-all",
        file ? "border-emerald-400 bg-emerald-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
      )}>
        <input type="file" id={id} accept="image/*,.pdf" className="hidden"
          onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])} />
        {file ? (
          <div className="flex items-center gap-3">
            {isImage && preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt={file.name} className="w-14 h-14 rounded-xl object-cover border border-emerald-200 shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-emerald-700 truncate">{file.name}</p>
              <p className="text-xs text-emerald-600 mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor={id} className="text-xs font-semibold text-[#1B3A5C] cursor-pointer hover:text-[#E67E22]">Replace</label>
              <button type="button" onClick={onClear} className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <label htmlFor={id} className="cursor-pointer flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Take / choose photo
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
