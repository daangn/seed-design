import { TAGS } from "@/app/api/search/constants";
import { AIPanelShell } from "@/components/ai-panel/ai-panel-shell";
import DefaultSearchDialog from "@/components/search/search";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";
import { lynxOptions } from "../layout.config";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AIPanelShell>
      <RootProvider
        search={{
          SearchDialog: DefaultSearchDialog,
          options: {
            defaultTag: TAGS.lynx.value,
            tags: Object.values(TAGS),
          },
        }}
      >
        <DocsLayout {...lynxOptions}>{children}</DocsLayout>
      </RootProvider>
    </AIPanelShell>
  );
}
