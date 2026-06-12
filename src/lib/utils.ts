import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApprovalStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const formatted = formatDate(dateStr);
  const hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");
  return `${formatted}, ${displayHours}:${mins} ${ampm}`;
}

export function getStatusColor(status: ApprovalStatus): string {
  switch (status) {
    case "submitted": return "bg-gray-100 text-gray-700";
    case "proof-uploaded": return "bg-blue-100 text-blue-700";
    case "manager-verified": return "bg-purple-100 text-purple-700";
    case "owner-approved": return "bg-green-100 text-green-700";
    case "rejected": return "bg-red-100 text-red-700";
  }
}

export function getStatusLabel(status: ApprovalStatus): string {
  switch (status) {
    case "submitted": return "Pending Proof";
    case "proof-uploaded": return "Awaiting Manager";
    case "manager-verified": return "Awaiting Owner";
    case "owner-approved": return "Approved";
    case "rejected": return "Rejected";
  }
}

export function getBudgetColor(pct: number): string {
  if (pct >= 100) return "bg-red-600";
  if (pct >= 80) return "bg-red-500";
  if (pct >= 60) return "bg-amber-500";
  return "bg-green-500";
}

export function getBudgetTextColor(pct: number): string {
  if (pct >= 80) return "text-red-600";
  if (pct >= 60) return "text-amber-600";
  return "text-green-600";
}

export function daysSince(dateStr: string): number {
  const now = new Date("2026-06-12");
  const date = new Date(dateStr);
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function daysUntil(dateStr: string): number {
  const now = new Date("2026-06-12");
  const date = new Date(dateStr);
  return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateId(): string {
  return "EXP-" + Math.random().toString(36).substr(2, 6).toUpperCase();
}
