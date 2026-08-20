import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { LYNX_WEB_CORE_STYLES_FILENAME } from "./constants.js";

const require = createRequire(import.meta.url);

const SEED_LYNX_WEB_PREVIEW_OVERRIDES = `
/* 문서 사이트와 같은 방식으로 Lynx 미리보기의 글꼴을 렌더링합니다. */
:host {
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 브라우저 기본 textarea padding이 TextField의 내부 여백과 겹치지 않도록 제거합니다. */
x-textarea:defined::part(textarea) {
  padding: 0;
}

/* WebLynx는 flex item인 text를 상단에 배치하므로 선택 컴포넌트 label의 첫 줄만 중앙에 맞춥니다. */
.seed-radio__label--size_medium,
.seed-checkbox__label--size_medium {
  margin-top: calc(var(--seed-dimension-x8) / 2 - var(--seed-line-height-t4) / 2);
}

.seed-radio__label--size_large,
.seed-checkbox__label--size_large {
  margin-top: calc(var(--seed-dimension-x9) / 2 - var(--seed-line-height-t5) / 2);
}
`;

function resolveCssImport(specifier: string, originatingFile: string) {
  if (specifier.startsWith(".")) return resolve(dirname(originatingFile), specifier);
  return require.resolve(specifier, { paths: [dirname(originatingFile)] });
}

export async function inlineCssImports(path: string, ancestors: string[] = []): Promise<string> {
  if (ancestors.includes(path)) {
    throw new Error(`Lynx Web CSS import가 순환합니다: ${[...ancestors, path].join(" -> ")}`);
  }

  const css = await readFile(path, "utf8");
  const importPattern = /@import\s+url\((?:"([^"]+)"|'([^']+)'|([^\s)]+))\)\s*;/g;
  const chunks: string[] = [];
  let cursor = 0;

  for (const match of css.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2] ?? match[3];
    if (!specifier || match.index == null) continue;
    chunks.push(css.slice(cursor, match.index));
    chunks.push(await inlineCssImports(resolveCssImport(specifier, path), [...ancestors, path]));
    cursor = match.index + match[0].length;
  }

  chunks.push(css.slice(cursor));
  return chunks.join("\n");
}

export async function bundleLynxWebCoreStyles() {
  const packageJsonPath = require.resolve("@lynx-js/web-core/package.json");
  const entryPath = resolve(dirname(packageJsonPath), "css/in_shadow.css");
  const css = await inlineCssImports(entryPath);

  if (/@import\s/.test(css)) {
    throw new Error("Lynx Web Shadow DOM CSS에 해석되지 않은 @import가 남아 있습니다.");
  }
  if (!css.includes("box-sizing: border-box") || !css.includes("var(--flex-direction)")) {
    throw new Error("Lynx Web Shadow DOM CSS에 필수 layout 규칙이 없습니다.");
  }

  return `${css}\n${SEED_LYNX_WEB_PREVIEW_OVERRIDES}`;
}

export async function writeLynxWebCoreStyles(directory: string) {
  await mkdir(directory, { recursive: true });
  const targetPath = resolve(directory, LYNX_WEB_CORE_STYLES_FILENAME);
  const temporaryPath = resolve(directory, `.${LYNX_WEB_CORE_STYLES_FILENAME}-${process.pid}`);
  await writeFile(temporaryPath, await bundleLynxWebCoreStyles());
  await rename(temporaryPath, targetPath);
}
