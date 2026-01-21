import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";
import { docsOptions } from "../layout.config";
import { docsSource } from "../source";
import { RootProvider } from "fumadocs-ui/provider";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default async function Layout({ children }: { children: ReactNode }) {
  const transformedTree = await docsSource.getTransformedPageTree();

  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: TAGS.design.value,
          tags: Object.values(TAGS),
        },
      }}
    >
      <DocsLayout {...docsOptions} tree={transformedTree}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
