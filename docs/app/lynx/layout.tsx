import { TAGS } from "@/app/api/search/constants";
import DefaultSearchDialog from "@/components/search/search";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { getLynxOptions } from "../layout.config";

export default async function Layout({ children }: { children: ReactNode }) {
  const lynxOptions = await getLynxOptions();

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
      <DocsLayout {...lynxOptions}>{children}</DocsLayout>
    </RootProvider>
  );
}
