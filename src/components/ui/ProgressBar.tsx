"use client";
import { motion } from "framer-motion";
import { cn, getBudgetColor, getBudgetTextColor } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
  height?: "sm" | "md";
}

export default function ProgressBar({ value, max, label, showPercent, className, height = "md" }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-xs text-[#6B7280]">{label}</span>}
          {showPercent && (
            <span className={cn("text-xs font-medium", getBudgetTextColor(pct))}>
              {pct}%
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-[#F1F5F9] rounded-full overflow-hidden", height === "sm" ? "h-1.5" : "h-2")}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", getBudgetColor(pct))}
        />
      </div>
    </div>
  );
}
