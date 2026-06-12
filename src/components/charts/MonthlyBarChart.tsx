"use client";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-lg px-3 py-2 text-xs">
        <p className="font-semibold text-[#111827] mb-1">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-[#6B7280]">{p.name}:</span>
            <span className="font-medium">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface Props {
  data: { month: string; goods: number; maintenance: number; utilities: number; cleaning: number; marketing: number; transport: number; pettyCache: number }[];
  simplified?: boolean;
}

export default function MonthlyBarChart({ data, simplified }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={8}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        {!simplified && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />}
        <Bar dataKey="goods" name="Goods" fill="#1B3A5C" radius={[2, 2, 0, 0]} />
        <Bar dataKey="utilities" name="Utilities" fill="#3B82F6" radius={[2, 2, 0, 0]} />
        <Bar dataKey="maintenance" name="Maintenance" fill="#E67E22" radius={[2, 2, 0, 0]} />
        {!simplified && <Bar dataKey="cleaning" name="Cleaning" fill="#22C55E" radius={[2, 2, 0, 0]} />}
        {!simplified && <Bar dataKey="marketing" name="Marketing" fill="#8B5CF6" radius={[2, 2, 0, 0]} />}
      </BarChart>
    </ResponsiveContainer>
  );
}
