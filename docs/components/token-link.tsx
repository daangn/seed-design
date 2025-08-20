"use client";

import Link from "next/link";

export const TokenLink = (props: { id: string }) => {
  const { id } = props;
  return (
    <Link
      onClick={(e) => {
        e.stopPropagation();
      }}
      href={`/docs/foundation/design-token/${encodeURIComponent(id)}`}
    >
      {id}
    </Link>
  );
};
