"use client";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input, { Select, Textarea } from "@/components/ui/Input";
import { useDemoStore } from "@/store/demoStore";
import type { ExpenseCategory, Expense } from "@/types";
import {
  GOODS_SUB_CATEGORIES, MAINTENANCE_SUB_CATEGORIES, UTILITY_SUB_CATEGORIES,
  CLEANING_SUB_CATEGORIES, MARKETING_SUB_CATEGORIES, TRANSPORT_SUB_CATEGORIES,
} from "@/lib/constants";

const SUB_CATS: Record<ExpenseCategory, string[]> = {
  goods: GOODS_SUB_CATEGORIES,
  maintenance: MAINTENANCE_SUB_CATEGORIES,
  utilities: UTILITY_SUB_CATEGORIES,
  cleaning: CLEANING_SUB_CATEGORIES,
  marketing: MARKETING_SUB_CATEGORIES,
  transport: TRANSPORT_SUB_CATEGORIES,
  "petty-cash": [],
};

interface Props {
  open: boolean;
  onClose: () => void;
  category: ExpenseCategory;
  categoryLabel: string;
}

export default function AddExpenseModal({ open, onClose, category, categoryLabel }: Props) {
  const { addExpense } = useDemoStore();
  const [form, setForm] = useState({
    description: "",
    subCategory: "",
    vendor: "",
    amount: "",
    qty: "",
    unit: "",
    paymentMode: "Cash",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description || !form.vendor || !form.amount) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newExpense: Expense = {
        id: "EXP-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
        date: "2026-06-12",
        category,
        subCategory: form.subCategory,
        itemDescription: form.description,
        vendorId: "v1",
        vendorName: form.vendor,
        quantity: form.qty ? Number(form.qty) : undefined,
        unit: form.unit || undefined,
        amount: Number(form.amount),
        paymentMode: form.paymentMode as Expense["paymentMode"],
        status: "submitted",
        submittedBy: "Venkat Reddy",
        submittedById: "u3",
        hasBillProof: false,
        approvalHistory: [
          {
            stage: "submitted",
            label: "Submitted",
            doneBy: "Venkat Reddy",
            doneAt: new Date().toISOString(),
          },
        ],
        notes: form.notes || undefined,
      };
      addExpense(newExpense);
      toast.success("Expense entry added. Please upload the bill to proceed.");
      setForm({ description: "", subCategory: "", vendor: "", amount: "", qty: "", unit: "", paymentMode: "Cash", notes: "" });
      setLoading(false);
      onClose();
    }, 1000);
  };

  const subcats = SUB_CATS[category] || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Add ${categoryLabel} Entry`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Save Entry</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Input
              label="Description *"
              placeholder="Brief description of the expense"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          {subcats.length > 0 && (
            <div className="col-span-2">
              <Select
                label="Sub-Category"
                options={subcats.map((s) => ({ value: s, label: s }))}
                placeholder="Select sub-category"
                value={form.subCategory}
                onChange={(e) => set("subCategory", e.target.value)}
              />
            </div>
          )}
          <div className="col-span-2">
            <Input
              label="Vendor / Supplier *"
              placeholder="Vendor name"
              value={form.vendor}
              onChange={(e) => set("vendor", e.target.value)}
            />
          </div>
          <Input
            label="Total Amount (₹) *"
            type="number"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
          />
          <Select
            label="Payment Mode"
            options={[
              { value: "Cash", label: "Cash" },
              { value: "UPI", label: "UPI" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Cheque", label: "Cheque" },
            ]}
            value={form.paymentMode}
            onChange={(e) => set("paymentMode", e.target.value)}
          />
          {(category === "goods" || category === "transport") && (
            <>
              <Input
                label="Quantity"
                type="number"
                placeholder="Qty"
                value={form.qty}
                onChange={(e) => set("qty", e.target.value)}
              />
              <Input
                label="Unit"
                placeholder="kg / L / pcs"
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
              />
            </>
          )}
          <div className="col-span-2">
            <Textarea
              label="Notes (optional)"
              placeholder="Any additional information"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>
        <div className="border border-dashed border-slate-200 bg-slate-50 rounded-2xl p-4 text-center">
          <p className="text-sm font-semibold text-slate-600">Bill / Invoice Upload</p>
          <p className="text-xs text-slate-400 font-medium mt-1">You can upload the bill after saving this entry.</p>
        </div>
        <p className="text-xs text-slate-400 text-center font-medium">
          After submission, upload the bill to move for manager verification.
        </p>
      </div>
    </Modal>
  );
}
