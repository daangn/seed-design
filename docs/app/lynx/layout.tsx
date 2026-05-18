import { TAGS } from "@/app/api/search/constants";
import DefaultSearchDialog from "@/components/search/search";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { lynxSource } from "../source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: TAGS.lynx.value,
          tags: Object.values(TAGS),
        },
      }}
    >
      <DocsLayout {...baseOptions} tree={lynxSource.pageTree}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
