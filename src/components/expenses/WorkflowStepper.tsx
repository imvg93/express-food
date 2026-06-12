import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalStatus, ApprovalStep } from "@/types";
import { formatDateTime } from "@/lib/utils";

const STAGES: { key: ApprovalStatus; label: string }[] = [
  { key: "submitted",        label: "Submitted"        },
  { key: "proof-uploaded",   label: "Proof Uploaded"   },
  { key: "manager-verified", label: "Manager Verified" },
  { key: "owner-approved",   label: "Owner Approved"   },
];

const STAGE_ORDER: Record<ApprovalStatus, number> = {
  submitted:          0,
  "proof-uploaded":   1,
  "manager-verified": 2,
  "owner-approved":   3,
  rejected:          -1,
};

interface Props {
  status: ApprovalStatus;
  history: ApprovalStep[];
}

export default function WorkflowStepper({ status, history }: Props) {
  const currentIdx = STAGE_ORDER[status] ?? -1;
  const isRejected = status === "rejected";

  return (
    <div className="px-5 py-5">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Approval Progress</p>
      <div className="relative">
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100" />
        <div className="space-y-5">
          {STAGES.map((stage, idx) => {
            const done    = !isRejected && idx <= currentIdx;
            const active  = !isRejected && idx === currentIdx;
            const historyStep = history.find((h) => h.stage === stage.key);
            return (
              <div key={stage.key} className="flex items-start gap-3.5 relative">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all",
                  done && !active ? "bg-emerald-100 border-2 border-emerald-500" :
                  active          ? "bg-[#1B3A5C] border-2 border-[#1B3A5C] shadow-md shadow-[#1B3A5C]/20" :
                  "bg-white border-2 border-slate-200"
                )}>
                  {done && !active ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : active ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <div className="pt-1 min-w-0">
                  <p className={cn(
                    "text-sm font-semibold",
                    done || active ? "text-slate-900" : "text-slate-400"
                  )}>
                    {stage.label}
                  </p>
                  {historyStep && (
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {historyStep.doneBy} · {formatDateTime(historyStep.doneAt || "")}
                    </p>
                  )}
                  {historyStep?.comment && (
                    <p className="text-xs text-red-500 font-medium mt-0.5 italic">"{historyStep.comment}"</p>
                  )}
                </div>
              </div>
            );
          })}
          {isRejected && (
            <div className="flex items-start gap-3.5 relative">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 bg-red-100 border-2 border-red-500">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <div className="pt-1 min-w-0">
                <p className="text-sm font-bold text-red-600">Rejected</p>
                {history.find((h) => h.stage === "rejected") && (
                  <>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {history.find((h) => h.stage === "rejected")?.doneBy} · {formatDateTime(history.find((h) => h.stage === "rejected")?.doneAt || "")}
                    </p>
                    {history.find((h) => h.stage === "rejected")?.comment && (
                      <p className="text-xs text-red-500 font-medium mt-0.5 italic">
                        "{history.find((h) => h.stage === "rejected")?.comment}"
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
