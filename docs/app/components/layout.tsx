import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { getComponentsSource } from "../source";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default async function Layout({ children }: { children: ReactNode }) {
  const componentsSource = await getComponentsSource();
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: TAGS.components.value,
          tags: Object.values(TAGS),
        },
      }}
    >
      <DocsLayout {...baseOptions} tree={componentsSource.pageTree}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
