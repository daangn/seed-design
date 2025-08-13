import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { reactOptions } from "../layout.config";
import { RootProvider } from "fumadocs-ui/provider";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: TAGS.react.value,
          tags: Object.values(TAGS),
        },
      }}
    >
      <DocsLayout {...reactOptions}>{children}</DocsLayout>
    </RootProvider>
  );
}
