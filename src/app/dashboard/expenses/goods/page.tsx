"use client";
import { useState } from "react";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ExpenseDetailDrawer from "@/components/expenses/ExpenseDetailDrawer";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import { useDemoStore } from "@/store/demoStore";
import type { Expense } from "@/types";

export default function GoodsExpensePage() {
  const { expenses } = useDemoStore();
  const [selected, setSelected] = useState<Expense | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const goods = expenses.filter((e) => e.category === "goods");
  const total = goods.reduce((s, e) => s + e.amount, 0);
  return (
    <div className="h-full flex flex-col">
      <ExpenseTable
        expenses={goods}
        onRowClick={setSelected}
        onAdd={() => setAddOpen(true)}
        title="Goods & Inventory Expenses"
        totalThisMonth={total}
      />
      <ExpenseDetailDrawer expense={selected} open={!!selected} onClose={() => setSelected(null)} />
      <AddExpenseModal open={addOpen} onClose={() => setAddOpen(false)} category="goods" categoryLabel="Goods & Inventory" />
    </div>
  );
}
