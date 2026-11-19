import type { CollectionOptions } from "@fumadocs/astro";
import { remarkAutoTypeTable } from "@fumadocs/satteri/remark-auto-type-table";
import { remarkCodeTab } from "@fumadocs/satteri/remark-code-tab";
import { remarkImage } from "@fumadocs/satteri/remark-image";
import { remarkNpm } from "@fumadocs/satteri/remark-npm";
import { fileGenerator } from "fumadocs-docgen";
import type { MdastPluginDefinition } from "satteri";
import { preserveRuleElements } from "../../lib/llms/rule-elements";
import { env } from "../../lib/env";
import { readFigmaImageManifest } from "../../components/figma-image/figma-image-manifest";
import { remarkFigmaImage } from "../../components/figma-image/remark-figma-image";
import { filteredTypeTableGenerator } from "../../components/type-table/generator";
import { codeBlockTabsSource } from "../satteri/code-block-tabs-source";
import { omitTypeTableFromText } from "../satteri/omit-type-table";
import { rehypeWidgetMarkers } from "../satteri/rehype-widget-markers";
import { rehypeTocTitles } from "../satteri/rehype-toc-titles";
import { remarkDocGen } from "../satteri/remark-doc-gen";
import { remarkApplyLlmsFilter } from "../satteri/remark-llms-filter";
import {
  filterStructureElement,
  remarkSearchRows,
  structureOptions,
} from "../satteri/search-structure";

// `astro.config.ts`가 Vite alias 없이 읽는 모듈이라, 여기서 닿는 파일은 모두 상대 경로로 import한다.
// c1a2105fd에서 복원. 바뀐 점: rehypeMdxIslands·CONTENT_COLLECTIONS 제거, remarkLlms는 통합의
// `includeProcessedMarkdown`이 preset 뒤에 붙인다(@fumadocs/astro 0.3.0 `resolveCollection`).

/** 검색 본문과 달리 llms.txt는 룰이 변환할 컴포넌트 태그를 그대로 넘겨받아야 합니다. */
const filterLlmsElement = preserveRuleElements(filterStructureElement);

const PACKAGE_MANAGER_GROUP_ID = "package-manager";

/**
 * Astro는 MDX frontmatter의 `layout`을 레이아웃 컴포넌트 경로로 읽어 import한다. 문서의
 * `layout: "overview"`는 content collection 데이터로만 쓰므로 컴파일 결과에서는 지운다.
 */
const dropAstroLayoutFrontmatter: MdastPluginDefinition = {
  name: "seed-docs-drop-astro-layout",
  after(_root, ctx) {
    const astro = ctx.data.astro as { frontmatter?: Record<string, unknown> } | undefined;
    if (astro?.frontmatter) delete astro.frontmatter.layout;
  },
};

/**
 * @fumadocs/astro 0.3.0은 Astro의 하이라이터를 피하려고 mdast `code`를 `fumadocs-code`로 바꿨다가 hast에서
 * `code`로 되돌리는데(`hideCode`·`restoreCode`), 되돌릴 때 `data.meta`를 버린다. 그래서 rehype-code가
 * `title="index.tsx"` 같은 meta를 읽지 못한다. rehype-code의 다른 입력(`properties.metastring`)으로 meta를 넘긴다.
 */
const preserveCodeMeta: MdastPluginDefinition = {
  name: "seed-docs-preserve-code-meta",
  code(node, ctx) {
    if (!node.meta) return;
    const data = (node.data ?? {}) as { hProperties?: Record<string, unknown> };
    ctx.setProperty(node, "data", {
      ...data,
      hProperties: { ...data.hProperties, metastring: node.meta },
    });
  },
};

export function createFumadocsOptions(): CollectionOptions & {
  includeProcessedMarkdown: NonNullable<CollectionOptions["includeProcessedMarkdown"]>;
} {
  return {
    remarkStructureOptions: structureOptions,
    remarkCodeTabOptions: false,
    remarkNpmOptions: false,
    // `getText("processed")`. heading 뒤에 붙는 `[#id]`는 heading 텍스트의 일부로 읽혀 slug를 바꾼다.
    // `output: "string"`: llms 룰(`lib/llms/rules`)은 MDX 태그가 남은 문자열을 후처리한다.
    includeProcessedMarkdown: { headingIds: false, output: "string" },
    // 컬렉션 사이에서 같은 플러그인을 공유해 Figma URL 요청 상태를 재사용합니다.
    mdastPlugins: [
      dropAstroLayoutFrontmatter,
      // 통합이 preset의 remarkImage를 끄므로 같은 자리(remarkHeading 바로 뒤)에서 직접 실행합니다.
      // public 경로는 그대로 유지하고 크기만 읽어 레이아웃 이동을 방지합니다.
      remarkImage({ useImport: false }),
      // preset의 remarkCodeTab·remarkNpm을 끄고 같은 순서(preset 기본 플러그인 바로 뒤)로 여기서 실행합니다.
      ...codeBlockTabsSource({
        codeTab: remarkCodeTab(),
        npm: remarkNpm({ persist: { id: PACKAGE_MANAGER_GROUP_ID } }),
        npmGroupId: PACKAGE_MANAGER_GROUP_ID,
      }),
      remarkDocGen({ generators: [fileGenerator()] }),
      // remarkDocGen이 만든 코드 블록(`"codeblock": { "meta": "title='…'" }`)의 meta도 살리도록 그 뒤에 둔다.
      preserveCodeMeta,
      ...omitTypeTableFromText(
        remarkAutoTypeTable({
          generator: filteredTypeTableGenerator,
          name: "react-type-table",
          options: { basePath: process.cwd() },
        }),
        { name: "react-type-table" },
      ),
      remarkFigmaImage({
        fileKey: env.figmaFileKey,
        accessToken: env.figmaPersonalAccessToken,
        manifest: readFigmaImageManifest(),
        fetchUrlsOptions: {
          format: "png",
          scale: 2,
        },
      }),
      remarkSearchRows(),
      remarkApplyLlmsFilter(filterLlmsElement),
    ],
    // TOC 제목은 `rehypeToc`(preset 기본 플러그인) 뒤에서 고쳐야 한다. 탭 표시는 rehype-code 뒤에 단다.
    hastPlugins: (defaults) => [...defaults, rehypeTocTitles(), rehypeWidgetMarkers()],
    rehypeCodeOptions: {
      lazy: true,
      // `yaml`은 Markdown 코드 블록의 frontmatter 하이라이트에 쓰인다. 미리 올려 두지 않으면 앞서
      // 렌더링한 페이지에 yaml 블록이 있었는지에 따라 결과가 달라진다.
      langs: ["ts", "js", "html", "tsx", "mdx", "yaml"],
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  };
}
