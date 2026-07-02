"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon?: React.ReactNode;
  iconBg?: string;
  alert?: "warning" | "danger";
  onClick?: () => void;
  animateNumber?: boolean;
  rawNumber?: number;
}

export default function KPICard({ title, value, subtitle, trend, icon, iconBg = "bg-slate-100",
  alert, onClick, animateNumber, rawNumber }: KPICardProps) {

  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (!animateNumber || !rawNumber) return;
    let s = 0; const step = rawNumber / 50;
    const id = setInterval(() => {
      s += step;
      if (s >= rawNumber) { setDisplayed(rawNumber); clearInterval(id); } else setDisplayed(Math.round(s));
    }, 20);
    return () => clearInterval(id);
  }, [animateNumber, rawNumber]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div
        onClick={onClick}
        className={cn(
          "bg-white rounded-2xl border p-4 md:p-5 relative overflow-hidden transition-all duration-200",
          "shadow-[0_1px_4px_rgba(15,23,42,0.06),0_0_0_1px_rgba(15,23,42,0.02)]",
          onClick && "cursor-pointer hover:shadow-[0_6px_20px_rgba(15,23,42,0.1)] hover:-translate-y-0.5 active:scale-95",
          alert === "warning" ? "border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-white"
          : alert === "danger"  ? "border-red-200   bg-gradient-to-br from-red-50/70   via-white to-white"
          : "border-slate-200/80"
        )}
      >
        {/* Alert pulse dot */}
        {alert && (
          <span className={cn(
            "absolute top-3 right-3 w-2.5 h-2.5 rounded-full ring-4",
            alert === "warning" ? "bg-amber-400 ring-amber-100" : "bg-red-500 ring-red-100"
          )} />
        )}

        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">{title}</p>
          {icon && (
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", iconBg)}>
              {icon}
            </div>
          )}
        </div>

        <p className={cn(
          "text-2xl md:text-[28px] font-extrabold tracking-tight leading-none",
          alert === "warning" ? "text-amber-700"
          : alert === "danger"  ? "text-red-700"
          : "text-slate-900"
        )}>
          {animateNumber && rawNumber ? displayed.toLocaleString("en-IN") : value}
        </p>

        {subtitle && <p className="text-xs text-slate-400 font-medium mt-2">{subtitle}</p>}

        {trend && (
          <div className={cn(
            "flex items-center gap-1 mt-3 text-xs font-bold",
            trend.value >= 0 ? "text-emerald-600" : "text-red-500"
          )}>
            {trend.value >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </div>
    </motion.div>
  );
}
