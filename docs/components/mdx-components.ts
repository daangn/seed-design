import { ColorGrid } from "@/components/color-grid";
import { ComponentExample } from "@/components/component-example";
import { ComponentSpecBlock } from "@/components/component-spec-block";
import { Installation } from "@/components/installation";
import { StackflowExample } from "@/components/stackflow-example";
import { TokenReference } from "@/components/token-reference";
import { createReactTypeTable } from "@/components/type-table/react-type-table";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { AtomIcon } from "lucide-react";
import { IconLibrary } from "./iconography/icons";
import { ColorMigrationIndex } from "./migration/color-migration-index";
import { V2Icon, V2IconColor, V3Icon } from "./migration/icon";
import { IconographyMigrationIndex } from "./migration/iconography-migration-index";
import { TypographyMigrationIndex } from "./migration/typography-migration-index";
import { ViteIcon, WebpackIcon } from "./tool-icon";
import { typeTableProject } from "./type-table/project";

const { ReactTypeTable } = createReactTypeTable({ project: typeTableProject });

export const mdxComponents = {
  ...defaultMdxComponents,
  Installation,
  ComponentExample,
  TokenReference,
  ComponentSpecBlock,
  Tab,
  Tabs,
  Step,
  Steps,
  File,
  Folder,
  Files,
  Accordion,
  Accordions,
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
};
