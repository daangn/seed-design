import { ColorGrid } from "@/components/color-grid";
import { ComponentExample } from "@/components/component-example";
import { ComponentGrid } from "@/components/component-grid";
import { ComponentSpecBlock } from "@/components/component-spec-block";
import { ManualInstallation } from "@/components/manual-installation";
import { StackflowExample } from "@/components/stackflow-example";
import { TokenReference } from "@/components/token-reference";
import { createReactTypeTable } from "@/components/type-table/react-type-table";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { AtomIcon } from "lucide-react";
import { MDXComponents } from "mdx/types";
import { BreezeManualInstallation } from "./breeze-manual-installation";
import { DoImage } from "./guideline/do-image";
import { DontImage } from "./guideline/dont-image";
import { IconLibrary } from "./iconography/icons";
import { ColorMigrationIndex } from "./migration/color-migration-index";
import { V2Icon, V2IconColor, V3Icon } from "./migration/icon";
import { IconographyMigrationIndex } from "./migration/iconography-migration-index";
import { TypographyMigrationIndex } from "./migration/typography-migration-index";
import { PlatformStatusTable } from "./platform-status-table";
import { ProgressBoardTable } from "./progress-board-table";
import { ViteIcon, WebpackIcon } from "./tool-icon";
import { typeTableGenerator } from "./type-table/generator";

const { ReactTypeTable } = createReactTypeTable(typeTableGenerator);

export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,

  img: (props) => <ImageZoom {...props} />,

  // Layout
  Grid: ({ children }) => <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{children}</div>,

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
  AtomIcon,
  WebpackIcon,
  ViteIcon,
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

  // Guidelines
  DoImage,
  DontImage,

  ImageZoom,

  FigmaImage: () => null,
};
