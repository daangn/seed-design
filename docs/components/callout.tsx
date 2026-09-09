import { Callout as SeedSnippetCallout } from "seed-design/ui/callout";
import { clsx } from "cn";
import type { CalloutType } from "fumadocs-ui/components/callout";
import type { ComponentProps, ReactNode } from "react";
import { match } from "ts-pattern";

type SeedTone = NonNullable<ComponentProps<typeof SeedSnippetCallout>["tone"]>;

/**
 * Map Fumadocs callout `type` to a SEED Callout `tone`. A type added upstream fails the build
 * here, and an MDX author's typo — MDX isn't type-checked — throws during the static export.
 */
const toneOf = (type: CalloutType) =>
  match<CalloutType, SeedTone>(type)
    .with("info", () => "informative")
    .with("warn", "warning", () => "warning")
    .with("error", () => "critical")
    .with("success", () => "positive")
    .with("idea", () => "magic")
    .exhaustive();

interface CalloutProps {
  type?: CalloutType;
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
      tone={toneOf(type)}
      title={title}
      description={children}
      className={clsx("my-4", className)}
    />
  );
}
