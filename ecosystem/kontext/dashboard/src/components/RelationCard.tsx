import { useState } from "react";
import { ChevronDown, ChevronRight, Check, X, Minus, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RelationGroup } from "@/types";

interface RelationCardProps {
  group: RelationGroup;
}

export function RelationCard({ group }: RelationCardProps) {
  const [open, setOpen] = useState(true);
  const existCount = group.affects.filter((a) => a.exists).length;
  const totalCount = group.affects.length;

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-accent/30"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-foreground/90">
          {formatWhen(group.when)}
        </code>
        <Badge
          variant="outline"
          className={cn(
            "h-5 shrink-0 px-1.5 text-[10px] font-mono tabular-nums",
            existCount === totalCount
              ? "border-[oklch(0.65_0.18_155/0.3)] text-[oklch(0.65_0.18_155)]"
              : "border-[oklch(0.55_0.2_25/0.3)] text-[oklch(0.55_0.2_25)]",
          )}
        >
          {existCount}/{totalCount}
        </Badge>
      </button>

      {open && (
        <div className="border-t border-border px-3 py-2 space-y-1">
          {group.affects.map((file) => (
            <div
              key={file.path}
              className="group flex items-start gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/20"
            >
              <span className="mt-0.5 shrink-0">
                {file.exists ? (
                  <Check className="h-3.5 w-3.5 text-[oklch(0.65_0.18_155)]" />
                ) : file.optional ? (
                  <Minus className="h-3.5 w-3.5 text-[oklch(0.75_0.15_85)]" />
                ) : (
                  <X className="h-3.5 w-3.5 text-[oklch(0.55_0.2_25)]" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <code
                    className={cn(
                      "truncate font-mono text-[12px]",
                      file.exists
                        ? "text-foreground/80"
                        : file.optional
                          ? "text-muted-foreground"
                          : "text-[oklch(0.55_0.2_25)]",
                    )}
                  >
                    {file.path}
                  </code>
                  {file.generated && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Zap className="h-3 w-3 shrink-0 text-primary" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="font-mono text-xs">
                        {file.command ?? "auto-generated"}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {file.optional && (
                    <span className="text-[10px] text-muted-foreground/60">optional</span>
                  )}
                </div>
                {file.reason && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground/60 leading-tight">
                    {file.reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatWhen(when: string): string {
  const parts = when.split("/");
  if (parts.length > 3) {
    return `.../${parts.slice(-2).join("/")}`;
  }
  return when;
}
