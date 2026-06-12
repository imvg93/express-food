import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };

export default function Card({ children, className, hover, onClick, padding = "md" }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80",
        "shadow-[0_1px_4px_rgba(15,23,42,0.06),0_0_0_1px_rgba(15,23,42,0.02)]",
        hover && "cursor-pointer hover:shadow-[0_4px_16px_rgba(15,23,42,0.1)] hover:border-slate-300 transition-all duration-200",
        onClick && "cursor-pointer",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-sm font-bold text-slate-800 tracking-tight", className)}>{children}</h3>;
}
