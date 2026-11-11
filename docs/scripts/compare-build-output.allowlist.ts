/**
 * `compare-build-output.ts`가 허용하는 차이 목록이다.
 *
 * 항목을 추가하는 방법:
 * - 한쪽에만 있어도 되는 파일 → `stage: "path"`. `match`가 참인 파일을 1단계 목록에서 뺀다.
 * - 내용 일부만 달라도 되는 비HTML 파일 → `stage: "file"`. `normalize` 결과가 같으면 일치로 본다.
 * - 정규화 DOM에서 무시할 요소·속성 → `stage: "html"`. `element`가 요소마다 호출된다.
 *
 * `side`를 주면 해당 빌드에만 적용한다. Next.js 산출물을 구조로 식별하는 항목은 기준끼리 비교할 때도
 * 양쪽에 적용되어야 하므로 `side`를 두지 않는다. 리포트는 항목별 적용 횟수를 출력하므로,
 * 0회인 항목은 지워도 되는 후보다.
 */

export type Side = "baseline" | "candidate";

export interface BuildFile {
  /** 빌드 루트 기준 POSIX 상대 경로 */
  path: string;
  side: Side;
  /** 같은 빌드에 해당 경로의 파일이 있는지 */
  has(path: string): boolean;
  /** 파일 앞부분을 UTF-8 문자열로 읽는다 */
  head(bytes: number): Promise<string>;
}

export interface HtmlElement {
  tag: string;
  /** 정규화가 끝난 속성. 직접 수정했으면 `"changed"`를 반환한다. */
  attrs: Map<string, string>;
  parentTag: string | undefined;
  /** 정규화 뒤 자식 노드가 하나도 남지 않았는지 */
  empty: boolean;
  side: Side;
  /** HTML 파일의 빌드 루트 기준 경로 */
  path: string;
}

/** `"remove"`는 하위 트리째 제거, `"unwrap"`은 자식만 남김, `"changed"`는 `attrs`를 직접 고쳤다는 뜻이다. */
export type HtmlAction = "remove" | "unwrap" | "changed" | undefined;

interface EntryBase {
  id: string;
  /** 왜 이 차이를 허용하는지 */
  reason: string;
  side?: Side;
}

export interface PathEntry extends EntryBase {
  stage: "path";
  match: RegExp | ((file: BuildFile) => boolean | Promise<boolean>);
}

export interface FileEntry extends EntryBase {
  stage: "file";
  match: RegExp;
  normalize: (text: string) => string;
}

export interface HtmlEntry extends EntryBase {
  stage: "html";
  /** 생략하면 모든 HTML에 적용한다 */
  match?: RegExp;
  element: (el: HtmlElement) => HtmlAction;
}

export type AllowlistEntry = PathEntry | FileEntry | HtmlEntry;

// React Flight 응답의 첫 행이다. `1:"$Sreact.fragment"`, `0:{…}`, `2:I[…]`, `:HL["/_next/…","style"]`처럼
// `<16진수 id>:<태그><JSON>` 구조여서 Markdown인 llms 텍스트나 `robots.txt`와 겹치지 않는다.
const FLIGHT_FIRST_ROW = /^[0-9a-f]*:(?:"\$|[A-Z]{1,2}\[|[[{])/;

// RSC payload는 이름만으로 판정하지 않는다. `llms/**/*.txt`처럼 경로가 route와 같은 실제 텍스트 산출물이 있기 때문이다.
// (1) 세그먼트 payload `__next.*.txt`이거나 같은 경로의 `.html`과 짝을 이루는 route payload이고
// (2) 첫 행이 Flight 행 구조일 때만 payload로 본다. 둘 중 하나라도 어긋나면 일반 파일로 남아 비교된다.
async function isNextRscPayload(file: BuildFile): Promise<boolean> {
  if (!file.path.endsWith(".txt")) return false;
  const basename = file.path.slice(file.path.lastIndexOf("/") + 1);
  const pairedWithPage = file.has(file.path.replace(/\.txt$/, ".html"));
  if (!basename.startsWith("__next.") && !pairedWithPage) return false;
  return FLIGHT_FIRST_ROW.test(await file.head(64));
}

function sortSitemapUrls(xml: string): string {
  const urls = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  const [prefix = ""] = xml.split("<url>", 1);
  const suffix = xml.slice(xml.lastIndexOf("</url>") + "</url>".length);
  return urls.length === 0 ? xml : `${prefix}${[...urls].sort().join("\n")}${suffix}`;
}

interface OramaDump {
  type: unknown;
  language: unknown;
  sorting: unknown;
  pinning: unknown;
  index: { searchablePropertiesWithTypes: unknown };
  docs: { docs: Record<string, { id: string }>; count: number };
}

// 색인 구조(radix tree, frequencies, avgFieldLength)는 문서와 삽입 순서에서 파생되므로 문서 집합과 schema만 비교한다.
function canonicalizeOramaDump(json: string): string {
  const dump: OramaDump = JSON.parse(json);
  const docs = Object.values(dump.docs.docs).sort((a, b) =>
    a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
  );
  return JSON.stringify({
    type: dump.type,
    language: dump.language,
    sorting: dump.sorting,
    pinning: dump.pinning,
    schema: dump.index.searchablePropertiesWithTypes,
    count: dump.docs.count,
    docs,
  });
}

export const allowlist: AllowlistEntry[] = [
  {
    id: "next-bundle-assets",
    stage: "path",
    reason: "Next.js 번들 산출물(`_next/**`, 아카이브는 `<channel>/_assets/_next/**`)이다.",
    match: /^(?:.*\/_assets\/)?_next\//,
  },
  {
    id: "astro-bundle-assets",
    stage: "path",
    reason: "Astro 번들 산출물(`_astro/**`, 아카이브는 `<channel>/_assets/_astro/**`)이다.",
    match: /^(?:.*\/_assets\/)?_astro\//,
  },
  {
    id: "next-rsc-payload",
    stage: "path",
    reason:
      "Next.js가 클라이언트 내비게이션용으로 내보내는 RSC payload(`__next.*.txt`, `<route>.txt`)다. Astro에는 대응 파일이 없다.",
    match: isNextRscPayload,
  },
  {
    id: "next-not-found-page",
    stage: "path",
    reason:
      "Next.js `/_not-found` 내부 route의 HTML이다. 사용자에게 제공되는 404는 `404.html`로 따로 비교한다.",
    match: /(?:^|\/)_not-found\.html$/,
  },
  {
    id: "lynx-bundle-content-hash",
    stage: "path",
    reason:
      "Lynx 예제 번들 이름의 content hash는 빌드 경로에 따라 달라진다. 같은 checkout에서 캐시를 지우고 다시 빌드하면 같지만, entry 디렉터리 이름(`.next/lynx-entries` → `.cache/lynx-entries`)만 바꿔도 20개가, checkout 경로가 달라도 일부가 바뀐다. 번들 목록은 hash를 지운 `manifest.json`으로 비교한다.",
    match: /(?:^|\/)__lynx__\/[\w-]+\.[0-9a-f]{8}\.lynx\.bundle$/,
  },
  {
    id: "lynx-manifest-bundle-hash",
    stage: "file",
    reason:
      "`lynx-bundle-content-hash`와 같은 이유로 manifest가 가리키는 번들 이름의 hash만 다르다. hash를 지우고 예제 목록과 나머지 필드를 비교한다.",
    match: /(?:^|\/)__lynx__\/(?:e2e-)?manifest\.json$/,
    normalize: (text) => text.replace(/\.[0-9a-f]{8}\.lynx\.bundle/g, ".«hash».lynx.bundle"),
  },
  {
    id: "archive-headers-bundle-path",
    stage: "file",
    reason:
      "아카이브 `_headers`의 immutable 캐시 규칙은 번들 디렉터리를 가리킨다. Next.js는 `_assets/_next/static/*`, Astro는 `_assets/_astro/*`다.",
    match: /^_headers$/,
    normalize: (text) =>
      text.replace(/\/_assets\/(?:_next\/static|_astro)\/\*/g, "/_assets/«bundle»/*"),
  },
  {
    id: "sitemap-url-order",
    stage: "file",
    reason:
      "같은 소스를 두 번 빌드해도 `<url>` 순서가 달라진다(source loader의 페이지 열거 순서가 비결정적). `<url>` 블록을 정렬해 집합으로 비교한다.",
    match: /(?:^|\/)sitemap\.xml$/,
    normalize: sortSitemapUrls,
  },
  {
    id: "sitemap-lastmod-commit-time-tie",
    stage: "file",
    reason:
      "`content/lynx/components/action-button.mdx`를 고친 커밋 여러 개가 같은 committer 시각을 갖는다. `lib/git-timestamps.ts`가 그중 먼저 만난 커밋의 시각을 쓰는데, 순회 순서는 HEAD에 따라 달라진다. 기준선(dev HEAD)과 작업 브랜치에서 이 URL의 `lastmod`만 달라 비교에서 뺀다.",
    match: /(?:^|\/)sitemap\.xml$/,
    normalize: (text) =>
      text.replace(
        /(<loc>https:\/\/seed-design\.io\/lynx\/components\/action-button<\/loc>\s*<lastmod>)[^<]+/,
        "$1«lastmod»",
      ),
  },
  {
    id: "search-index-insertion-order",
    stage: "file",
    reason:
      "Orama 색인은 문서 삽입 순서에 따라 내부 id와 `avgFieldLength`가 달라지고, 삽입 순서는 빌드마다 바뀐다. 색인된 문서 집합과 schema·설정만 비교한다.",
    match: /(?:^|\/)api\/search\.json$/,
    normalize: canonicalizeOramaDump,
  },
  {
    id: "next-metadata-outlet",
    stage: "html",
    reason:
      "Next.js가 스트리밍 metadata를 넣으려고 `<body>` 첫머리에 두는 빈 `<div hidden>`이다. 정적 export에서는 항상 비어 있다.",
    element: (el) =>
      el.tag === "div" &&
      el.parentTag === "body" &&
      el.empty &&
      el.attrs.size === 1 &&
      el.attrs.has("hidden")
        ? "remove"
        : undefined,
  },
  {
    id: "next-image-attributes",
    stage: "html",
    reason:
      '`next/image`를 `<img>`로 바꿨다. next/image가 붙이던 `data-nimg`·`decoding`·`style="color:transparent"`가 빠지고, fumadocs `ImageZoom`의 `<img>`는 next/image(unoptimized)가 지우던 `sizes`·`fetchpriority="auto"`를 그대로 출력한다. `srcset`이 없어 `sizes`는 효과가 없고 나머지는 로딩 힌트다.',
    element: (el) => {
      if (el.tag !== "img") return undefined;

      let changed = el.attrs.delete("data-nimg");
      if (!el.attrs.has("srcset")) changed = el.attrs.delete("sizes") || changed;
      changed = el.attrs.delete("decoding") || changed;
      if (el.attrs.get("fetchpriority") === "auto")
        changed = el.attrs.delete("fetchpriority") || changed;

      const style = el.attrs.get("style");
      if (style !== undefined) {
        const rest = style
          .split(";")
          .map((declaration) => declaration.trim())
          .filter((declaration) => declaration && declaration !== "color:transparent");
        if (rest.length === 0) el.attrs.delete("style");
        else el.attrs.set("style", rest.join(";"));
        changed = changed || rest.join(";") !== style;
      }

      return changed ? "changed" : undefined;
    },
  },
  {
    id: "toc-rail-marker",
    stage: "html",
    reason:
      "목차 열을 본문보다 먼저 예약하려고 문서 article에 `docs-toc-rail` class를 붙였다. 기준선은 뒤에 오는 `#nd-toc`가 파싱된 뒤에야 열이 생겨, 문서가 천천히 도착하면 본문이 왼쪽으로 밀렸다(같은 조건에서 CLS 0.06).",
    element: (el) => {
      const value = el.attrs.get("class");
      if (el.tag !== "article" || value === undefined) return undefined;

      const tokens = value.split(" ");
      if (!tokens.includes("docs-toc-rail")) return undefined;

      el.attrs.set("class", tokens.filter((token) => token !== "docs-toc-rail").join(" "));
      return "changed";
    },
  },
  {
    id: "css-module-class-names",
    stage: "html",
    reason:
      "CSS Modules의 class 이름은 번들러가 정한다. Next.js는 `<파일>-module__<hash>__<이름>`, Vite는 `_<이름>_<hash>_<줄>` 형태라 같은 규칙도 이름이 다르다. 원래 이름만 남겨 비교한다.",
    element: (el) => {
      const value = el.attrs.get("class");
      if (value === undefined) return undefined;

      const normalized = value
        .split(" ")
        .map((token) =>
          token
            .replace(/^[\w-]+-module__[\w-]+__([\w-]+)$/, "css-module:$1")
            .replace(/^_([\w-]+)_[a-z0-9]+_\d+$/, "css-module:$1"),
        )
        .join(" ");
      if (normalized === value) return undefined;

      el.attrs.set("class", normalized);
      return "changed";
    },
  },
  {
    id: "yaml-code-block-highlight",
    stage: "html",
    reason:
      "기준선은 yaml 문법이 이미 올라와 있을 때만 yaml 토큰에 색을 붙이는데, 그 여부가 쪽 렌더링 순서에 달려 빌드마다 달라진다. 문서에 하나뿐인 `yaml` 코드 블록(ai-integration/skill/doctor)은 하이라이트 없이 나왔고, Markdown 코드 블록의 frontmatter(ai-integration/skill)는 같은 소스의 기준선 빌드 사이에서도 붙었다 안 붙었다 했다. Astro 빌드는 yaml 문법을 미리 올려(`lib/content/satteri-options.ts`) 항상 색을 붙인다. 텍스트는 같아서 이 두 쪽에서만 Shiki 토큰 span을 풀어 비교한다.",
    match: /^ai-integration\/skill(?:\/doctor)?(?:\.html|\/index\.html)$/,
    element: (el) =>
      el.tag === "span" && el.attrs.get("style")?.startsWith("--shiki-") ? "unwrap" : undefined,
  },
  {
    id: "shiki-light-flake-date-picker",
    stage: "html",
    reason:
      "React Date Picker 쪽의 type table 인라인 코드는 같은 소스를 다시 빌드해도 Shiki light 색이 달라진다. 기준선의 react 아카이브 빌드 두 개(out-archive-react-1·2)에서 843곳이 달랐고(한쪽이 keyword·constant·string 색을 기본 전경색 #24292E로 떨어뜨림), Astro 기본 빌드에서도 빌드에 따라 연산자 색이 문자열 색으로 나온다. dark 색과 텍스트는 같아서 이 쪽에서만 light 색을 비교하지 않는다.",
    match: /^react\/(?:v3\/)?components\/date-picker(?:\.html|\/index\.html)$/,
    element: (el) => {
      const style = el.attrs.get("style");
      if (el.tag !== "span" || !style?.startsWith("--shiki-light:")) return undefined;
      el.attrs.set("style", style.replace(/^--shiki-light:#[0-9A-Fa-f]+/, "--shiki-light:«color»"));
      return "changed";
    },
  },
];
