import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { breezeOptions } from "../layout.config";
import { RootProvider } from "fumadocs-ui/provider";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";
import { MotionProvider } from "@/components/MotionProvider";

export default function Layout({ children }: { children: ReactNode }) {
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
