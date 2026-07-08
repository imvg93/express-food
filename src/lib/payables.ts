import type { Expense, VendorOutstanding, PaymentStatus, ExpenseCategory } from "@/types";
import { daysUntil } from "@/lib/utils";

// Amount still owed on an expense.
export function remainingAmount(e: Expense): number {
  return Math.max(0, e.amount - e.amountPaid);
}

// An expense is overdue when it still owes money and its due date has passed.
export function isOverdue(e: Expense): boolean {
  if (e.paymentStatus === "paid" || !e.dueDate) return false;
  return daysUntil(e.dueDate) < 0;
}

// Positive number of days a payable is past due (0 if not overdue).
export function daysOverdue(e: Expense): number {
  if (!isOverdue(e) || !e.dueDate) return 0;
  return Math.abs(daysUntil(e.dueDate));
}

// Due within the next `window` days (and not yet due / not paid).
export function isDueSoon(e: Expense, window = 7): boolean {
  if (e.paymentStatus === "paid" || !e.dueDate) return false;
  const d = daysUntil(e.dueDate);
  return d >= 0 && d <= window;
}

// Whether a bill / invoice document is on file (separate from payment proof).
export function hasBill(e: Expense): boolean {
  return e.hasBillProof || (e.attachments?.some((a) => a.type === "bill") ?? false);
}

// Whether at least one payment on the expense carries a payment proof.
export function hasPaymentProof(e: Expense): boolean {
  return e.payments.some((p) => p.hasProof);
}

// Roll a vendor's expenses up into a payables summary.
export function getVendorOutstanding(vendorId: string, expenses: Expense[]): VendorOutstanding {
  const rows = expenses.filter((e) => e.vendorId === vendorId);

  const totalPurchase = rows.reduce((s, e) => s + e.amount, 0);
  const totalPaid = rows.reduce((s, e) => s + e.amountPaid, 0);
  const totalPending = rows.reduce((s, e) => s + remainingAmount(e), 0);
  const pendingBills = rows.filter((e) => e.paymentStatus !== "paid").length;
  const overdueAmount = rows.filter(isOverdue).reduce((s, e) => s + remainingAmount(e), 0);
  const upcomingDue = rows.filter((e) => isDueSoon(e)).reduce((s, e) => s + remainingAmount(e), 0);

  const allPayments = rows
    .flatMap((e) => e.payments)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const last = allPayments[0];

  return {
    totalPurchase,
    totalPaid,
    totalPending,
    pendingBills,
    overdueAmount,
    upcomingDue,
    lastPaymentDate: last?.date,
    lastPaymentAmount: last?.amount,
  };
}

// Portfolio-wide payables summary used by the dashboard.
export interface PayablesSummary {
  total: number;
  paid: number;
  outstanding: number;
  overdue: number;
  dueSoon: number;
  counts: Record<PaymentStatus, number>;
  overdueCount: number;
}

export function getPayablesSummary(expenses: Expense[]): PayablesSummary {
  const counts: Record<PaymentStatus, number> = {
    unpaid: 0,
    "partially-paid": 0,
    paid: 0,
  };
  let total = 0, paid = 0, outstanding = 0, overdue = 0, dueSoon = 0, overdueCount = 0;

  for (const e of expenses) {
    counts[e.paymentStatus]++;
    total += e.amount;
    paid += e.amountPaid;
    outstanding += remainingAmount(e);
    if (isOverdue(e)) { overdue += remainingAmount(e); overdueCount++; }
    if (isDueSoon(e)) dueSoon += remainingAmount(e);
  }

  return { total, paid, outstanding, overdue, dueSoon, counts, overdueCount };
}

export function getCategoryOutstanding(expenses: Expense[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of expenses) {
    out[e.category] = (out[e.category] ?? 0) + remainingAmount(e);
  }
  return out;
}

export function getCategorySpend(expenses: Expense[]): Record<ExpenseCategory, number> {
  const out = {} as Record<ExpenseCategory, number>;
  for (const e of expenses) {
    out[e.category] = (out[e.category] ?? 0) + e.amount;
  }
  return out;
}
