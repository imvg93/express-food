"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { CategoryBreakdown } from "@/types";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-lg px-3 py-2">
        <p className="text-xs font-medium text-[#111827]">{payload[0].name}</p>
        <p className="text-sm font-bold text-[#111827]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryDonutChart({ data }: { data: CategoryBreakdown[] }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0" style={{ width: 140, height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
              dataKey="amount" nameKey="label" paddingAngle={2} strokeWidth={0}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-1.5 min-w-0">
        {data.map((d) => (
          <div key={d.category} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-[11px] text-[#6B7280] truncate flex-1">{d.label}</span>
            <span className="text-[11px] font-medium text-[#374151] shrink-0">
              {Math.round((d.amount / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
