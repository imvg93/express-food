"use client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { date: string; amount: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-lg px-3 py-2">
        <p className="text-xs text-[#6B7280]">{label}</p>
        <p className="text-sm font-bold text-[#111827]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function ExpenseLineChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.date.split("-").slice(1).join("/"),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1B3A5C" stopOpacity={0.12} />
            <stop offset="95%" stopColor="#1B3A5C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="amount" stroke="#1B3A5C" strokeWidth={2}
          fill="url(#expGrad)" dot={false} activeDot={{ r: 4, fill: "#1B3A5C" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
