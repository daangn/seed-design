"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import * as React from "react";

export function BlockRenderer({ name }: { name: string }) {
  const Block = React.useMemo(
    () =>
      dynamic(
        () =>
          import(`../../../registry/block/${name}`).catch(() => ({ default: () => notFound() })),
        { ssr: false },
      ),
    [name],
  );

  return <Block />;
}
