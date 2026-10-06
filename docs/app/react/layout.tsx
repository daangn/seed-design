import { ReactVersionSwitcher } from "@/components/react-version-switcher";
import { archivePaths } from "@/lib/docs-archive";
import { TAGS } from "@/app/api/search/constants";
import DefaultSearchDialog from "@/components/search/search";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";
import { reactOptions } from "../layout.config";

export default function Layout({ children }: { children: ReactNode }) {
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
        {...reactOptions}
        sidebar={{ ...reactOptions.sidebar, banner: <ReactVersionSwitcher /> }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
