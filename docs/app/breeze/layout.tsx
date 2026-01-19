import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { getBreezeOptions } from "../layout.config";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";
import { MotionProvider } from "@/components/MotionProvider";

export default async function Layout({ children }: { children: ReactNode }) {
  const breezeOptions = await getBreezeOptions();

  return (
    <MotionProvider>
      <RootProvider
        search={{
          SearchDialog: DefaultSearchDialog,
          options: {
            defaultTag: TAGS.breeze.value,
            tags: Object.values(TAGS),
          },
        }}
      >
        <DocsLayout {...breezeOptions}>{children}</DocsLayout>
      </RootProvider>
    </MotionProvider>
  );
}
