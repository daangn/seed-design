import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getAiIntegrationOptions } from "../layout.config";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default async function Layout({ children }: { children: ReactNode }) {
  const aiIntegrationOptions = await getAiIntegrationOptions();

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
      <DocsLayout {...aiIntegrationOptions}>{children}</DocsLayout>
    </RootProvider>
  );
}
