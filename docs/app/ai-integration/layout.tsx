import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions } from "../layout.config";
import { getAiIntegrationSource } from "../source";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default async function Layout({ children }: { children: ReactNode }) {
  const aiIntegrationSource = await getAiIntegrationSource();
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: TAGS.aiIntegration.value,
          tags: Object.values(TAGS),
        },
      }}
    >
      <DocsLayout {...baseOptions} tree={aiIntegrationSource.pageTree}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
