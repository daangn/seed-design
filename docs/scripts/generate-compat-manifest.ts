import chalk from "chalk";
import { promises as fs } from "fs";
import path from "node:path";
import { registryBreeze } from "../registry/react/registry-breeze.js";
import { registryBlock } from "../registry/react/registry-block.js";
import { registryLib } from "../registry/react/registry-lib.js";
import { registryUI } from "../registry/react/registry-ui.js";
import { compatOverlays, type CompatOverlay } from "../registry/react/compat-overlays.js";
import type { Registry } from "../registry/schema.js";

/**
 * Compat manifest의 Layer 1 — npm과 registry 정의에 박제된 호환성 선언을 수집합니다.
 *
 * - 패키지 축: npm packument에서 모든 stable 버전의 peerDependencies(@seed-design/*만)와 배포일
 * - 스니펫 축: docs/registry/react/registry-*.ts 정의의 스니펫별 요구 범위
 * - Layer 2(compat-overlays.ts)는 그대로 overlays 필드에 병합되어 소비자가 declared ⊕ overlays로 계산
 *
 * 실행 시점: 루트 `version` 스크립트(changeset version 직후)에 체이닝되어,
 * Version Packages PR에 manifest 변경이 diff로 함께 잡힙니다. 수동 실행도 가능합니다:
 *   bun --filter @seed-design/docs generate:compat
 *
 * Version PR 시점에는 새 버전이 npm에 아직 없으므로, in-tree package.json의
 * 버전·peer 선언을 보충해 `publishedAt: null`로 포함합니다 (배포 후 재생성 시 npm 값으로 대체됨).
 * 네트워크(registry.npmjs.org)에 의존하므로 generate:all에는 포함하지 않습니다.
 */

const SEED_SCOPE = "@seed-design/";

const TARGET_PACKAGES = [
  "@seed-design/css",
  "@seed-design/react",
  "@seed-design/stackflow",
] as const;

const REACT_REGISTRIES: Registry[] = [registryUI, registryLib, registryBreeze, registryBlock];

interface Packument {
  versions: Record<string, { peerDependencies?: Record<string, string> }>;
  time: Record<string, string>;
}

export interface VersionCompat {
  version: string;
  /** npm 배포 시각. null이면 아직 npm에 배포되지 않은 in-tree 버전 (Version Packages PR 시점) */
  publishedAt: string | null;
  /** peerDependencies 중 @seed-design/* 만. 선언이 없으면 {} */
  peers: Record<string, string>;
}

export interface SnippetCompat {
  registryId: string;
  itemId: string;
  snippetPath: string;
  requires: Record<string, string>;
}

export interface CompatManifest {
  schemaVersion: 1;
  framework: "react";
  generatedAt: string;
  packages: Record<string, { versions: VersionCompat[] }>;
  snippets: SnippetCompat[];
  overlays: CompatOverlay[];
}

export function compareSemver(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

/** 프리릴리즈(`-` 포함)를 제외하고 semver 오름차순으로 정렬합니다. */
export function filterStableVersions(versions: string[]): string[] {
  return versions.filter((v) => !v.includes("-")).sort(compareSemver);
}

/** peerDependencies에서 @seed-design/* 만 추립니다. */
export function extractSeedPeers(
  peerDependencies?: Record<string, string>,
): Record<string, string> {
  if (!peerDependencies) return {};
  return Object.fromEntries(
    Object.entries(peerDependencies).filter(([pkg]) => pkg.startsWith(SEED_SCOPE)),
  );
}

export function collectPackageVersions(packument: Packument): VersionCompat[] {
  return filterStableVersions(Object.keys(packument.versions)).map((version) => ({
    version,
    publishedAt: packument.time[version] ?? "",
    peers: extractSeedPeers(packument.versions[version].peerDependencies),
  }));
}

/**
 * npm에 아직 없는 in-tree 버전(Version Packages PR 시점의 곧 배포될 버전)을 보충합니다.
 * 이미 npm에 존재하는 버전이면 npm 데이터(publishedAt 포함)를 그대로 둡니다.
 */
export function mergeInTreeVersion(
  versions: VersionCompat[],
  inTree: { version: string; peers: Record<string, string> },
): VersionCompat[] {
  if (inTree.version.includes("-")) return versions; // 프리릴리즈는 manifest 대상이 아님
  if (versions.some((v) => v.version === inTree.version)) return versions;
  return [...versions, { version: inTree.version, publishedAt: null, peers: inTree.peers }].sort(
    (a, b) => compareSemver(a.version, b.version),
  );
}

export function collectSnippets(registries: Registry[]): SnippetCompat[] {
  return registries.flatMap((registry) =>
    registry.items.flatMap((item) =>
      item.snippets.map((snippet) => ({
        registryId: registry.id,
        itemId: item.id,
        snippetPath: snippet.path,
        requires: snippet.dependencies ?? {},
      })),
    ),
  );
}

interface DeclarationEra {
  from: string;
  to: string;
  count: number;
  label: string;
}

/**
 * 사람용 요약을 위해 peer 선언의 "모양"이 같은 연속 구간을 묶습니다.
 * - 선언 없음 → "(선언 없음)"
 * - 모든 peer가 정확한 핀(x.y.z) → "정확한 핀 (lockstep)" — 1.0.x처럼 버전마다 핀 값이 달라도 한 구간으로 취급
 * - 그 외 → 범위 문자열 그대로 (범위가 바뀌면 구간 분리)
 */
export function summarizeDeclarationEras(versions: VersionCompat[]): DeclarationEra[] {
  const EXACT_PIN = /^\d+\.\d+\.\d+$/;

  const labelOf = (peers: Record<string, string>): string => {
    // 키 삽입 순서와 무관하게 같은 peers는 같은 라벨이 되도록 정렬한다
    const entries = Object.entries(peers).sort(([a], [b]) => a.localeCompare(b));
    if (entries.length === 0) return "(선언 없음)";
    if (entries.every(([, range]) => EXACT_PIN.test(range))) return "정확한 핀 (lockstep)";
    return entries.map(([pkg, range]) => `${pkg}: ${range}`).join(", ");
  };

  const eras: DeclarationEra[] = [];
  for (const { version, peers } of versions) {
    const label = labelOf(peers);
    const last = eras[eras.length - 1];
    if (last && last.label === label) {
      last.to = version;
      last.count += 1;
    } else {
      eras.push({ from: version, to: version, count: 1, label });
    }
  }
  return eras;
}

async function fetchPackument(pkg: string): Promise<Packument> {
  const url = `https://registry.npmjs.org/${encodeURIComponent(pkg)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as Packument;
}

function printSummary(manifest: CompatManifest) {
  console.log(chalk.bold("\n## 패키지별 peer 선언 변천 (요약)\n"));

  for (const [pkg, { versions }] of Object.entries(manifest.packages)) {
    console.log(chalk.bold(`### ${pkg} — stable ${versions.length}개\n`));
    const eras = summarizeDeclarationEras(versions);

    if (eras.length === 1 && eras[0].label === "(선언 없음)") {
      console.log("- @seed-design/* peer 선언 없음 (선언 주체가 아닌 패키지)\n");
      continue;
    }

    console.log("| 구간 | 버전 수 | @seed-design/* peer 선언 |");
    console.log("|---|---|---|");
    for (const era of eras) {
      const range = era.from === era.to ? era.from : `${era.from} ~ ${era.to}`;
      console.log(`| ${range} | ${era.count} | ${era.label} |`);
    }
    console.log("");
  }

  const requiresDistribution = new Map<string, number>();
  for (const snippet of manifest.snippets) {
    const key = JSON.stringify(snippet.requires);
    requiresDistribution.set(key, (requiresDistribution.get(key) ?? 0) + 1);
  }

  console.log(chalk.bold(`## 스니펫 요구 범위 분포 — 총 ${manifest.snippets.length}개\n`));
  console.log("| 요구 범위 | 스니펫 수 |");
  console.log("|---|---|");
  for (const [requires, count] of [...requiresDistribution.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`| \`${requires}\` | ${count} |`);
  }

  console.log(chalk.bold(`\n## 오버레이 (Layer 2) — ${manifest.overlays.length}건\n`));
}

async function main() {
  console.log(chalk.gray("Generating compat manifest..."));

  const packuments = await Promise.all(TARGET_PACKAGES.map(fetchPackument));

  const manifest: CompatManifest = {
    schemaVersion: 1,
    framework: "react",
    generatedAt: new Date().toISOString(),
    packages: Object.fromEntries(
      await Promise.all(
        TARGET_PACKAGES.map(async (pkg, i) => {
          // cwd는 docs — 모노레포의 in-tree package.json에서 곧 배포될 버전을 보충한다
          const inTreePath = path.join(
            process.cwd(),
            "..",
            "packages",
            pkg.slice(SEED_SCOPE.length),
            "package.json",
          );
          const inTree = JSON.parse(await fs.readFile(inTreePath, "utf8")) as {
            version: string;
            peerDependencies?: Record<string, string>;
          };
          const versions = mergeInTreeVersion(collectPackageVersions(packuments[i]), {
            version: inTree.version,
            peers: extractSeedPeers(inTree.peerDependencies),
          });
          return [pkg, { versions }] as const;
        }),
      ),
    ),
    snippets: collectSnippets(REACT_REGISTRIES),
    overlays: compatOverlays,
  };

  const outputDir = path.join(process.cwd(), "public", "__compat__");
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    path.join(outputDir, "index.json"),
    JSON.stringify({ schemaVersion: 1, frameworks: ["react"] }, null, 2),
    "utf8",
  );
  await fs.writeFile(path.join(outputDir, "react.json"), JSON.stringify(manifest, null, 2), "utf8");

  console.log(
    chalk.green(`Compat manifest generated at ${path.relative(process.cwd(), outputDir)}/`),
  );
  printSummary(manifest);
}

if (import.meta.main) {
  // --best-effort: docs 빌드에 체이닝될 때 사용. 네트워크 실패 시 빌드를 깨는 대신
  // 커밋되어 있는 스냅샷(docs/public/__compat__)을 그대로 서빙하도록 통과시킨다.
  const bestEffort = process.argv.includes("--best-effort");

  main().catch((error) => {
    if (bestEffort) {
      console.warn(
        chalk.yellow(
          "Failed to regenerate compat manifest; falling back to the committed snapshot:",
        ),
        error,
      );
      return;
    }
    console.error(chalk.red("Failed to generate compat manifest:"), error);
    process.exit(1);
  });
}
