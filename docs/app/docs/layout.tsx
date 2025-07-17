import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { docsOptions } from "../layout.config";
import { source } from "../source";

export default async function Layout({ children }: { children: ReactNode }) {
  const transformedTree = await source.getTransformedPageTree();

  return (
    <DocsLayout {...docsOptions} tree={transformedTree}>
      {children}
    </DocsLayout>
  );
}
