"use client";
import { useState } from "react";
import { Save, Bell, DollarSign, Eye, Shield, Check } from "lucide-react";
import { toast } from "sonner";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    missingProofAlerts: true,
    reminderAlerts: true,
    alertThreshold: "80",
    budgetPeriod: "monthly",
    currency: "INR",
    dateFormat: "DD-Mon-YYYY",
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key as keyof typeof settings] }));

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-400 font-medium mt-0.5">System preferences and notification settings</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#1B3A5C]" />
            </div>
            <CardTitle>Notification Preferences</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-1">
          {[
            { key:"emailNotifications", label:"Email Notifications",          desc:"Receive email alerts for approvals and alerts"         },
            { key:"budgetAlerts",       label:"Budget Limit Alerts",           desc:"Alert when category spending crosses threshold"        },
            { key:"missingProofAlerts", label:"Missing Proof Alerts",          desc:"Daily reminder for entries without bill proof"         },
            { key:"reminderAlerts",     label:"Recurring Expense Reminders",   desc:"Alerts for upcoming due payments"                     },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => toggle(item.key as keyof typeof settings)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0",
                  settings[item.key as keyof typeof settings] ? "bg-[#1B3A5C]" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  settings[item.key as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Budget Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
            <CardTitle>Budget Settings</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">Alert Threshold</label>
              <span className="text-sm font-extrabold text-[#1B3A5C]">{settings.alertThreshold}%</span>
            </div>
            <input type="range" min={50} max={95} step={5}
              value={settings.alertThreshold}
              onChange={(e) => setSettings((s) => ({ ...s, alertThreshold: e.target.value }))}
              className="w-full h-2 accent-[#1B3A5C]"
            />
            <p className="text-xs text-slate-400 font-medium mt-1.5">
              Alert will trigger when spending crosses {settings.alertThreshold}% of limit
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Budget Period</label>
            <select value={settings.budgetPeriod}
              onChange={(e) => setSettings((s) => ({ ...s, budgetPeriod: e.target.value }))}
              className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none cursor-pointer font-medium">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
              <Eye className="w-4 h-4 text-slate-600" />
            </div>
            <CardTitle>Display Settings</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-1">
          {[
            { label:"Currency",    value:"INR (₹ Indian Rupee)"               },
            { label:"Date Format", value:"DD-Mon-YYYY (e.g., 12-Jun-2026)"    },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <span className="text-sm font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <CardTitle>System Information</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-1">
          {[
            ["System",        "Webresfolio Expense Control System"],
            ["Client",        "Rayudu Gari Military Hotel"        ],
            ["Version",       "1.0.0 — Demo"                      ],
            ["Developed By",  "Webresfolio, Hyderabad"            ],
            ["Contact",       "info@webresfolio.com"              ],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
              <span className="text-sm font-medium text-slate-500">{k}</span>
              <span className="text-sm font-semibold text-slate-800">{v}</span>
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={() => toast.success("Settings saved successfully.")} leftIcon={<Save className="w-3.5 h-3.5" />}>
        Save Settings
      </Button>
    </div>
  );
}
