"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

const data = [
  { week: "W1 Jun", cashOut: 48200, verified: 39800 },
  { week: "W2 Jun", cashOut: 38420, verified: 31870 },
  { week: "W3 Jun", cashOut: 0, verified: 0 },
  { week: "W4 Jun", cashOut: 0, verified: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-lg px-3 py-2 text-xs">
        <p className="font-semibold text-[#111827] mb-1">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.stroke }} />
            <span className="text-[#6B7280]">{p.dataKey === "cashOut" ? "Cash Out" : "Verified"}:</span>
            <span className="font-medium">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CashLeakageChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="verGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="cashOut" stroke="#EF4444" strokeWidth={2} fill="url(#cashGrad)" dot={false} />
        <Area type="monotone" dataKey="verified" stroke="#22C55E" strokeWidth={2} fill="url(#verGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
