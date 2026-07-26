import { NoSidebarDocsLayout } from "@/components/layout/no-sidebar-docs-layout";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { getStartedSource } from "../source";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          tags: Object.values(TAGS),
        },
      }}
    >
      <NoSidebarDocsLayout {...baseOptions} tree={getStartedSource.pageTree}>
        {children}
      </NoSidebarDocsLayout>
    </RootProvider>
  );
}
