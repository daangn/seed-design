import { ColorGrid } from "@/components/color-grid";
import { ComponentExample } from "@/components/component-example";
import { ComponentSpecBlock } from "@/components/component-spec-block";
import { Installation } from "@/components/installation";
import { createReactTypeTable } from "@/components/react-type-table";
import { StackflowExample } from "@/components/stackflow-example";
import { TokenReference } from "@/components/token-reference";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { AtomIcon } from "lucide-react";
import { IconLibrary } from "./iconography/icons";
import { ColorMigrationIndex } from "./migration/color-migration-index";
import { V2Icon, V2IconColor, V3Icon } from "./migration/icon";
import { TypographyMigrationIndex } from "./migration/typography-migration-index";

const { ReactTypeTable } = createReactTypeTable();

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
  StackflowExample,
  ReactTypeTable,
  ColorGrid,
  V3Icon,
  V2Icon,
  V2IconColor,
  IconLibrary,
  ColorMigrationIndex,
  TypographyMigrationIndex,
};
