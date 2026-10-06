import { ReactVersionSwitcher } from "@/components/react-version-switcher";
import { archivePaths } from "@/lib/docs-archive";
import { TAGS } from "@/app/api/search/constants";
import DefaultSearchDialog from "@/components/search/search";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { getReactOptions } from "../layout.config";

export default async function Layout({ children }: { children: ReactNode }) {
  const reactOptions = await getReactOptions();

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
