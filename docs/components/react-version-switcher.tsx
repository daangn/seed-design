"use client";

import { IconCheckmarkLine, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { cva } from "class-variance-authority";

const VERSIONS = [
  { label: "v1.2 (latest)", url: "https://seed-design.io/react" },
  { label: "v1.1", url: "https://1-1.seed-design.pages.dev/react" },
  { label: "v1.0", url: "https://1-0.seed-design.pages.dev/react" },
] as const;

const itemVariants = cva(
  "text-sm p-2 rounded-lg inline-flex items-center gap-2 hover:text-fd-accent-foreground hover:bg-fd-accent [&_svg]:size-4",
);

export function VersionSwitcher() {
  const [open, setOpen] = useState(false);
  const [hostname, setHostname] = useState("");

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const current = VERSIONS.find((v) => new URL(v.url).hostname === hostname) ?? VERSIONS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={buttonVariants({
          color: "secondary",
          size: "sm",
          className: "gap-1.5 text-xs",
        })}
      >
        <div className="flex grow justify-between items-center">
          {current?.label}
          <IconChevronDownLine className="size-3.5 text-fd-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col overflow-auto">
        {VERSIONS.map((version) =>
          version === current ? (
            <div
              aria-current
              key={version.label}
              className={itemVariants({
                className: "text-fd-primary pointer-events-none justify-between",
              })}
            >
              {version.label}
              <IconCheckmarkLine />
            </div>
          ) : (
            <a
              target="_blank"
              key={version.label}
              href={version.url}
              className={itemVariants({ className: "justify-between" })}
              onClick={() => setOpen(false)}
            >
              {version.label}
            </a>
          ),
        )}
      </PopoverContent>
    </Popover>
  );
}
