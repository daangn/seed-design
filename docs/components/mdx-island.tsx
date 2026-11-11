import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Heading } from "fumadocs-ui/components/heading";
import { Step, Steps } from "fumadocs-ui/components/steps";
import type { ComponentType, ReactNode } from "react";
import { Accordion, Accordions } from "@/components/accordion";
import { BlockPreview } from "@/components/block-preview";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  SeedCodeBlockAuto,
} from "@/components/codeblock";
import { CodeTabsShell } from "@/components/codeblock/code-tabs";
import { ComponentExample } from "@/components/component-example";
import ErrorBoundary from "@/components/error-boundary";
import { DoImage } from "@/components/guideline/do-image";
import { DontImage } from "@/components/guideline/dont-image";
import { Image } from "@/components/guideline/image";
import { IconLibrary } from "@/components/iconography/icon-library-lazy";
import { MdxImage, MdxImageZoom } from "@/components/mdx-image";
import { IconographyMigrationIndex } from "@/components/migration/lazy";
import { StackflowExample } from "@/components/stackflow-example";
import { TypeTable } from "@/components/type-table";
import { SeedTab, SeedTabs } from "@/components/tabs/seed-tabs";
import type { MdxIslandNode } from "@/lib/satteri/rehype-mdx-islands";

/**
 * island 안에서 React가 직접 렌더링하는 컴포넌트. 이름은 `lib/satteri/rehype-mdx-islands.ts`의
 * `ISLAND_ROOTS`·`ISLAND_MEMBERS`와 같아야 한다. props는 직렬화되어 브라우저로 넘어온다.
 */
// biome-ignore lint/suspicious/noExplicitAny: 컴포넌트마다 props가 달라 이름으로만 고른다.
const islandComponents: Record<string, ComponentType<any>> = {
  Accordion,
  Accordions,
  BlockPreview,
  CodeBlock: SeedCodeBlockAuto,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeTabs: CodeTabsShell,
  ComponentExample,
  DoImage,
  DontImage,
  ErrorBoundary,
  File,
  Files,
  Folder,
  Heading,
  IconLibrary,
  IconographyMigrationIndex,
  Image,
  ImageZoom: MdxImageZoom,
  StackflowExample,
  Step,
  Steps,
  Tab: SeedTab,
  Tabs: SeedTabs,
  TypeTable,
  img: MdxImage,
};

function isSlotReference(value: object): value is { slot: string } {
  const keys = Object.keys(value);
  return keys.length === 1 && keys[0] === "slot" && typeof Object.values(value)[0] === "string";
}

interface MdxIslandProps {
  tree: MdxIslandNode[];
  /** Astro가 정적으로 렌더링한 slot. 이름은 tree의 `{ slot }`이 가리킨다. */
  [slot: string]: unknown;
}

/**
 * MDX 본문에서 hydrate가 필요한 조각 하나. context를 공유하거나 children을 읽는 컴포넌트 묶음은
 * tree로 받아 React가 한 번에 렌더링하고, 그 안의 정적 마크다운은 Astro slot으로 받는다.
 */
export function MdxIsland({ tree, ...slots }: MdxIslandProps) {
  /** props 안의 `{ slot }` 표시를 Astro가 렌더링한 slot으로 되돌린다. */
  const resolve = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(resolve);
    if (typeof value !== "object" || value === null) return value;
    if (isSlotReference(value)) return slots[value.slot];
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item)]));
  };

  const render = (node: MdxIslandNode, key: number): ReactNode => {
    if (typeof node === "string") return node;
    if (!Array.isArray(node)) return slots[node.slot] as ReactNode;

    const [name, props, ...children] = node;
    const Component = islandComponents[name];
    if (!Component) throw new Error(`MDX island에 등록되지 않은 컴포넌트입니다: ${name}`);

    return (
      <Component key={key} {...(resolve(props) as Record<string, unknown>)}>
        {children.length > 0 ? children.map(render) : undefined}
      </Component>
    );
  };

  return tree.map(render);
}
