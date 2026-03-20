import * as React from "react";
import { notFound } from "next/navigation";

const blocks: Record<string, React.LazyExoticComponent<React.ComponentType>> = {};

export default async function BlockPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const Block = blocks[name];

  if (!Block) {
    notFound();
  }

  return (
    <React.Suspense fallback={null}>
      <Block />
    </React.Suspense>
  );
}

export function generateStaticParams() {
  return Object.keys(blocks).map((name) => ({ name }));
}
