import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getMarkdownPageLastModified } from "@/lib/git-timestamps";
import {
  getAiIntegrationSource,
  getBreezeSource,
  getComponentsSource,
  getDocsSource,
  getFoundationsSource,
  getGetStartedSource,
  getLynxSource,
  getPatternsSource,
  getReactSource,
  getUpdatesSource,
} from "@/lib/source";
import { client } from "@/sanity-studio/lib/client";
import { ALL_COMPONENTS_QUERY } from "@/sanity-studio/lib/queries";

/**
 * Astro incremental build(`experimental.incrementalBuild`)의 `cacheKey`를 만든다.
 *
 * Astro는 route와 컴파일된 MDX의 모듈 그래프를 스스로 해시한다. 여기서는 그 그래프 밖에서 렌더링
 * 시점에 읽는 입력만 다룬다.
 *
 * - `content/` 밖의 추적 파일: registry, rootage, CHANGELOG, package.json 버전처럼 페이지가 파일
 *   시스템에서 읽는 데이터의 원천이다. 하나라도 바뀌면 모든 페이지를 다시 렌더링한다. 렌더링에 쓰이지
 *   않는 것이 분명한 경로(`UNRELATED_PREFIXES`)만 뺀다.
 * - 모든 문서의 frontmatter와 page tree: 사이드바, 이전·다음 링크, 목록형 컴포넌트가 다른 문서의
 *   제목·설명을 쓴다.
 * - Lynx 예제 manifest: 번들 이름에 content hash가 들어가고 추적되지 않는 생성물이다.
 * - Sanity의 컴포넌트 상태: `PlatformStatusTable`과 progress board가 빌드 때 조회해 HTML에 넣는다.
 * - 문서의 Git 수정일.
 *
 * 여기에 없는 외부 데이터(예: 렌더링 중 조회한 Figma 이미지 주소)를 쓰는 route에는 키를 주지 않는다.
 * 그런 데이터를 문서 페이지에 새로 넣으면 이 파일의 키에도 넣는다.
 */

const enabled = process.env.SEED_DOCS_INCREMENTAL_BUILD === "1";

function sha256(...parts: string[]): string {
  const hash = createHash("sha256");
  for (const part of parts) hash.update(part).update("\n");
  return hash.digest("hex");
}

function git(root: string, ...args: string[]): string {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

/**
 * fingerprint에서 빼는 경로. `docs/content/`는 Astro의 MDX 해시와 `contentFingerprint()`가 따로 본다.
 * 나머지는 빌드가 읽지 않는 저장소 운영 파일이다. 여기에 경로를 더할 때는 문서 페이지가 그 아래 파일을
 * 읽지 않는지 확인한다. 잘못 빼면 낡은 페이지가 배포되고, 빼지 않으면 렌더링을 더 할 뿐이다.
 */
const UNRELATED_PREFIXES = ["docs/content/", ".changeset/", ".github/", ".agents/", ".claude/"];

function isRelated(filePath: string): boolean {
  return !UNRELATED_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

/**
 * 렌더링에 쓰일 수 있는 추적 파일의 fingerprint. HEAD의 tree로 계산하므로, 커밋되지 않은 변경이 있으면
 * 실제 입력을 대표하지 못한다. 그때는 `undefined`를 돌려줘 캐시를 쓰지 않는다.
 */
function trackedFilesFingerprint(): string | undefined {
  try {
    const root = git(process.cwd(), "rev-parse", "--show-toplevel").trim();
    const dirty = git(root, "status", "--porcelain")
      .split("\n")
      .filter((line) => line !== "" && isRelated(line.slice(3)));
    if (dirty.length > 0) {
      console.warn(
        `[incremental-build] 커밋되지 않은 변경이 ${dirty.length}건 있어 페이지 캐시를 쓰지 않습니다. 예: ${dirty[0]}`,
      );
      return undefined;
    }

    const tree = git(root, "ls-tree", "-r", "HEAD")
      .split("\n")
      .filter((line) => isRelated(line.slice(line.indexOf("\t") + 1)));
    return sha256(...tree);
  } catch (error) {
    console.warn("[incremental-build] Git 상태를 읽지 못해 페이지 캐시를 쓰지 않습니다.", error);
    return undefined;
  }
}

async function contentFingerprint(): Promise<string> {
  const sources = await Promise.all([
    getDocsSource(),
    getGetStartedSource(),
    getFoundationsSource(),
    getComponentsSource(),
    getPatternsSource(),
    getReactSource(),
    getBreezeSource(),
    getLynxSource(),
    getAiIntegrationSource(),
    getUpdatesSource(),
  ]);

  return sha256(
    ...sources.map((source) =>
      JSON.stringify({
        tree: source.pageTree,
        pages: source
          .getPages()
          .map((page) => ({ url: page.url, data: page.data }))
          .sort((a, b) => a.url.localeCompare(b.url)),
      }),
    ),
  );
}

async function lynxManifestFingerprint(): Promise<string> {
  try {
    return sha256(
      await readFile(path.resolve(process.cwd(), "public/__lynx__/manifest.json"), "utf8"),
    );
  } catch {
    return "no-lynx-manifest";
  }
}

async function sanityFingerprint(): Promise<string> {
  return sha256(JSON.stringify(await client.fetch(ALL_COMPONENTS_QUERY)));
}

let siteKey: Promise<string | undefined> | undefined;

/** 모든 페이지가 공유하는 입력의 키. incremental build를 켜지 않았거나 쓸 수 없으면 `undefined`다. */
export function siteCacheKey(): Promise<string | undefined> {
  siteKey ??= (async () => {
    if (!enabled) return undefined;
    const tracked = trackedFilesFingerprint();
    if (tracked === undefined) return undefined;
    try {
      const inputs = {
        tracked,
        content: await contentFingerprint(),
        lynx: await lynxManifestFingerprint(),
        sanity: await sanityFingerprint(),
        // llms Markdown 주소와 changelog 링크가 가리키는 ref.
        sourceRef: process.env.SEED_DOCS_SOURCE_REF ?? "",
      };
      // 캐시가 빗나갔을 때 어느 입력이 바뀌었는지 이전 빌드 로그와 비교할 수 있게 남긴다.
      console.info(
        `[incremental-build] 캐시 키 입력: ${Object.entries(inputs)
          .map(([name, value]) => `${name}=${value.slice(0, 12)}`)
          .join(" ")}`,
      );
      return sha256(...Object.values(inputs));
    } catch (error) {
      console.warn(
        "[incremental-build] 캐시 키 입력을 읽지 못해 페이지 캐시를 쓰지 않습니다.",
        error,
      );
      return undefined;
    }
  })();
  return siteKey;
}

/** 문서 페이지 하나의 키. */
export async function docsPageCacheKey(page: {
  absolutePath?: string;
}): Promise<string | undefined> {
  const site = await siteCacheKey();
  if (site === undefined) return undefined;
  const lastModified = await getMarkdownPageLastModified(page.absolutePath);
  return sha256(site, lastModified?.toISOString() ?? "");
}
