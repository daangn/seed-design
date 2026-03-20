"use client";

import { notFound } from "next/navigation";

// When blocks are added to registry/block/, create a static registry
// similar to example-registry.ts and import getBlockComponent from it.
// For now, the block directory is empty so we always show notFound.

export function BlockRenderer({ name }: { name: string }) {
  void name;
  notFound();
}
