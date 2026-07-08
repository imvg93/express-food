export type Role = "owner" | "manager" | "supervisor";

export type ExpenseCategory =
  | "goods"
  | "maintenance"
  | "utilities"
  | "cleaning"
  | "marketing"
  | "transport"
  | "petty-cash";

export type ApprovalStatus =
  | "submitted"
  | "proof-uploaded"
  | "manager-verified"
  | "owner-approved"
  | "rejected";

export type PaymentMode = "Cash" | "UPI" | "Bank Transfer" | "Cheque";

// ─── Payment / Payables ──────────────────────────────────────────────────────
export type PaymentStatus = "unpaid" | "partially-paid" | "paid";

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: PaymentMode;
  reference?: string;      // Transaction / UPI / cheque reference number
  paidBy: string;
  hasProof: boolean;       // Payment proof attached (mandatory for a "paid" record)
  proofName?: string;      // e.g. "UPI_Screenshot_2606.jpg"
  notes?: string;
}

export type AttachmentType =
  | "bill"
  | "quotation"
  | "purchase-order"
  | "delivery-challan"
  | "warranty"
  | "payment-proof"
  | "other";

export interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
}

export type AuditAction =
  | "expense-created"
  | "expense-updated"
  | "payment-added"
  | "payment-edited"
  | "payment-deleted"
  | "proof-uploaded"
  | "bill-uploaded"
  | "status-changed";

export interface AuditEntry {
  id: string;
  expenseId: string;
  expenseLabel: string;
  action: AuditAction;
  label: string;
  user: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
}

export interface ApprovalStep {
  stage: ApprovalStatus;
  label: string;
  doneBy?: string;
  doneAt?: string;
  comment?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  subCategory?: string;
  itemDescription: string;
  vendorId: string;
  vendorName: string;
  quantity?: number;
  unit?: string;
  rate?: number;
  amount: number;
  paymentMode: PaymentMode;
  paymentRef?: string;
  status: ApprovalStatus;
  // ── Payment / Payables ──
  paymentStatus: PaymentStatus;
  amountPaid: number;            // derived from payments[], stored for convenience
  payments: PaymentRecord[];
  invoiceDate?: string;
  dueDate?: string;
  creditDays?: number;
  branch?: string;
  attachments?: Attachment[];
  submittedBy: string;
  submittedById: string;
  hasBillProof: boolean;
  billProofUrl?: string;
  approvalHistory: ApprovalStep[];
  notes?: string;
  // Maintenance specific
  assetName?: string;
  technicianName?: string;
  technicianPhone?: string;
  // Utilities specific
  billNumber?: string;
  billingPeriod?: string;
  // Transport specific
  vehicleRoute?: string;
}

export interface PettyCashEntry {
  id: string;
  date: string;
  description: string;
  subCategory: string;
  amount: number;
  submittedBy: string;
  receiptAvailable: boolean;
  note?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: ExpenseCategory;
  vendorCode?: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  location: string;
  gstin?: string;
  pan?: string;
  billingAddress?: string;
  bankDetails?: string;
  paymentTerms?: string;
  creditDays?: number;
  totalPaid: number;
  transactionCount: number;
  lastPaymentDate: string;
  avgTransactionValue: number;
  isActive: boolean;
  tags?: string[];
  paymentHistory: { month: string; amount: number }[];
}

// Rollup computed from a vendor's expenses (see lib/payables.ts)
export interface VendorOutstanding {
  totalPurchase: number;
  totalPaid: number;
  totalPending: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  pendingBills: number;
  overdueAmount: number;
  upcomingDue: number;      // amount due within the next 7 days
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  avatar?: string;
  initials: string;
  department?: string;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  label: string;
  monthlyLimit: number;
  currentSpend: number;
  alertThreshold: number;
}

export interface Reminder {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  frequency: "monthly" | "quarterly" | "annual";
  dueDate: string;
  lastPaid?: string;
  isPaid: boolean;
  notes?: string;
}

export interface Notification {
  id: string;
  type: "budget-alert" | "missing-proof" | "approval-request" | "reminder" | "approval-done";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface DailyExpense {
  date: string;
  amount: number;
}

export interface CategoryBreakdown {
  category: string;
  label: string;
  amount: number;
  color: string;
}

export interface MonthlyReport {
  month: string;
  totalExpenses: number;
  verifiedPercentage: number;
  missingProofs: number;
  categoryBreakdown: CategoryBreakdown[];
  dailyTrend: DailyExpense[];
  topVendor: string;
  largestExpense: { description: string; amount: number };
}
