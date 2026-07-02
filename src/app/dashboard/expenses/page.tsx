"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Wrench, Zap, Sparkles, Megaphone, Truck } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const EXPENSE_CATEGORIES = [
  { id: "goods", label: "Goods & Inventory", icon: ShoppingCart, color: "from-blue-500 to-[#1B3A5C]", href: "/dashboard/expenses/goods" },
  { id: "maintenance", label: "Maintenance & Repair", icon: Wrench, color: "from-orange-500 to-amber-600", href: "/dashboard/expenses/maintenance" },
  { id: "utilities", label: "Utilities", icon: Zap, color: "from-yellow-500 to-orange-500", href: "/dashboard/expenses/utilities" },
  { id: "cleaning", label: "Cleaning & Hygiene", icon: Sparkles, color: "from-green-500 to-emerald-600", href: "/dashboard/expenses/cleaning" },
  { id: "marketing", label: "Marketing & Promotion", icon: Megaphone, color: "from-purple-500 to-pink-600", href: "/dashboard/expenses/marketing" },
  { id: "transport", label: "Transport & Logistics", icon: Truck, color: "from-cyan-500 to-blue-600", href: "/dashboard/expenses/transport" },
];

export default function ExpensesPage() {
  const router = useRouter();

  // Auto-redirect to first category on desktop for backwards compatibility
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      router.push("/dashboard/expenses/goods");
    }
  }, [router]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Expense Categories</h1>
        <p className="text-sm md:text-base text-slate-500 mt-2">Select a category to view or manage expenses</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {EXPENSE_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => router.push(cat.href)}
                className={cn(
                  "w-full h-full text-left",
                  "bg-gradient-to-br rounded-2xl p-6",
                  "border border-white/20 shadow-lg",
                  "hover:shadow-2xl hover:-translate-y-1",
                  "active:scale-95",
                  "transition-all duration-200",
                  cat.color
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white/70 uppercase tracking-wider">View</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">{cat.label}</h3>
                <p className="text-sm text-white/75 mt-2">Manage and track {cat.label.toLowerCase()}</p>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Subtitle */}
      <div className="mt-6 text-center text-xs text-slate-500 md:hidden">
        Tap any category to view detailed expenses and receipts
      </div>
    </div>
  );
}
