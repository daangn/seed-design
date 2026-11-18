/**
 * MDX 컴포넌트 등록부. `<Content components={mdxComponents} />`에 넘기는 유일한 맵이며,
 * 각 MDX 컴포넌트가 JS를 보내는지(어떻게 보내는지)를 정하는 유일한 곳이다.
 *
 * 새 컴포넌트를 어디에 둘지 정하는 규칙(위에서부터 처음 맞는 것):
 *
 * 1. React만 만들 수 있는 내용을 그리는가(예제 실행, 검색 UI, 상태 있는 뷰어)?
 *    → island. `src/mdx/islands/<Name>.astro`를 만들고 그 안에서만 `client:visible`(기본) 또는
 *      `client:idle`을 붙인다. props는 JSON만, children은 정적 HTML로만 받는다. `client:load`는 쓰지 않는다.
 *      island 안에 `<Suspense>`·서버 `React.lazy`를 두지 않는다(예제 모듈 로딩은 `islands/example-modules.ts`).
 * 2. MDX 작성자가 쓴 children 위에서 동작하거나(탭 전환, 접기) 페이지에 수백 번 나오는가(복사, 확대)?
 *    → widget. 정적 마크업에 `data-widget="<WidgetName>"`을 달고 동작은 `src/mdx/widgets.ts`에 둔다.
 *      widget은 DOM을 만들지 않고 속성(aria-*, data-*, hidden, tabindex, CSS 변수)만 바꾼다. 탭·아코디언은 widget이고
 *      마크업은 해당 SEED React 컴포넌트의 서버 HTML과 같다(오너 결정 1).
 * 3. 나머지 → static(JS 없음).
 *    - 다음 중 하나면 `src/mdx/<Name>.astro`:
 *      JSX prop을 받는다(값은 Astro vnode라 React prop으로도 `.astro` 표현식으로도 못 그린다 → `<RenderNode node>`),
 *      빌드 데이터를 `await`한다, 다른 컴포넌트의 JSX prop 안에 들어갈 수 있다(`code`처럼 — 같은 vnode가 두 번
 *      렌더링되면 React 컴포넌트 자식이 사라진다).
 *    - 그 밖에는 기존 React 컴포넌트를 그대로 등록한다(Astro가 빌드 때 HTML로 렌더링). 빌드 데이터를 동기
 *      module로 읽는 React 컴포넌트도 여기에 든다(rootage, Sanity 스냅숏). island가 되는 컴포넌트는 데이터를
 *      `islands/*.astro`가 읽어 JSON props로 넘긴다(데이터를 브라우저 번들에 싣지 않게).
 *
 * 빌드 데이터는 render 중 fetch·fs로 읽지 않는다. `prepare:*`가 만든 JSON이나 저장소 파일을 module로 import한다.
 * React 컴포넌트를 렌더링하는 `.astro`는 frontmatter에서 await하지 않는다(`useId` 접두사 순서가 바뀌어 빌드가
 * 비결정적이 된다). await가 필요한 `.astro`는 아래에 React를 두지 않는다(아이콘은 `icons.ts`의 SVG 문자열).
 * 새 컴포넌트를 문서에 도입하면 `lib/llms/AGENTS.md` 절차로 llms 룰도 추가한다.
 */
import {
  IconCarrotLine,
  IconDocumentLine,
  IconPaletteLine,
} from "@karrotmarket/react-monochrome-icon";
import { AvailableSince } from "../../components/available-since";
import { Callout } from "../../components/callout";
import { ColorGrid } from "../../components/color-grid";
import { ComponentSpecBlock } from "../../components/component-spec-block";
import { IconComponent, IconTerminal } from "../../components/icons";
import { Badge } from "../../components/mdx-badge";
import { DocsCards } from "../../components/mdx-card";
import { ColorMigrationIndex } from "../../components/migration/color-migration-index";
import { V2Icon, V2IconColor, V3Icon } from "../../components/migration/icon";
import { IconographyMigrationIndex } from "../../components/migration/iconography-migration-index";
import { TypographyMigrationIndex } from "../../components/migration/typography-migration-index";
import { TableRoot } from "../../components/table";
import { TokenReference } from "../../components/token-reference";
import Accordion from "./Accordion.astro";
import Accordions from "./Accordions.astro";
import BlockCodeTabs from "./BlockCodeTabs.astro";
import BreezeManualInstallation from "./BreezeManualInstallation.astro";
import Card from "./Card.astro";
import CatalogGrid from "./CatalogGrid.astro";
import CodeBlock from "./CodeBlock.astro";
import CodeBlockTab from "./CodeBlockTab.astro";
import CodeBlockTabs from "./CodeBlockTabs.astro";
import CodeBlockTabsList from "./CodeBlockTabsList.astro";
import CodeBlockTabsTrigger from "./CodeBlockTabsTrigger.astro";
import DoImage from "./DoImage.astro";
import DontImage from "./DontImage.astro";
import File from "./File.astro";
import Files from "./Files.astro";
import Folder from "./Folder.astro";
import Grid from "./Grid.astro";
import H1 from "./H1.astro";
import H2 from "./H2.astro";
import H3 from "./H3.astro";
import H4 from "./H4.astro";
import H5 from "./H5.astro";
import H6 from "./H6.astro";
import Image from "./Image.astro";
import InlineCode from "./InlineCode.astro";
import BlockPreview from "./islands/BlockPreview.astro";
import ChangelogViewer from "./islands/ChangelogViewer.astro";
import ComponentExample from "./islands/ComponentExample.astro";
import IconLibrary from "./islands/IconLibrary.astro";
import LynxComponentExample from "./islands/LynxComponentExample.astro";
import ProgressBoardTable from "./islands/ProgressBoardTable.astro";
import StackflowExample from "./islands/StackflowExample.astro";
import Link from "./Link.astro";
import LynxManualInstallation from "./LynxManualInstallation.astro";
import ManualInstallation from "./ManualInstallation.astro";
import Step from "./Step.astro";
import Steps from "./Steps.astro";
import Tab from "./Tab.astro";
import Tabs from "./Tabs.astro";
import TypeTable from "./TypeTable.astro";
import ZoomImage from "./ZoomImage.astro";

export const mdxComponents = {
  // ── static: React 그대로(JS 없음) ──
  AvailableSince,
  Badge,
  Callout,
  Cards: DocsCards,
  table: TableRoot,
  IconTerminal,
  IconComponent,
  IconPalette: IconPaletteLine,
  IconFile: IconDocumentLine,
  IconSprout: IconCarrotLine,
  V2Icon,
  V3Icon,
  V2IconColor,
  // 빌드 데이터를 동기 module import로 직접 읽는다(rootage `lib/rootage.ts`).
  ComponentSpecBlock,
  TokenReference,
  ColorGrid,
  ColorMigrationIndex,
  TypographyMigrationIndex,
  IconographyMigrationIndex,

  // ── static: .astro(JSX prop, 빌드 데이터, JSX prop 안에 들어감) ──
  a: Link,
  code: InlineCode, // TypeTable의 type vnode 안에 들어간다
  // MDX가 태그 이름을 넘기지 않아 Heading 하나로 등록할 수 없다. H1–H6이 Heading.astro에 `as`를 넘긴다.
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  Card, // icon·title → RenderNode
  Grid,
  Steps,
  Step,
  Files,
  Folder,
  File,
  TypeTable, // description·type → RenderNode
  CatalogGrid, // section page tree를 await한다 → 아래에 React 없음
  ManualInstallation, // 코드 하이라이트를 await한다 → 아래에 React 없음
  LynxManualInstallation,
  BreezeManualInstallation,
  FigmaImage: () => null, // remarkFigmaImage가 이미지 노드로 바꾼다

  // ── widget-backed static: data-widget 동작은 widgets.ts ──
  pre: CodeBlock, // copy. 제목은 preserveCodeMeta가 살린다
  img: ZoomImage, // zoom
  ImageZoom: ZoomImage,
  Image, // zoom
  DoImage, // zoom
  DontImage, // zoom
  Tabs, // tabs
  Tab,
  // 생성 노드 모양(CodeBlockTabs > CodeBlockTabsList > CodeBlockTabsTrigger, CodeBlockTab)을 그대로 그린다. tabs + copy
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockTab,
  Accordions, // accordion
  Accordion,
  BlockCodeTabs, // tabs + copy, 코드 하이라이트를 await한다 → 아래에 React 없음

  // ── island: src/mdx/islands/*.astro 안에서만 client:* ──
  ComponentExample, // ExamplePreview client:visible
  LynxComponentExample, // LynxExamplePanel client:visible
  StackflowExample, // StackflowIframePreview client:visible
  BlockPreview, // client:visible
  IconLibrary, // client:only(기존처럼 서버 HTML 없음)
  ChangelogPage: ChangelogViewer, // client:idle. 데이터는 changelog-data.ts module
  ProgressBoardTable, // client:visible(비고 tooltip). Sanity 스냅숏은 wrapper가 props로
} as const;

export type MdxComponentName = keyof typeof mdxComponents;
