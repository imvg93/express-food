"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Role, Expense, Budget, Notification } from "@/types";
import { EXPENSES } from "@/data/expenses";
import { BUDGETS } from "@/data/budgets";
import { NOTIFICATIONS } from "@/data/notifications";

interface DemoState {
  role: Role;
  expenses: Expense[];
  budgets: Budget[];
  notifications: Notification[];
  setRole: (role: Role) => void;
  updateExpenseStatus: (id: string, status: Expense["status"], comment?: string, doneBy?: string) => void;
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

  const updateExpenseStatus = useCallback(
    (id: string, status: Expense["status"], comment?: string, doneBy?: string) => {
      setExpenses((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          const newStep = {
            stage: status,
            label:
              status === "owner-approved"
                ? "Owner Approved"
                : status === "rejected"
                ? "Rejected"
                : status === "manager-verified"
                ? "Manager Verified"
                : status === "proof-uploaded"
                ? "Proof Uploaded"
                : "Submitted",
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
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const updateBudgetLimit = useCallback((id: string, limit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, monthlyLimit: limit } : b))
    );
  }, []);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DemoContext.Provider
      value={{
        role,
        expenses,
        budgets,
        notifications,
        setRole,
        updateExpenseStatus,
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

export function useDemoStore() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoProvider");
  return ctx;
}
