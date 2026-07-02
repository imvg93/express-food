"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload as UploadIcon, FileText, DollarSign, User } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface PaymentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentUploadModal({ isOpen, onClose }: PaymentUploadModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    amount: "",
    vendor: "",
    category: "",
    description: "",
    paymentMode: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setStep(1);
    setFormData({ amount: "", vendor: "", category: "", description: "", paymentMode: "" });
    setFile(null);
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (!formData.amount || !formData.vendor || !formData.category || !formData.paymentMode) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a payment slip");
      return;
    }

    setLoading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Payment details uploaded successfully! Amount: ₹${formData.amount}`);
      handleClose();
    } catch (error) {
      toast.error("Failed to upload payment details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-[#1B3A5C] text-white p-4 md:p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg md:text-xl font-bold">Payment Slip Upload</h2>
                  <p className="text-blue-100 text-xs md:text-sm mt-1">Step {step} of 2</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-slate-100">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-blue-500"
                />
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 space-y-4">
                {step === 1 ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <Input
                        label="Payment Amount*"
                        type="number"
                        placeholder="Enter amount (₹)"
                        leftIcon={<DollarSign className="w-4 h-4" />}
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />

                      <Input
                        label="Vendor Name*"
                        placeholder="Enter vendor name"
                        leftIcon={<User className="w-4 h-4" />}
                        value={formData.vendor}
                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      />

                      <Select
                        label="Category*"
                        placeholder="Select category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        options={[
                          { value: "goods", label: "Goods & Inventory" },
                          { value: "maintenance", label: "Maintenance & Repair" },
                          { value: "utilities", label: "Utilities" },
                          { value: "cleaning", label: "Cleaning & Hygiene" },
                          { value: "marketing", label: "Marketing & Promotion" },
                          { value: "transport", label: "Transport & Logistics" },
                        ]}
                      />

                      <Select
                        label="Payment Mode*"
                        placeholder="Select payment mode"
                        value={formData.paymentMode}
                        onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                        options={[
                          { value: "cash", label: "Cash" },
                          { value: "upi", label: "UPI" },
                          { value: "bank", label: "Bank Transfer" },
                          { value: "cheque", label: "Cheque" },
                        ]}
                      />

                      <Textarea
                        label="Description"
                        placeholder="Add any notes or details..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Summary */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                        <h3 className="text-sm font-bold text-slate-900">Payment Summary</h3>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Amount:</span>
                            <span className="font-bold text-slate-900">₹{formData.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Vendor:</span>
                            <span className="font-bold text-slate-900">{formData.vendor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Mode:</span>
                            <span className="font-bold text-slate-900 capitalize">{formData.paymentMode}</span>
                          </div>
                        </div>
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                          Payment Slip*
                        </label>
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={cn(
                            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                            isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50",
                            file && "border-green-500 bg-green-50"
                          )}
                        >
                          <input
                            type="file"
                            onChange={handleFileSelect}
                            accept="image/*,.pdf"
                            className="hidden"
                            id="file-input"
                          />
                          <label htmlFor="file-input" className="cursor-pointer">
                            {file ? (
                              <>
                                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-sm font-bold text-green-700">{file.name}</p>
                                <p className="text-xs text-green-600 mt-1">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </>
                            ) : (
                              <>
                                <UploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm font-bold text-slate-700">Drag and drop your file</p>
                                <p className="text-xs text-slate-500 mt-1">or click to browse</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 text-center">
                        Supported: Images (JPG, PNG) and PDF • Max 10MB
                      </p>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 md:p-6 flex gap-3">
                {step === 2 && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant={step === 1 ? "primary" : "success"}
                  className="flex-1"
                  loading={loading}
                  onClick={step === 1 ? handleNext : handleSubmit}
                >
                  {step === 1 ? "Next" : "Upload & Submit"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
