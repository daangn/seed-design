"use client";

import { REACT_ARCHIVE_VERSION } from "@/lib/docs-archive";

import {
  DocsMenuContent,
  DocsMenuGroup,
  DocsMenuItem,
  DocsMenuRoot,
  DocsMenuTrigger,
  DocsMenuTriggerButton,
} from "@/components/docs-menu";
import { IconCheckmarkLine, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { type ComponentProps, useState } from "react";
import clsx from "clsx";

const VERSIONS = [
  { label: "latest", url: "https://seed-design.io/react" },
  { label: "v2", url: "https://seed-design.io/react/v2" },
  { label: "v1.2", url: "https://v1-2.seed-design.io/react" },
  { label: "v1.1", url: "https://v1-1.seed-design.io/react" },
  { label: "v1.0", url: "https://v1-0.seed-design.io/react" },
] as const satisfies ReadonlyArray<{ label: string; url: string }>;

// The release branch embeds its archive version; regular Pages previews remain latest.
const CURRENT_VERSION = REACT_ARCHIVE_VERSION || "latest";

export function ReactVersionSwitcher({
  positionerContainer,
}: Pick<ComponentProps<typeof DocsMenuContent>, "positionerContainer">) {
  const [open, setOpen] = useState(false);

  const current = VERSIONS.find((v) => v.label === CURRENT_VERSION) ?? VERSIONS[0];

  return (
    <DocsMenuRoot open={open} onOpenChange={setOpen} placement="bottom-start" matchReferenceWidth>
      <DocsMenuTrigger asChild>
        <DocsMenuTriggerButton className="w-full justify-between!">
          <span className="min-w-0 text-left">{current.label}</span>
          <IconChevronDownLine
            className={clsx("shrink-0 transition-transform", open && "rotate-180")}
          />
        </DocsMenuTriggerButton>
      </DocsMenuTrigger>
      <DocsMenuContent positionerContainer={positionerContainer}>
        <DocsMenuGroup>
          {VERSIONS.map((version) => (
            <DocsMenuItem
              key={version.label}
              aria-current={version === current ? "true" : undefined}
              label={version.label}
              suffixIcon={version === current ? <IconCheckmarkLine /> : undefined}
              onClick={() => {
                if (version === current) return;

                window.open(version.url, "_blank", "noopener,noreferrer");
              }}
            />
          ))}
        </DocsMenuGroup>
      </DocsMenuContent>
    </DocsMenuRoot>
  );
}
