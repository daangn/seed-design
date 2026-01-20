import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";
import { getDocsOptions } from "../layout.config";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default async function Layout({ children }: { children: ReactNode }) {
  const docsOptions = await getDocsOptions();

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
      <DocsLayout {...docsOptions}>{children}</DocsLayout>
    </RootProvider>
  );
}
