import type { Role, ExpenseCategory } from "@/types";

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  goods: "Goods & Inventory",
  maintenance: "Maintenance & Repair",
  utilities: "Utilities",
  cleaning: "Cleaning & Hygiene",
  marketing: "Marketing & Promotion",
  transport: "Transport & Logistics",
  "petty-cash": "Petty Cash",
};

export const CATEGORY_COLORS: Record<string, string> = {
  goods: "#1B3A5C",
  maintenance: "#E67E22",
  utilities: "#3B82F6",
  cleaning: "#22C55E",
  marketing: "#8B5CF6",
  transport: "#06B6D4",
  "petty-cash": "#F59E0B",
};

export const APPROVAL_STAGES = [
  { key: "submitted", label: "Submitted", description: "Supervisor entered the expense" },
  { key: "proof-uploaded", label: "Proof Uploaded", description: "Bill / receipt attached" },
  { key: "manager-verified", label: "Manager Verified", description: "Operations Manager reviewed" },
  { key: "owner-approved", label: "Owner Approved", description: "Final approval by owner" },
];

export const PAYMENT_MODES = ["Cash", "UPI", "Bank Transfer", "Cheque"];

export const GOODS_SUB_CATEGORIES = [
  "Chicken & Poultry",
  "Mutton & Meat",
  "Fish & Seafood",
  "Rice & Grains",
  "Cooking Oil & Ghee",
  "Vegetables & Produce",
  "Spices & Masalas",
  "Packaging & Containers",
  "Dairy Products",
  "Other Groceries",
];

export const MAINTENANCE_SUB_CATEGORIES = [
  "AC Repair & Servicing",
  "Fridge / Freezer Repair",
  "Electrical Work",
  "Plumbing Repairs",
  "Generator Repair",
  "Kitchen Equipment Repair",
  "Chair & Table Repair",
  "Flooring / Civil Work",
  "Water Pump Repair",
  "Other Maintenance",
];

export const UTILITY_SUB_CATEGORIES = [
  "Electricity (EB)",
  "Water Charges",
  "Gas / LPG Cylinder",
  "Internet & Broadband",
  "Diesel for Generator",
];

export const CLEANING_SUB_CATEGORIES = [
  "Cleaning Liquids & Chemicals",
  "Pest Control Service",
  "Kitchen Deep Cleaning",
  "Floor Cleaning Materials",
  "Waste Disposal Charges",
];

export const MARKETING_SUB_CATEGORIES = [
  "Flex Boards & Banners",
  "Menu Card Printing",
  "Social Media Promotions",
  "Event / Festival Offers",
  "Photography / Video",
];

export const TRANSPORT_SUB_CATEGORIES = [
  "Goods Transport Charges",
  "Fuel Expenses",
  "Toll / Parking Fees",
  "Vehicle Maintenance",
  "Delivery Charges",
];

export const PETTY_CASH_SUB_CATEGORIES = [
  "Local Market Purchase",
  "Quick Repair",
  "Stationery & Supplies",
  "Miscellaneous Transport",
  "Emergency Cleaning",
  "Staff Welfare",
  "Miscellaneous",
];

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export const ROLE_NAV: Record<Role, NavItem[]> = {
  owner: [
    { label: "Dashboard", href: "/dashboard/owner", icon: "LayoutDashboard" },
    { label: "Approvals", href: "/dashboard/approvals", icon: "CheckSquare", badge: 7 },
    {
      label: "Expenses",
      href: "/dashboard/expenses",
      icon: "Receipt",
      children: [
        { label: "Goods & Inventory", href: "/dashboard/expenses/goods", icon: "ShoppingCart" },
        { label: "Maintenance & Repair", href: "/dashboard/expenses/maintenance", icon: "Wrench" },
        { label: "Utilities", href: "/dashboard/expenses/utilities", icon: "Zap" },
        { label: "Cleaning & Hygiene", href: "/dashboard/expenses/cleaning", icon: "Sparkles" },
        { label: "Marketing", href: "/dashboard/expenses/marketing", icon: "Megaphone" },
        { label: "Transport", href: "/dashboard/expenses/transport", icon: "Truck" },
      ],
    },
    { label: "Petty Cash", href: "/dashboard/petty-cash", icon: "Wallet" },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: "BarChart3",
      children: [
        { label: "Monthly Reports", href: "/dashboard/reports", icon: "FileText" },
        { label: "Cash Leakage", href: "/dashboard/cash-leakage", icon: "TrendingDown" },
      ],
    },
    {
      label: "Control",
      href: "/dashboard/budgets",
      icon: "Shield",
      children: [
        { label: "Budget Limits", href: "/dashboard/budgets", icon: "PieChart" },
        { label: "Missing Proofs", href: "/dashboard/missing-proofs", icon: "AlertCircle", badge: 3 },
        { label: "Recurring Reminders", href: "/dashboard/reminders", icon: "Bell" },
        { label: "Vendor Management", href: "/dashboard/vendors", icon: "Building2" },
        { label: "Audit Trail", href: "/dashboard/audit", icon: "History" },
      ],
    },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  manager: [
    { label: "Dashboard", href: "/dashboard/manager", icon: "LayoutDashboard" },
    { label: "Verify Expenses", href: "/dashboard/approvals", icon: "CheckSquare", badge: 4 },
    {
      label: "Expenses",
      href: "/dashboard/expenses",
      icon: "Receipt",
      children: [
        { label: "Goods & Inventory", href: "/dashboard/expenses/goods", icon: "ShoppingCart" },
        { label: "Maintenance & Repair", href: "/dashboard/expenses/maintenance", icon: "Wrench" },
        { label: "Utilities", href: "/dashboard/expenses/utilities", icon: "Zap" },
        { label: "Cleaning & Hygiene", href: "/dashboard/expenses/cleaning", icon: "Sparkles" },
        { label: "Marketing", href: "/dashboard/expenses/marketing", icon: "Megaphone" },
        { label: "Transport", href: "/dashboard/expenses/transport", icon: "Truck" },
      ],
    },
    { label: "Petty Cash", href: "/dashboard/petty-cash", icon: "Wallet" },
    { label: "Monthly Reports", href: "/dashboard/reports", icon: "BarChart3" },
    { label: "Vendor Management", href: "/dashboard/vendors", icon: "Building2" },
    { label: "Missing Proofs", href: "/dashboard/missing-proofs", icon: "AlertCircle" },
    { label: "Audit Trail", href: "/dashboard/audit", icon: "History" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  supervisor: [
    { label: "Dashboard", href: "/dashboard/supervisor", icon: "LayoutDashboard" },
    {
      label: "My Entries",
      href: "/dashboard/expenses",
      icon: "Receipt",
      children: [
        { label: "Goods & Inventory", href: "/dashboard/expenses/goods", icon: "ShoppingCart" },
        { label: "Maintenance & Repair", href: "/dashboard/expenses/maintenance", icon: "Wrench" },
        { label: "Utilities", href: "/dashboard/expenses/utilities", icon: "Zap" },
        { label: "Cleaning & Hygiene", href: "/dashboard/expenses/cleaning", icon: "Sparkles" },
        { label: "Marketing", href: "/dashboard/expenses/marketing", icon: "Megaphone" },
        { label: "Transport", href: "/dashboard/expenses/transport", icon: "Truck" },
      ],
    },
    { label: "Petty Cash", href: "/dashboard/petty-cash", icon: "Wallet" },
    { label: "Proof Upload Queue", href: "/dashboard/missing-proofs", icon: "Upload", badge: 2 },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
};
