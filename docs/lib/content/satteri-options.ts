import type { FumadocsOptions } from "@fumadocs/astro";
import { remarkAutoTypeTable } from "@fumadocs/satteri/remark-auto-type-table";
import { remarkCodeTab } from "@fumadocs/satteri/remark-code-tab";
import { remarkImage } from "@fumadocs/satteri/remark-image";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import { remarkNpm } from "@fumadocs/satteri/remark-npm";
import { fileGenerator } from "fumadocs-docgen";
import type { MdastPluginDefinition } from "satteri";
import { readFigmaImageManifest } from "../../components/figma-image/figma-image-manifest";
import { remarkFigmaImage } from "../../components/figma-image/remark-figma-image";
import { filteredTypeTableGenerator } from "../../components/type-table/generator";
import { env } from "../env";
import { preserveRuleElements } from "../llms/rule-elements";
import { codeBlockTabsSource } from "../satteri/code-block-tabs-source";
import { omitTypeTableFromText } from "../satteri/omit-type-table";
import { rehypeMdxIslands } from "../satteri/rehype-mdx-islands";
import { remarkDocGen } from "../satteri/remark-doc-gen";
import { remarkApplyLlmsFilter } from "../satteri/remark-llms-filter";
import {
  filterStructureElement,
  remarkSearchRows,
  structureOptions,
} from "../satteri/search-structure";

// `astro.config.ts`가 Vite alias 없이 읽는 모듈이라, 여기서 닿는 파일은 모두 상대 경로로 import한다.

/** Fumadocs 컬렉션 이름과 콘텐츠 디렉터리. `src/content.config.ts`와 `lib/source.ts`가 함께 쓴다. */
export const CONTENT_COLLECTIONS = {
  docs: "content/docs",
  "get-started": "content/get-started",
  foundations: "content/foundations",
  components: "content/components",
  patterns: "content/patterns",
  react: "content/react",
  breeze: "content/breeze",
  lynx: "content/lynx",
  "ai-integration": "content/ai-integration",
  updates: "content/updates",
} as const;

export type ContentCollectionName = keyof typeof CONTENT_COLLECTIONS;

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

export function createFumadocsOptions(): FumadocsOptions {
  return {
    collections: Object.fromEntries(
      Object.entries(CONTENT_COLLECTIONS).map(([name, dir]) => [name, { dir }]),
    ),
    remarkStructureOptions: structureOptions,
    remarkCodeTabOptions: false,
    remarkNpmOptions: false,
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
      // `as: ""`는 export 대신 `page.data.getText("processed")`가 읽는 데이터로 남깁니다.
      // heading 뒤에 붙는 `[#id]`는 heading 텍스트의 일부로 읽혀 slug를 바꿉니다.
      remarkLlms({ as: "", headingIds: false }),
    ],
    hastPlugins: [rehypeMdxIslands()],
    rehypeCodeOptions: {
      lazy: true,
      langs: ["ts", "js", "html", "tsx", "mdx"],
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  };
}
