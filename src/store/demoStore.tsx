"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  Role,
  Expense,
  Budget,
  Notification,
  PaymentRecord,
  PaymentStatus,
  AuditEntry,
} from "@/types";
import { EXPENSES } from "@/data/expenses";
import { BUDGETS } from "@/data/budgets";
import { NOTIFICATIONS } from "@/data/notifications";

// Derive the payment status implied by how much of an expense has been paid.
function derivePaymentStatus(amount: number, amountPaid: number): PaymentStatus {
  if (amountPaid <= 0) return "unpaid";
  if (amountPaid >= amount) return "paid";
  return "partially-paid";
}

// Build the initial audit log by replaying the seed data's history.
function seedAuditLog(expenses: Expense[]): AuditEntry[] {
  const entries: AuditEntry[] = [];
  for (const e of expenses) {
    entries.push({
      id: `AUD-${e.id}-C`,
      expenseId: e.id,
      expenseLabel: e.itemDescription,
      action: "expense-created",
      label: "Expense created",
      user: e.submittedBy,
      timestamp: e.approvalHistory[0]?.doneAt ?? `${e.date}T08:00:00`,
      newValue: `${e.vendorName} · ₹${e.amount.toLocaleString("en-IN")}`,
    });
    e.approvalHistory.slice(1).forEach((step, i) => {
      entries.push({
        id: `AUD-${e.id}-S${i}`,
        expenseId: e.id,
        expenseLabel: e.itemDescription,
        action: "status-changed",
        label: step.label,
        user: step.doneBy ?? "System",
        timestamp: step.doneAt ?? `${e.date}T09:00:00`,
        newValue: step.label,
      });
    });
    e.payments.forEach((p) => {
      entries.push({
        id: `AUD-${p.id}`,
        expenseId: e.id,
        expenseLabel: e.itemDescription,
        action: "payment-added",
        label: `Payment recorded · ₹${p.amount.toLocaleString("en-IN")}`,
        user: p.paidBy,
        timestamp: `${p.date}T12:00:00`,
        newValue: `${p.method}${p.reference ? ` · ${p.reference}` : ""}`,
      });
    });
  }
  return entries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

interface DemoState {
  role: Role;
  expenses: Expense[];
  budgets: Budget[];
  notifications: Notification[];
  auditLog: AuditEntry[];
  setRole: (role: Role) => void;
  updateExpenseStatus: (id: string, status: Expense["status"], comment?: string, doneBy?: string) => void;
  addPayment: (expenseId: string, payment: Omit<PaymentRecord, "id">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateBudgetLimit: (id: string, limit: number) => void;
  addExpense: (expense: Expense) => void;
  unreadCount: number;
}

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("owner");
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
  const [budgets, setBudgets] = useState<Budget[]>(BUDGETS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(() => seedAuditLog(EXPENSES));

  const logAudit = useCallback(
    (entry: Omit<AuditEntry, "id" | "timestamp"> & { timestamp?: string }) => {
      setAuditLog((prev) => [
        {
          ...entry,
          id: `AUD-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
          timestamp: entry.timestamp ?? new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    []
  );

  const updateExpenseStatus = useCallback(
    (id: string, status: Expense["status"], comment?: string, doneBy?: string) => {
      let label = "Submitted";
      setExpenses((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          label =
            status === "owner-approved"
              ? "Owner Approved"
              : status === "rejected"
              ? "Rejected"
              : status === "manager-verified"
              ? "Manager Verified"
              : status === "proof-uploaded"
              ? "Proof Uploaded"
              : "Submitted";
          const newStep = {
            stage: status,
            label,
            doneBy: doneBy || "Demo User",
            doneAt: new Date().toISOString(),
            comment,
          };
          return {
            ...e,
            status,
            approvalHistory: [...e.approvalHistory, newStep],
            hasBillProof: status === "proof-uploaded" ? true : e.hasBillProof,
          };
        })
      );
      const target = expenses.find((e) => e.id === id);
      logAudit({
        expenseId: id,
        expenseLabel: target?.itemDescription ?? id,
        action: status === "proof-uploaded" ? "bill-uploaded" : "status-changed",
        label,
        user: doneBy || "Demo User",
        previousValue: target ? getStatusText(target.status) : undefined,
        newValue: label,
      });
    },
    [expenses, logAudit]
  );

  const addPayment = useCallback(
    (expenseId: string, payment: Omit<PaymentRecord, "id">) => {
      const record: PaymentRecord = {
        ...payment,
        id: `PAY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      };
      let newStatus: PaymentStatus = "unpaid";
      let label = "";
      setExpenses((prev) =>
        prev.map((e) => {
          if (e.id !== expenseId) return e;
          const payments = [...e.payments, record];
          const amountPaid = payments.reduce((s, p) => s + p.amount, 0);
          newStatus = derivePaymentStatus(e.amount, amountPaid);
          label = `Payment recorded · ₹${record.amount.toLocaleString("en-IN")}`;
          return { ...e, payments, amountPaid, paymentStatus: newStatus };
        })
      );
      const target = expenses.find((e) => e.id === expenseId);
      logAudit({
        expenseId,
        expenseLabel: target?.itemDescription ?? expenseId,
        action: "payment-added",
        label,
        user: record.paidBy,
        newValue: `${record.method}${record.reference ? ` · ${record.reference}` : ""} → ${paymentStatusText(newStatus)}`,
      });
      if (record.hasProof) {
        logAudit({
          expenseId,
          expenseLabel: target?.itemDescription ?? expenseId,
          action: "proof-uploaded",
          label: "Payment proof uploaded",
          user: record.paidBy,
          newValue: record.proofName,
        });
      }
    },
    [expenses, logAudit]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const updateBudgetLimit = useCallback((id: string, limit: number) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, monthlyLimit: limit } : b)));
  }, []);

  const addExpense = useCallback(
    (expense: Expense) => {
      setExpenses((prev) => [expense, ...prev]);
      logAudit({
        expenseId: expense.id,
        expenseLabel: expense.itemDescription,
        action: "expense-created",
        label: "Expense created",
        user: expense.submittedBy,
        newValue: `${expense.vendorName} · ₹${expense.amount.toLocaleString("en-IN")}`,
      });
    },
    [logAudit]
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DemoContext.Provider
      value={{
        role,
        expenses,
        budgets,
        notifications,
        auditLog,
        setRole,
        updateExpenseStatus,
        addPayment,
        markNotificationRead,
        markAllNotificationsRead,
        updateBudgetLimit,
        addExpense,
        unreadCount,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

function getStatusText(status: Expense["status"]): string {
  return status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function paymentStatusText(status: PaymentStatus): string {
  return status === "partially-paid" ? "Partially Paid" : status === "paid" ? "Paid" : "Unpaid";
}

export function useDemoStore() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoProvider");
  return ctx;
}
