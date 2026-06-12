"use client";
import { useState } from "react";
import { Image, FileText, Check, X, Upload } from "lucide-react";
import { toast } from "sonner";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import WorkflowStepper from "./WorkflowStepper";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
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

  if (!expense) return null;

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
          {canUploadProof && (
            <Button onClick={handleUploadProof} leftIcon={<Upload className="w-3.5 h-3.5" />} className="flex-1">
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
          <div className="flex items-center justify-between">
            <p className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">{formatCurrency(expense.amount)}</p>
            <Badge variant={statusVariant[expense.status] || "gray"} dot>
              {getStatusLabel(expense.status)}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-slate-700">{expense.itemDescription}</p>
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

        {/* Workflow */}
        <WorkflowStepper status={expense.status} history={expense.approvalHistory} />
      </div>
    </Drawer>
  );
}
