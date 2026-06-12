"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}

export default function Drawer({ open, onClose, title, subtitle, children, width = "480px", footer }: DrawerProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ width }}
            className={cn(
              "relative bg-white h-full shadow-2xl z-10 flex flex-col",
              "border-l border-[#E5E7EB]"
            )}
          >
            <div className="flex items-start justify-between px-5 py-4 border-b border-[#F3F4F6] shrink-0">
              <div>
                {title && <h2 className="text-sm font-semibold text-[#111827]">{title}</h2>}
                {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors ml-4 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
            {footer && (
              <div className="px-5 py-4 border-t border-[#F3F4F6] shrink-0 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
