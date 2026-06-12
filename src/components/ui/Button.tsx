"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "success";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#1B3A5C] text-white hover:bg-[#243F6B] active:bg-[#122840] shadow-sm shadow-[#1B3A5C]/30 hover:shadow-md hover:shadow-[#1B3A5C]/25",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 border border-slate-200",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-600/30",
  outline:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-600/25",
};

const sizes: Record<Size, string> = {
  xs: "px-2.5 py-1 text-xs gap-1 rounded-lg h-7",
  sm: "px-3.5 py-1.5 text-xs gap-1.5 rounded-lg h-8",
  md: "px-4 py-2 text-sm gap-2 rounded-xl h-9",
  lg: "px-5 py-2.5 text-sm gap-2 rounded-xl h-10",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, leftIcon, rightIcon, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
);
Button.displayName = "Button";
export default Button;
