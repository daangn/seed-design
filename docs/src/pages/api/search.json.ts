/**
 * `/api/search.json`: 검색 다이얼로그가 받는 Orama 색인(fumadocs `advanced`). 문서 색인은 `source.ts`가, 패키지
 * changelog 색인은 module로 import한 CHANGELOG(`src/mdx/changelog-data.ts`)가 준다. render 중 fs를 읽지 않는다.
 * cacheKey가 없어 incremental build에서도 매번 렌더링한다.
 */
import type { APIRoute } from "astro";
import { type AdvancedIndex, createSearchAPI } from "fumadocs-core/search/server";
import { getChangelogHref } from "../../../components/changelog-viewer/utils";
import { koreanTokenizer } from "../../../components/search/tokenizer";
import { getEntrySearchText } from "../../../lib/changelog-entry";
import type { ChangelogPlatform } from "../../../lib/changelog-platform";
import { archivePaths } from "../../../lib/docs-archive";
import { sectionLabel } from "../../../lib/docs-sections";
import { getSectionConfig } from "../../content/sections";
import { getSearchDocuments } from "../../content/source";
import { changelogEntries } from "../../mdx/changelog-data";

function changelogIndexes(platform: ChangelogPlatform): AdvancedIndex[] {
  const byPackage = new Map<string, Map<string, string[]>>();
  for (const entry of changelogEntries[platform]) {
    const versions = byPackage.get(entry.package.name) ?? new Map<string, string[]>();
    byPackage.set(entry.package.name, versions);
    const items = versions.get(entry.package.version) ?? [];
    versions.set(entry.package.version, items);
    items.push(getEntrySearchText(entry));
  }

  return [...byPackage.entries()].flatMap(([packageName, versions]) => {
    const label = packageName.replace("@seed-design/", "");
    return [...versions.entries()].map(([version, items]) => {
      const versionUrl = getChangelogHref(packageName, version);
      return {
        id: versionUrl,
        title: `Changelog - ${label}@${version}`,
        description: `${packageName}@${version} 변경사항`,
        structuredData: {
          headings: [],
          contents: items.map((item) => ({ heading: "", content: item })),
        },
        // page tree가 없으므로(CHANGELOG에서 만든다) 위치를 직접 적는다.
        breadcrumbs: [sectionLabel(versionUrl), "Changelog", label],
        // 패키지 changelog는 플랫폼 칩에 둔다. Updates 칩은 `/updates`의 디자인 시스템 소식만 쓴다.
        tag: getSectionConfig(platform).searchTag,
        url: versionUrl,
      };
    });
  });
}

const { staticGET } = createSearchAPI("advanced", {
  indexes: async () => {
    const platforms: ChangelogPlatform[] = archivePaths.platform
      ? archivePaths.platform === "react"
        ? ["react"]
        : []
      : ["react", "lynx"];
    return [...(await getSearchDocuments()), ...platforms.flatMap(changelogIndexes)];
  },
  tokenizer: koreanTokenizer,
  // fumadocs 질의는 정렬하지 않는다. 문자열 속성마다 정렬 색인을 두면 export가 수 MB 커져 Cloudflare Pages의
  // 25 MiB 한도를 넘는다.
  sort: { enabled: false },
});

export const GET: APIRoute = () => staticGET();
