import { cn } from "@/lib/utils";
import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {icon && (
        <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4 text-[#94A3B8]">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-[#374151]">{title}</p>
      {description && (
        <p className="text-xs text-[#6B7280] mt-1 max-w-xs">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
