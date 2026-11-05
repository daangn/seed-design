import { archivePaths } from "@/lib/docs-archive";
import { TAGS } from "@/app/api/search/constants";
import DefaultSearchDialog from "@/components/search/search";
import { DocsVersionSwitcher } from "@/components/docs-version-switcher";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { getReactSource } from "../source";

export default async function Layout({ children }: { children: ReactNode }) {
  const reactSource = await getReactSource();
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: TAGS.react.value,
          tags: archivePaths.prefix ? [TAGS.react] : Object.values(TAGS),
        },
      }}
    >
      <DocsLayout
        {...baseOptions}
        sidebar={{ ...baseOptions.sidebar, banner: <DocsVersionSwitcher platform="react" /> }}
        tree={reactSource.pageTree}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
