import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { aiIntegrationOptions } from "../layout.config";
import { RootProvider } from "fumadocs-ui/provider";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";
import { AIPanelShell } from "@/components/ai-panel/ai-panel-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AIPanelShell>
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
    </AIPanelShell>
  );
}
