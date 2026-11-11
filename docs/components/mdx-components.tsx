import { archivePaths } from "@/lib/docs-archive";
import { AvailableSince } from "@/components/available-since";
import { Badge } from "@/components/mdx-badge";
import { BlockPreview } from "@/components/block-preview";
import { ComponentExample } from "@/components/component-example";
import { CatalogGrid } from "@/components/catalog/grid";
import { StackflowExample } from "@/components/stackflow-example";
import {
  IconCarrotLine,
  IconDocumentLine,
  IconPaletteLine,
} from "@karrotmarket/react-monochrome-icon";
import { Accordion, Accordions } from "@/components/accordion";
import { Callout } from "@/components/callout";
import { Pre } from "fumadocs-ui/components/codeblock";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { SeedTab as Tab, SeedTabs as Tabs } from "@/components/tabs/seed-tabs";
import { TypeTable } from "@/components/type-table";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { DoImage } from "./guideline/do-image";
import { DontImage } from "./guideline/dont-image";
import { Image } from "./guideline/image";
import { IconComponent, IconTerminal } from "./icons";
import { IconLibrary } from "./iconography/icon-library-lazy";
import { InlineCode } from "./inline-code";
import { ColorMigrationIndex } from "./migration/color-migration-index";
import { IconographyMigrationIndex, V2Icon, V2IconColor, V3Icon } from "./migration/lazy";
import { TypographyMigrationIndex } from "./migration/typography-migration-index";
import { ProgressBoardTable } from "./progress-board-table";
import { DocsCard, DocsCards } from "./mdx-card";
import { TableRoot } from "./table";

const MdxLink = defaultMdxComponents.a!;

/**
 * Astro가 정적으로 렌더링하는 React MDX 컴포넌트. 상호작용이 필요한 컴포넌트는
 * `lib/satteri/rehype-mdx-islands.ts`가 island로 바꾸고, 빌드 시점 데이터가 필요한 컴포넌트는
 * `src/components/mdx/components.ts`가 `.astro` 래퍼로 덧붙인다.
 */
export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,

  code: InlineCode,
  a: ({ href, ...props }) => <MdxLink {...props} href={href ? archivePaths.link(href) : href} />,

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
  BlockPreview,
  ComponentExample,
  CatalogGrid,
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
  V3Icon,
  V2Icon,
  V2IconColor,
  IconLibrary,
  ColorMigrationIndex,
  TypographyMigrationIndex,
  IconographyMigrationIndex,
  ProgressBoardTable,

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

  FigmaImage: () => null,
};
