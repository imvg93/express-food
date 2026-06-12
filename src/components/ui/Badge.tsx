import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "purple" | "gray";

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variants: Record<Variant, string> = {
  default:  "bg-indigo-50  text-indigo-700  border border-indigo-200/80",
  success:  "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
  warning:  "bg-amber-50   text-amber-700   border border-amber-200/80",
  danger:   "bg-red-50     text-red-700     border border-red-200/80",
  info:     "bg-blue-50    text-blue-700    border border-blue-200/80",
  purple:   "bg-purple-50  text-purple-700  border border-purple-200/80",
  gray:     "bg-slate-100  text-slate-600   border border-slate-200/80",
};

const dots: Record<Variant, string> = {
  default: "bg-indigo-500", success: "bg-emerald-500", warning: "bg-amber-500",
  danger: "bg-red-500", info: "bg-blue-500", purple: "bg-purple-500", gray: "bg-slate-400",
};

export default function Badge({ variant = "default", children, className, dot }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full tracking-tight",
      variants[variant], className
    )}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dots[variant])} />}
      {children}
    </span>
  );
}
