"use client";

import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { tokenReferenceHref } from "@/lib/token-search";
import Link from "next/link";
import type { ReactNode } from "react";

export const TokenLink = ({
  id,
  description,
  trailing,
}: {
  id: string;
  description?: string;
  trailing?: ReactNode;
}) => {
  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="inline no-underline hover:underline"
          href={tokenReferenceHref(id)}
        >
          <span>{id}</span>
          <IconSeedArrow
            external
            className="size-2.5 flex-none text-current/60 ml-1 mb-0.5 inline"
          />
        </Link>
        {trailing}
      </div>
      {description && (
        <div className="text-fd-muted-foreground text-xs text-pretty break-keep mt-1">
          {description}
        </div>
      )}
    </div>
  );
};
