"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({ open, onClose, title, children, size = "md", footer }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "relative bg-white rounded-2xl shadow-xl w-full z-10",
              "border border-[#E5E7EB]",
              sizes[size]
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
                <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="px-6 py-5">{children}</div>
            {footer && (
              <div className="px-6 py-4 border-t border-[#F3F4F6] flex items-center justify-end gap-3">
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
