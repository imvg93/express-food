"use client";
import { useState } from "react";
import { Bell, Plus, Check, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input, { Select } from "@/components/ui/Input";
import { REMINDERS } from "@/data/reminders";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { Reminder } from "@/types";
import { cn } from "@/lib/utils";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(REMINDERS);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "utilities", amount: "", frequency: "monthly", dueDate: "" });

  const handleMarkPaid = (id: string) => {
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, isPaid: true, lastPaid: "2026-06-12" } : r));
    toast.success("Marked as paid.");
  };

  const handleAdd = () => {
    if (!form.name || !form.amount || !form.dueDate) { toast.error("Fill in all required fields."); return; }
    const newReminder: Reminder = {
      id: "r" + (reminders.length + 1),
      name: form.name,
      category: form.category as Reminder["category"],
      amount: Number(form.amount),
      frequency: form.frequency as Reminder["frequency"],
      dueDate: form.dueDate,
      isPaid: false,
    };
    setReminders((prev) => [...prev, newReminder]);
    toast.success("Reminder added.");
    setAddOpen(false);
    setForm({ name: "", category: "utilities", amount: "", frequency: "monthly", dueDate: "" });
  };

  const getDaysBadge = (days: number): "danger"|"warning"|"success" => {
    if (days <= 7) return "danger";
    if (days <= 14) return "warning";
    return "success";
  };

  const urgentCount = reminders.filter((r) => daysUntil(r.dueDate) <= 7 && !r.isPaid).length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Recurring Expense Reminders</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            <span className="text-slate-700 font-bold">{reminders.filter((r) => !r.isPaid).length}</span> upcoming &middot;{" "}
            <span className={cn("font-bold", urgentCount > 0 ? "text-red-600" : "text-slate-700")}>{urgentCount}</span> due this week
          </p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddOpen(true)}>
          Add Reminder
        </Button>
      </div>

      {/* Urgent alert */}
      {urgentCount > 0 && (
        <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-sm font-semibold text-red-800">
            <span className="font-bold">{urgentCount} payment{urgentCount > 1 ? "s" : ""}</span> due within 7 days — take action now
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((reminder, i) => {
          const days = daysUntil(reminder.dueDate);
          return (
            <motion.div key={reminder.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.04 }}>
              <div className={cn(
                "bg-white rounded-2xl border p-5 shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition-all",
                reminder.isPaid ? "opacity-50 border-slate-100"
                : days <= 7  ? "border-red-200 bg-gradient-to-br from-red-50/40 via-white to-white"
                : days <= 14 ? "border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-white"
                : "border-slate-200/80"
              )}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">{reminder.name}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 capitalize">{CATEGORY_LABELS[reminder.category]} · {reminder.frequency}</p>
                  </div>
                  <Badge variant={reminder.isPaid ? "success" : getDaysBadge(days)} dot>
                    {reminder.isPaid ? "Paid" : days < 0 ? "Overdue" : `${days} days`}
                  </Badge>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-[26px] font-extrabold text-slate-900 leading-none">{formatCurrency(reminder.amount)}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: <span className="font-semibold text-slate-600">{formatDate(reminder.dueDate)}</span>
                    </div>
                    {reminder.lastPaid && (
                      <p className="text-xs text-slate-400 mt-1">Last paid: {formatDate(reminder.lastPaid)}</p>
                    )}
                    {reminder.notes && (
                      <p className="text-xs text-slate-400 mt-1 italic">{reminder.notes}</p>
                    )}
                  </div>
                  {!reminder.isPaid && (
                    <Button variant="success" size="sm" leftIcon={<Check className="w-3.5 h-3.5" />}
                      onClick={() => handleMarkPaid(reminder.id)}>
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Recurring Reminder" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Reminder</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Reminder Name *" placeholder="e.g., Electricity Bill" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Select label="Category" value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            options={[
              { value:"utilities",   label:"Utilities"   },
              { value:"maintenance", label:"Maintenance" },
              { value:"cleaning",    label:"Cleaning"    },
              { value:"marketing",   label:"Marketing"   },
              { value:"goods",       label:"Goods"       },
            ]} />
          <Input label="Amount (₹) *" type="number" placeholder="0" value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
          <Select label="Frequency" value={form.frequency}
            onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
            options={[
              { value:"monthly",   label:"Monthly"   },
              { value:"quarterly", label:"Quarterly" },
              { value:"annual",    label:"Annual"    },
            ]} />
          <Input label="Next Due Date *" type="date" value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
