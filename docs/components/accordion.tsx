import { IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import {
  AccordionBody,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionSuffixIcon,
  AccordionTitle,
  AccordionTrigger,
} from "@seed-design/react";
import { clsx } from "cn";
import type { ReactNode } from "react";

interface AccordionsProps {
  /** Fumadocs API: "single" allows one open item, "multiple" allows many. */
  type?: "single" | "multiple";
  className?: string;
  children?: ReactNode;
}

/** Container — replaces Fumadocs' `Accordions`. */
export function Accordions({ type = "single", className, children }: AccordionsProps) {
  return (
    <AccordionRoot
      variant="separated"
      multiple={type === "multiple"}
      className={clsx("my-4", className)}
    >
      {children}
    </AccordionRoot>
  );
}

interface AccordionProps {
  title?: ReactNode;
  /** Stable item id used for open/close state (falls back to the title text). */
  id?: string;
  children?: ReactNode;
}

/** Item — replaces Fumadocs' `Accordion`. */
export function Accordion({ title, id, children }: AccordionProps) {
  const value = id ?? (typeof title === "string" ? title : "");

  return (
    <AccordionItem value={value}>
      {/* not-prose on the header: it renders a heading element, and MDX prose would
          otherwise add a margin-top (empty gap above the trigger). The body keeps prose. */}
      <AccordionHeader className="not-prose">
        <AccordionTrigger>
          <AccordionTitle>{title}</AccordionTitle>
          <AccordionSuffixIcon>
            <IconChevronDownLine />
          </AccordionSuffixIcon>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent>
        {/* Inset the body to the same horizontal gutter as the trigger (+ a matching
            bottom gap) so the content doesn't sit flush against the item's border. */}
        <AccordionBody
          style={{
            paddingInline: "var(--seed-dimension-spacing-x-global-gutter)",
            paddingBottom: "var(--seed-dimension-spacing-x-global-gutter)",
          }}
        >
          {children}
        </AccordionBody>
      </AccordionContent>
    </AccordionItem>
  );
}
