import "./updates-article.css";
import type { ReactNode } from "react";
import { NoSidebarDocsLayout } from "@/components/layout/no-sidebar-docs-layout";
import { baseOptions } from "../layout.config";
import { getUpdatesSource } from "../source";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default async function Layout({ children }: { children: ReactNode }) {
  const updatesSource = await getUpdatesSource();
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: TAGS.updates.value,
          tags: Object.values(TAGS),
        },
      }}
    >
      <NoSidebarDocsLayout {...baseOptions} tree={updatesSource.pageTree}>
        {children}
      </NoSidebarDocsLayout>
    </RootProvider>
  );
}
