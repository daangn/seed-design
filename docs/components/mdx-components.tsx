import { AvailableSince } from "@/components/available-since";
import { ColorGrid } from "@/components/color-grid";
import { Badge } from "@/components/mdx-badge";
import { BlockCodeTabs } from "@/components/block-code-tabs";
import { BlockPreview } from "@/components/block-preview";
import { ComponentExample } from "@/components/component-example";
import { CatalogGrid } from "@/components/catalog/grid";
import { ComponentSpecBlock } from "@/components/component-spec-block";
import { ManualInstallation } from "@/components/manual-installation";
import { ChangelogPage } from "@/components/changelog-page";
import { StackflowExample } from "@/components/stackflow-example";
import { TokenReference } from "@/components/token-reference";
import {
  IconCarrotLine,
  IconDocumentLine,
  IconPaletteLine,
} from "@karrotmarket/react-monochrome-icon";
import { Accordion, Accordions } from "@/components/accordion";
import { Callout } from "@/components/callout";
import { Pre } from "fumadocs-ui/components/codeblock";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { SeedTab as Tab, SeedTabs as Tabs } from "@/components/tabs/seed-tabs";
import { TypeTable } from "@/components/type-table";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  SeedCodeBlockAuto,
} from "@/components/codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import clsx from "clsx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { BreezeManualInstallation } from "./breeze-manual-installation";
import { LynxManualInstallation } from "./lynx-manual-installation";
import { LynxComponentExample } from "./lynx-example";
import { DoImage } from "./guideline/do-image";
import { DontImage } from "./guideline/dont-image";
import { Image } from "./guideline/image";
import { IconComponent, IconTerminal } from "./icons";
import { IconLibrary } from "./iconography/icon-library-lazy";
import { ColorMigrationIndex } from "./migration/color-migration-index";
import { IconographyMigrationIndex, V2Icon, V2IconColor, V3Icon } from "./migration/lazy";
import { TypographyMigrationIndex } from "./migration/typography-migration-index";
import { ProgressBoardTable } from "./progress-board-table";
import { DocsCard, DocsCards } from "./mdx-card";
import { TableRoot } from "./table";

export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,

  // All fenced code blocks (```) render as the SEED "Codeblock" (Shiki colors preserved).
  // Inside a tabbed code card (`CodeBlockTabs`), SeedCodeBlockAuto renders the code bare.
  pre: ({ title, icon, children, ...props }: ComponentProps<"pre"> & { icon?: ReactNode }) => (
    <SeedCodeBlockAuto title={title} icon={icon}>
      <Pre {...props}>{children}</Pre>
    </SeedCodeBlockAuto>
  ),

  img: ({ className, ...rest }) => (
    <ImageZoom
      className={clsx(
        className,
        // 로딩 플레이스홀더 배경. SEED 팔레트는 다크에서 스케일이 뒤집혀 palette-gray-900가
        // #e9eaec(거의 흰색)로 해석되므로, 다크에도 palette-gray-100(#16171b, 페이지 배경 #171717과
        // 거의 동일)을 써서 라운드 코너 안티앨리어싱 가장자리로 새어나온 픽셀이 다크 배경과 구분되지
        // 않게 한다(라이트는 #f7f8f9 그대로 — 흰 페이지 대비 아주 옅어 fringe가 사실상 없다). 이
        // 교정으로 다크모드 라운드 이미지의 흰 fringe가 docs 전역에서 사라진다.
        // radius는 모바일 10px(r2_5) / 데스크톱 12px(r3) — 랜딩의 카드·썸네일(section-blog,
        // section-showcase 등)과 같은 브레이크포인트·값을 써서 사이트 전체 이미지 결을 통일한다.
        "bg-palette-gray-100 dark:bg-palette-gray-100 rounded-r2_5 lg:rounded-r3 overflow-hidden",
      )}
      // biome-ignore lint/suspicious/noExplicitAny: fumadocs recommends this: https://www.fumadocs.dev/docs/ui/components/image-zoom#usage
      {...(rest as any)}
    />
  ),

  // Markdown table → SEED custom table design (single source in ./table)
  table: TableRoot,

  // Layout
  Grid: ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2 md:items-start my-8 [&>figure]:my-0 not-prose [&>ul]:list-disc [&>ul]:p-2.5 [&>ul]:pl-8">
      {children}
    </div>
  ),

  // Components
  AvailableSince,
  Badge,
  Card: DocsCard,
  Cards: DocsCards,
  ManualInstallation,
  BlockCodeTabs,
  BlockPreview,
  ComponentExample,
  CatalogGrid,
  TokenReference,
  ComponentSpecBlock,
  BreezeManualInstallation,
  LynxManualInstallation,
  LynxComponentExample,
  Tab,
  Tabs,
  Step,
  Steps,
  File,
  Folder,
  Files,
  Accordion,
  Accordions,
  Callout,
  Pre,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockTab,
  StackflowExample,
  TypeTable,
  ColorGrid,
  V3Icon,
  V2Icon,
  V2IconColor,
  IconLibrary,
  ColorMigrationIndex,
  TypographyMigrationIndex,
  IconographyMigrationIndex,
  ProgressBoardTable,
  ChangelogPage,

  // Icons for MDX
  IconTerminal,
  IconPalette: IconPaletteLine,
  IconFile: IconDocumentLine,
  IconComponent,
  IconSprout: IconCarrotLine,

  // Guidelines
  DoImage,
  DontImage,
  Image,

  ImageZoom,

  FigmaImage: () => null,
};
