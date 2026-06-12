import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-9 px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl",
              "text-slate-800 placeholder-slate-400 font-medium",
              "focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/60",
              "transition-all duration-150",
              leftIcon && "pl-9",
              error && "border-red-300 focus:border-red-400 focus:ring-red-300/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full h-9 px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl",
            "text-slate-800 font-medium",
            "focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/60",
            "transition-all duration-150 cursor-pointer",
            error && "border-red-300",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl",
            "text-slate-800 placeholder-slate-400 font-medium resize-none",
            "focus:outline-none focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C]/60",
            "transition-all duration-150",
            error && "border-red-300",
            className
          )}
          rows={3}
          {...props}
        />
        {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
