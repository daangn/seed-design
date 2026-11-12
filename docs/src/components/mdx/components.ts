import { DocsCard } from "@/components/mdx-card";
import { mdxComponents as staticComponents } from "@/components/mdx-components";
import BlockCodeTabs from "./BlockCodeTabs.astro";
import BreezeManualInstallation from "./BreezeManualInstallation.astro";
import ChangelogPage from "./ChangelogPage.astro";
import ColorGrid from "./ColorGrid.astro";
import ComponentSpecBlock from "./ComponentSpecBlock.astro";
import LynxComponentExample from "./LynxComponentExample.astro";
import LynxManualInstallation from "./LynxManualInstallation.astro";
import ManualInstallation from "./ManualInstallation.astro";
import { withSlotProps } from "./slot-props";
import TokenReference from "./TokenReference.astro";

/** `<Content components={mdxComponents} />`에 넘기는 전체 MDX 컴포넌트. */
export const mdxComponents = {
  ...staticComponents,
  BlockCodeTabs,
  BreezeManualInstallation,
  Card: withSlotProps(DocsCard, ["icon"]),
  ChangelogPage,
  ColorGrid,
  ComponentSpecBlock,
  LynxComponentExample,
  LynxManualInstallation,
  ManualInstallation,
  TokenReference,
};
