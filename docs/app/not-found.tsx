import Image from "next/image";
import Link from "next/link";
import { RootProvider } from "fumadocs-ui/provider/next";
import { ActionButton } from "seed-design/ui/action-button";
import { baseOptions } from "./layout.config";
import { docsSource } from "./source";
import { NoSidebarDocsLayout } from "@/components/layout/no-sidebar-docs-layout";
import DefaultSearchDialog from "@/components/search/search";
import { TAGS } from "@/app/api/search/constants";

export default function NotFound() {
  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
        options: {
          tags: Object.values(TAGS),
        },
      }}
    >
      {/* Header stays (shared DocsHeader via baseOptions); the sidebar column is
          removed by NoSidebarDocsLayout so the 404 content centers full-width.
          DocsPage is intentionally omitted: its internal padding pushes content
          off-center and past 100dvh. The box spans every grid column
          ([grid-column:1/-1]) so it fills the viewport width instead of being
          trapped in the narrow main column, and is sized to exactly
          viewport-minus-header (--fd-header-height) so it fits the row below the
          header with no vertical scroll. */}
      <NoSidebarDocsLayout {...baseOptions} tree={docsSource.pageTree}>
        <div className="flex h-[calc(100dvh-var(--fd-header-height,56px))] w-full flex-col items-center justify-center gap-10 overflow-hidden px-4 [grid-column:1/-1]">
          <div className="flex -translate-y-[20px] flex-col items-center gap-10">
            <Image
              src="/404.png"
              alt="404"
              width={300}
              height={106}
              priority
              className="h-auto w-[216px] md:w-[300px]"
            />

            <h1 className="text-2xl font-medium tracking-tight text-center">
              페이지를 찾을 수 없습니다.
            </h1>

            <ActionButton variant="neutralSolid" size="large" asChild>
              <Link href="/">홈으로</Link>
            </ActionButton>
          </div>
        </div>
      </NoSidebarDocsLayout>
    </RootProvider>
  );
}
