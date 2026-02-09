import { ColorGrid } from "@/components/color-grid";
import { ComponentExample } from "@/components/component-example";
import { ComponentGrid } from "@/components/component-grid";
import { ComponentSpecBlock } from "@/components/component-spec-block";
import { ManualInstallation } from "@/components/manual-installation";
import { StackflowExample } from "@/components/stackflow-example";
import { TokenReference } from "@/components/token-reference";
import { createReactTypeTable } from "@/components/type-table/react-type-table";
import {
  IconCarrotLine,
  IconDocumentLine,
  IconPaletteLine,
} from "@karrotmarket/react-monochrome-icon";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { ThemeToggle } from "fumadocs-ui/components/layout/theme-toggle";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import clsx from "clsx";
import type { MDXComponents } from "mdx/types";
import { BreezeManualInstallation } from "./breeze-manual-installation";
import { DoImage } from "./guideline/do-image";
import { DontImage } from "./guideline/dont-image";
import { Image } from "./guideline/image";
import { IconComponent, IconTerminal } from "./icons";
import { IconLibrary } from "./iconography/icons";
import { ColorMigrationIndex } from "./migration/color-migration-index";
import { V2Icon, V2IconColor, V3Icon } from "./migration/icon";
import { IconographyMigrationIndex } from "./migration/iconography-migration-index";
import { TypographyMigrationIndex } from "./migration/typography-migration-index";
import { PlatformStatusTable } from "./platform-status-table";
import { ProgressBoardTable } from "./progress-board-table";
import { typeTableGenerator } from "./type-table/generator";

const { ReactTypeTable } = createReactTypeTable(typeTableGenerator);

export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,

  img: ({ className, ...rest }) => (
    <ImageZoom
      className={clsx(
        className,
        "bg-palette-gray-100 dark:bg-palette-gray-900 rounded-r2 overflow-hidden",
      )}
      {...rest}
    />
  ),

  // Layout
  Grid: ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2 md:items-start my-[2em] [&>figure]:my-0 not-prose [&>ul]:list-disc [&>ul]:p-2.5 [&>ul]:pl-8">
      {children}
    </div>
  ),

  // Components
  ManualInstallation,
  ComponentExample,
  ComponentGrid,
  TokenReference,
  ComponentSpecBlock,
  BreezeManualInstallation,
  Tab,
  Tabs,
  Step,
  Steps,
  File,
  Folder,
  Files,
  Accordion,
  Accordions,
  CodeBlock,
  Pre,
  StackflowExample,
  TypeTable,
  ReactTypeTable,
  ColorGrid,
  V3Icon,
  V2Icon,
  V2IconColor,
  IconLibrary,
  ColorMigrationIndex,
  TypographyMigrationIndex,
  IconographyMigrationIndex,
  ProgressBoardTable,
  PlatformStatusTable,

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
  ThemeToggle,

  FigmaImage: () => null,
};
