import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { reactOptions } from "../layout.config";
import { RootProvider } from "fumadocs-ui/provider";
import DefaultSearchDialog from "@/components/search/search";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          defaultTag: "react",
          tags: [
            { name: "Design", value: "design" },
            { name: "React", value: "react" },
          ],
        },
      }}
    >
      <DocsLayout {...reactOptions}>{children}</DocsLayout>
    </RootProvider>
  );
}
