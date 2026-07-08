"use client";
import { useState } from "react";
import { Image, FileText, Check, X, Upload, IndianRupee, Wallet, CalendarClock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import WorkflowStepper from "./WorkflowStepper";
import RecordPaymentModal from "./RecordPaymentModal";
import {
  formatCurrency, formatDate, getStatusLabel,
  getPaymentStatusLabel, paymentStatusVariant,
} from "@/lib/utils";
import { remainingAmount, isOverdue, daysOverdue, isDueSoon } from "@/lib/payables";
import { daysUntil } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Expense } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  expense: Expense | null;
  open: boolean;
  onClose: () => void;
}

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "purple" | "gray"> = {
  "owner-approved": "success",
  submitted: "gray",
  "proof-uploaded": "info",
  "manager-verified": "purple",
  rejected: "danger",
};

export default function ExpenseDetailDrawer({ expense, open, onClose }: Props) {
  const { role, updateExpenseStatus } = useDemoStore();
  const [rejectComment, setRejectComment] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [billPreview, setBillPreview] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  if (!expense) return null;

  const remaining = remainingAmount(expense);
  const paidPct = expense.amount > 0 ? Math.round((expense.amountPaid / expense.amount) * 100) : 0;
  const overdue = isOverdue(expense);
  const dueSoon = isDueSoon(expense);
  const canRecordPayment = (role === "owner" || role === "manager") && expense.paymentStatus !== "paid";

  const canApproveAsManager = role === "manager" && expense.status === "proof-uploaded";
  const canApproveAsOwner = role === "owner" && expense.status === "manager-verified";
  const canUploadProof = (role === "supervisor" || role === "manager") && expense.status === "submitted";

  const handleApprove = () => {
    const newStatus = role === "manager" ? "manager-verified" : "owner-approved";
    const doneBy = role === "manager" ? "Narasimha Rao" : "Rayudu Gari";
    updateExpenseStatus(expense.id, newStatus, undefined, doneBy);
    toast.success(role === "manager" ? "Expense verified and forwarded to owner." : "Expense approved successfully.");
    onClose();
  };

  const handleReject = () => {
    if (!rejectComment.trim()) { toast.error("Please add a comment before rejecting."); return; }
    const doneBy = role === "manager" ? "Narasimha Rao" : "Rayudu Gari";
    updateExpenseStatus(expense.id, "rejected", rejectComment, doneBy);
    toast.success("Expense rejected. Supervisor will be notified.");
    setShowRejectBox(false);
    setRejectComment("");
    onClose();
  };

  const handleUploadProof = () => {
    updateExpenseStatus(expense.id, "proof-uploaded", undefined, "Venkat Reddy");
    toast.success("Bill proof uploaded. Sent for manager verification.");
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={expense.id}
      subtitle={`${expense.subCategory || ""} — ${formatDate(expense.date)}`}
      footer={
        <div className="flex items-center gap-2 w-full">
          {canRecordPayment && !showRejectBox && (
            <Button onClick={() => setPayOpen(true)} leftIcon={<Wallet className="w-3.5 h-3.5" />} className="flex-1">
              Record Payment
            </Button>
          )}
          {canUploadProof && (
            <Button variant={canRecordPayment ? "outline" : "primary"} onClick={handleUploadProof} leftIcon={<Upload className="w-3.5 h-3.5" />} className="flex-1">
              Upload Bill Proof
            </Button>
          )}
          {(canApproveAsManager || canApproveAsOwner) && !showRejectBox && (
            <>
              <Button variant="danger" size="sm" onClick={() => setShowRejectBox(true)} leftIcon={<X className="w-3.5 h-3.5" />}>
                Reject
              </Button>
              <Button onClick={handleApprove} leftIcon={<Check className="w-3.5 h-3.5" />} className="flex-1">
                {role === "manager" ? "Verify & Forward" : "Approve"}
              </Button>
            </>
          )}
          {showRejectBox && (
            <div className="flex flex-col gap-2 w-full">
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-300/40 focus:border-red-300 font-medium"
                rows={2}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowRejectBox(false)} className="flex-1">Cancel</Button>
                <Button variant="danger" size="sm" onClick={handleReject} className="flex-1">Confirm Reject</Button>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="divide-y divide-slate-100">
        {/* Summary */}
        <div className="px-5 py-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">{formatCurrency(expense.amount)}</p>
            <div className="flex flex-col items-end gap-1.5">
              <Badge variant={paymentStatusVariant(expense.paymentStatus)} dot>
                {getPaymentStatusLabel(expense.paymentStatus)}
              </Badge>
              <Badge variant={statusVariant[expense.status] || "gray"} dot>
                {getStatusLabel(expense.status)}
              </Badge>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-700">{expense.itemDescription}</p>

          {/* Payment progress */}
          {expense.paymentStatus !== "unpaid" && (
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-600">{formatCurrency(expense.amountPaid)} paid</span>
                {remaining > 0 && <span className="text-red-600">{formatCurrency(remaining)} due</span>}
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", expense.paymentStatus === "paid" ? "bg-emerald-500" : "bg-amber-500")}
                  style={{ width: `${paidPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Payables / Due date */}
        <div className="px-5 py-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Payables</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount Paid</p>
              <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{formatCurrency(expense.amountPaid)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Balance Due</p>
              <p className="text-sm font-extrabold text-red-600 mt-0.5">{formatCurrency(remaining)}</p>
            </div>
            {expense.invoiceDate && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Invoice Date</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{formatDate(expense.invoiceDate)}</p>
              </div>
            )}
            {expense.dueDate && (
              <div className={cn(
                "rounded-xl p-3 border",
                overdue ? "bg-red-50 border-red-200" : dueSoon ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100"
              )}>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <CalendarClock className="w-3 h-3" /> Due Date
                </p>
                <p className={cn("text-sm font-semibold mt-0.5", overdue ? "text-red-600" : dueSoon ? "text-amber-600" : "text-slate-700")}>
                  {formatDate(expense.dueDate)}
                </p>
                {expense.paymentStatus !== "paid" && (
                  <p className={cn("text-[11px] font-bold mt-0.5", overdue ? "text-red-500" : dueSoon ? "text-amber-500" : "text-slate-400")}>
                    {overdue ? `${daysOverdue(expense)} days overdue` : `${Math.max(0, daysUntil(expense.dueDate))} days remaining`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 grid grid-cols-2 gap-4">
          {[
            { label: "Date",          value: formatDate(expense.date)                     },
            { label: "Vendor",        value: expense.vendorName                           },
            { label: "Payment Mode",  value: expense.paymentMode                         },
            ...(expense.paymentRef    ? [{ label: "Ref / UPI ID",    value: expense.paymentRef               }] : []),
            ...(expense.quantity      ? [{ label: "Quantity",        value: `${expense.quantity} ${expense.unit || ""}` }] : []),
            ...(expense.rate          ? [{ label: "Unit Rate",       value: formatCurrency(expense.rate)     }] : []),
            { label: "Submitted By",  value: expense.submittedBy                         },
            ...(expense.technicianName ? [{ label: "Technician",     value: expense.technicianName           }] : []),
            ...(expense.assetName     ? [{ label: "Asset",           value: expense.assetName                }] : []),
            ...(expense.billNumber    ? [{ label: "Bill Number",     value: expense.billNumber               }] : []),
            ...(expense.billingPeriod ? [{ label: "Billing Period",  value: expense.billingPeriod            }] : []),
            ...(expense.vehicleRoute  ? [{ label: "Route",           value: expense.vehicleRoute             }] : []),
          ].map((row) => (
            <div key={row.label}>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{row.label}</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{row.value}</p>
            </div>
          ))}
        </div>

        {/* Bill Proof */}
        <div className="px-5 py-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Bill / Proof</p>
          {expense.hasBillProof ? (
            <button
              onClick={() => setBillPreview(true)}
              className="flex items-center gap-3 w-full border border-slate-200 rounded-2xl p-4 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Image className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">Bill_Invoice_{expense.id}.jpg</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Click to preview</p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3 border border-dashed border-amber-200 bg-amber-50/50 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-700">No bill uploaded</p>
                <p className="text-xs text-amber-500 font-medium mt-0.5">Upload required for approval</p>
              </div>
            </div>
          )}
          {billPreview && (
            <div
              className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
              onClick={() => setBillPreview(false)}
            >
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
                <div className="w-full h-48 bg-slate-100 rounded-2xl flex flex-col items-center justify-center mb-4">
                  <FileText className="w-12 h-12 text-slate-300" />
                  <p className="text-sm font-bold text-slate-700 mt-2">Bill Invoice</p>
                  <p className="text-xs text-slate-400 font-medium">{expense.id}</p>
                </div>
                <p className="text-xs text-slate-400">Mock bill preview — actual bill image would display here</p>
                <button onClick={() => setBillPreview(false)} className="mt-4 text-sm font-semibold text-[#1B3A5C] hover:text-[#E67E22] transition-colors">Close</button>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {expense.notes && (
          <div className="px-5 py-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm text-slate-500 italic">{expense.notes}</p>
          </div>
        )}

        {/* Payment History */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment History</p>
            <span className="text-[11px] font-semibold text-slate-400">{expense.payments.length} payment{expense.payments.length === 1 ? "" : "s"}</span>
          </div>
          {expense.payments.length === 0 ? (
            <div className="flex items-center gap-3 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Wallet className="w-4.5 h-4.5 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No payments recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {expense.payments.map((p) => (
                <div key={p.id} className="border border-slate-200 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-800">{formatCurrency(p.amount)}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{formatDate(p.date)} · {p.method}</p>
                      </div>
                    </div>
                    {p.hasProof ? (
                      <Badge variant="success"><ShieldCheck className="w-3 h-3" /> Proof</Badge>
                    ) : (
                      <Badge variant="warning">No proof</Badge>
                    )}
                  </div>
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-y-1 text-[11px]">
                    {p.reference && (
                      <p className="text-slate-500"><span className="font-semibold text-slate-400">Ref:</span> {p.reference}</p>
                    )}
                    <p className="text-slate-500"><span className="font-semibold text-slate-400">Paid by:</span> {p.paidBy}</p>
                    {p.notes && <p className="col-span-2 text-slate-500 italic">{p.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workflow */}
        <WorkflowStepper status={expense.status} history={expense.approvalHistory} />
      </div>

      <RecordPaymentModal expense={expense} open={payOpen} onClose={() => setPayOpen(false)} />
    </Drawer>
  );
}
