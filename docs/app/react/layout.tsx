import { TAGS } from "@/app/api/search/constants";
import DefaultSearchDialog from "@/components/search/search";
import { ReactVersionSwitcher } from "@/components/react-version-switcher";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { reactSource } from "../source";

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
      <DocsLayout
        {...baseOptions}
        sidebar={{ ...baseOptions.sidebar, banner: <ReactVersionSwitcher /> }}
        tree={reactSource.pageTree}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
