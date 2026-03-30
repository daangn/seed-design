"use client";

import * as React from "react";
import { notFound } from "next/navigation";

export function BlockRenderer({ name }: { name: string }) {
  const Block = React.useMemo(() => {
    return React.lazy(() =>
      import(`../../../registry/block/${name}`).catch(() => ({
        default: () => notFound(),
      })),
    );
  }, [name]);

  return (
    <React.Suspense fallback={null}>
      <Block />
    </React.Suspense>
  );
}
