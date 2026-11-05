import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions } from "../layout.config";
import { getBreezeSource } from "../source";
import { RootProvider } from "fumadocs-ui/provider/next";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";
import { MotionProvider } from "@/components/MotionProvider";

export default async function Layout({ children }: { children: ReactNode }) {
  const breezeSource = await getBreezeSource();
  return (
    <MotionProvider>
      <RootProvider
        search={{
          SearchDialog: DefaultSearchDialog,
          options: {
            tags: Object.values(TAGS),
          },
        }}
      >
        <DocsLayout {...baseOptions} tree={breezeSource.pageTree}>
          {children}
        </DocsLayout>
      </RootProvider>
    </MotionProvider>
  );
}
