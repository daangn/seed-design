"use client";

import { IconArrowUpRightFill } from "@karrotmarket/react-monochrome-icon";
import Link from "next/link";

export const TokenLink = ({ id, description }: { id: string; description?: string }) => {
  return (
    <div>
      <Link
        target="_blank"
        onClick={(e) => e.stopPropagation()}
        className="inline"
        href={`/docs/foundation/design-token/${encodeURIComponent(id)}`}
      >
        <span>{id}</span>
        <IconArrowUpRightFill size={10} className="flex-none text-current/60 ml-1 mb-0.5 inline" />
      </Link>
      {description && (
        <div className="text-fd-muted-foreground text-xs text-pretty break-keep mt-1">
          {description}
        </div>
      )}
    </div>
  );
};
