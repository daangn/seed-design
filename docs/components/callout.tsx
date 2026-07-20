import { Callout as SeedSnippetCallout } from "seed-design/ui/callout";
import clsx from "clsx";
import type { ReactNode } from "react";

type FumadocsCalloutType = "info" | "warn" | "warning" | "error" | "success" | "idea";
type SeedTone = "neutral" | "informative" | "positive" | "warning" | "critical" | "magic";

/** Map Fumadocs callout `type` to a SEED Callout `tone`. */
const TONE_BY_TYPE: Record<FumadocsCalloutType, SeedTone> = {
  info: "informative",
  warn: "warning",
  warning: "warning",
  error: "critical",
  success: "positive",
  idea: "magic",
};

interface CalloutProps {
  type?: FumadocsCalloutType;
  title?: ReactNode;
  /** Accepted for Fumadocs MDX compat; SEED conveys meaning through `tone`. */
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * SEED Callout used as the MDX `Callout` (replaces Fumadocs' default). Maps the Fumadocs
 * `type` to a SEED `tone`; renders an optional title plus the body as the description.
 */
export function Callout({ type = "info", title, className, children }: CalloutProps) {
  return (
    <SeedSnippetCallout
      tone={TONE_BY_TYPE[type] ?? "neutral"}
      title={title}
      description={children}
      className={clsx("my-4", className)}
    />
  );
}
