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
          tags: Object.values(TAGS),
        },
      }}
    >
      <DocsLayout {...reactOptions}>{children}</DocsLayout>
    </RootProvider>
  );
}
