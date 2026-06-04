import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions } from "../layout.config";
import { blogSource } from "../source";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: TAGS.blog.value,
          tags: Object.values(TAGS),
        },
      }}
    >
      <DocsLayout {...baseOptions} tree={blogSource.pageTree}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
