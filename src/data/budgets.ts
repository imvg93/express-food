import type { Budget } from "@/types";

export const BUDGETS: Budget[] = [
  { id: "b1", category: "goods", label: "Goods & Inventory", monthlyLimit: 90000, currentSpend: 68450, alertThreshold: 80 },
  { id: "b2", category: "maintenance", label: "Maintenance & Repair", monthlyLimit: 20000, currentSpend: 13500, alertThreshold: 80 },
  { id: "b3", category: "utilities", label: "Utilities", monthlyLimit: 30000, currentSpend: 27000, alertThreshold: 80 },
  { id: "b4", category: "cleaning", label: "Cleaning & Hygiene", monthlyLimit: 10000, currentSpend: 8150, alertThreshold: 80 },
  { id: "b5", category: "marketing", label: "Marketing & Promotion", monthlyLimit: 8000, currentSpend: 6960, alertThreshold: 80 },
  { id: "b6", category: "transport", label: "Transport & Logistics", monthlyLimit: 8000, currentSpend: 4040, alertThreshold: 80 },
  { id: "b7", category: "petty-cash", label: "Petty Cash", monthlyLimit: 6000, currentSpend: 2000, alertThreshold: 80 },
];
