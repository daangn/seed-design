import { IconCheckmarkLine, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import { type ComponentProps, useState } from "react";
import {
  DocsMenuContent,
  DocsMenuGroup,
  DocsMenuItem,
  DocsMenuRoot,
  DocsMenuTrigger,
  DocsMenuTriggerButton,
} from "@/components/docs-menu";
import type { DocsVersion } from "./docs-version-switcher";

/** 버전 메뉴 본체. `docs-version-switcher.tsx`가 사용자가 버튼에 다가갈 때 lazy로 받는다. */
export default function DocsVersionMenu({
  versions,
  current,
  defaultOpen,
  positionerContainer,
}: {
  versions: ReadonlyArray<DocsVersion>;
  current: DocsVersion;
  defaultOpen: boolean;
} & Pick<ComponentProps<typeof DocsMenuContent>, "positionerContainer">) {
  const [open, setOpen] = useState(defaultOpen);

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
          {versions.map((version) => (
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
