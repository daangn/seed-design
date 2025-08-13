import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { docsOptions } from "../layout.config";
import { source } from "../source";
import { RootProvider } from "fumadocs-ui/provider";
import DefaultSearchDialog from "@/components/search/search";

export default async function Layout({ children }: { children: ReactNode }) {
  const transformedTree = await source.getTransformedPageTree();

  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: "design",
          tags: [
            { name: "Design", value: "design" },
            { name: "React", value: "react" },
          ],
        },
      }}
    >
      <DocsLayout {...docsOptions} tree={transformedTree}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
