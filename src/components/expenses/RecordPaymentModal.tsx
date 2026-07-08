"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle2, AlertTriangle, IndianRupee } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input, { Select, Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useDemoStore } from "@/store/demoStore";
import { formatCurrency } from "@/lib/utils";
import { remainingAmount } from "@/lib/payables";
import { PAYMENT_MODES } from "@/lib/constants";
import type { Expense, PaymentMode } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  expense: Expense | null;
  open: boolean;
  onClose: () => void;
}

export default function RecordPaymentModal({ expense, open, onClose }: Props) {
  const { addPayment } = useDemoStore();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2026-06-12");
  const [method, setMethod] = useState<PaymentMode>("UPI");
  const [reference, setReference] = useState("");
  const [paidBy, setPaidBy] = useState("Narasimha Rao");
  const [notes, setNotes] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!expense) return null;

  const remaining = remainingAmount(expense);
  const enteredAmount = Number(amount) || 0;
  // Paying the full remaining balance settles the expense → payment proof is mandatory.
  const willSettle = enteredAmount >= remaining && enteredAmount > 0;

  const reset = () => {
    setAmount(""); setDate("2026-06-12"); setMethod("UPI");
    setReference(""); setPaidBy("Narasimha Rao"); setNotes(""); setProof(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = () => {
    if (enteredAmount <= 0) { toast.error("Enter a valid payment amount."); return; }
    if (enteredAmount > remaining) {
      toast.error(`Amount exceeds the outstanding balance of ${formatCurrency(remaining)}.`);
      return;
    }
    // A payment that marks the expense as fully Paid requires a payment proof.
    if (willSettle && !proof) {
      toast.error("Payment proof is mandatory to mark this expense as Paid.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addPayment(expense.id, {
        date,
        amount: enteredAmount,
        method,
        reference: reference || undefined,
        paidBy,
        hasProof: !!proof,
        proofName: proof?.name,
        notes: notes || undefined,
      });
      toast.success(
        willSettle
          ? "Payment recorded. Expense marked as Paid."
          : `Payment of ${formatCurrency(enteredAmount)} recorded. Balance: ${formatCurrency(remaining - enteredAmount)}.`
      );
      setLoading(false);
      handleClose();
    }, 800);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Record Payment"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Record Payment
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Expense summary */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{expense.itemDescription}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{expense.vendorName} · {expense.id}</p>
            </div>
            <Badge variant={expense.paymentStatus === "partially-paid" ? "warning" : "danger"}>
              {expense.paymentStatus === "partially-paid" ? "Partially Paid" : "Unpaid"}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Invoice</p>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">{formatCurrency(expense.amount)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paid</p>
              <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{formatCurrency(expense.amountPaid)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Balance</p>
              <p className="text-sm font-extrabold text-red-600 mt-0.5">{formatCurrency(remaining)}</p>
            </div>
          </div>
        </div>

        {/* Payment form */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Payment Amount (₹) *"
            type="number"
            placeholder="0.00"
            leftIcon={<IndianRupee className="w-4 h-4" />}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input label="Payment Date *" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select
            label="Payment Method *"
            options={PAYMENT_MODES.map((m) => ({ value: m, label: m }))}
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMode)}
          />
          <Input
            label="Transaction Ref No."
            placeholder="UPI / NEFT / Cheque no."
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <div className="col-span-2">
            <Input label="Paid By" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} />
          </div>
        </div>

        {/* Quick-fill remaining */}
        <button
          type="button"
          onClick={() => setAmount(String(remaining))}
          className="text-xs font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors"
        >
          Pay full balance ({formatCurrency(remaining)})
        </button>

        {/* Payment proof */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Payment Proof {willSettle && <span className="text-red-500">*</span>}
          </label>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-5 text-center transition-all",
              proof ? "border-emerald-400 bg-emerald-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
            )}
          >
            <input
              type="file"
              id="payment-proof"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && setProof(e.target.files[0])}
            />
            <label htmlFor="payment-proof" className="cursor-pointer block">
              {proof ? (
                <>
                  <FileText className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-emerald-700">{proof.name}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Tap to replace</p>
                </>
              ) : (
                <>
                  <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">Upload payment proof</p>
                  <p className="text-xs text-slate-500 mt-0.5">Bank receipt · UPI screenshot · cheque image · acknowledgment</p>
                </>
              )}
            </label>
          </div>
          {willSettle && !proof && (
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Proof is required to settle this expense and mark it Paid.
            </div>
          )}
        </div>

        <Textarea
          label="Notes (optional)"
          placeholder="Any remarks about this payment..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  );
}
