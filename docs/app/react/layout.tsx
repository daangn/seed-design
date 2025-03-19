import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { reactOptions } from "../layout.config";

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout {...reactOptions}>{children}</DocsLayout>;
}
