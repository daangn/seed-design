"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { use } from "react";

import { registryBlock } from "../../../registry/registry-block";

export default function BlockPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);

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

export function generateStaticParams() {
  const params = registryBlock.items.map((item) => ({ name: item.id }));

  // output: export requires at least one param for dynamic routes
  if (params.length === 0) {
    return [{ name: "__placeholder__" }];
  }

  return params;
}
