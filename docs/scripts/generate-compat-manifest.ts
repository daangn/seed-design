import chalk from "chalk";
import { promises as fs } from "fs";
import path from "node:path";
import { compatOverlays, type CompatOverlay } from "../registry/react/compat-overlays.js";

/**
 * Compat manifest — seed 패키지 간 호환성 데이터를 CLI가 읽을 수 있는 JSON으로 굽습니다.
 *
 * - Layer 1(`packages`): npm packument에서 모든 stable 버전의 peerDependencies(@seed-design/*만)와 배포일
 * - Layer 2(`overlays`): compat-overlays.ts를 그대로 실어 소비자가 declared ⊕ overlays로 계산
 *
 * ## 언제 다시 실행하나 — overlay를 편집했을 때만
 *
 * **버전이 배포될 때마다 돌릴 필요가 없습니다.** manifest에 없는 버전을 만나면 CLI가 설치본
 * package.json의 peer 선언으로 대신 판정하기 때문입니다(`resolveEffectivePeers`의 declaredFallback).
 * Layer 1도 결국 npm packument의 같은 선언이라 둘은 같은 아티팩트이고, 2.0부터는 SemVer가 지켜져
 * 그 선언이 곧 정답입니다. Layer 1은 1.x(선언이 부정확·누락되던 시기)를 박제해 둔 아카이브이자,
 * 설치돼 있지 않은 버전을 `compat --with`로 조회할 때 쓰는 근거입니다.
 *
 * 그래서 재실행 트리거는 "배포"가 아니라 "overlay 편집"입니다. compat-overlays.ts는 TS라
 * CLI가 직접 읽을 수 없으므로, known-bad 사고나 correction, 새 breaking-boundary를 추가했다면
 * 반드시 이 스크립트를 돌려 JSON에 반영하고 함께 커밋하세요:
 *   bun --filter @seed-design/docs generate:compat
 *
 * ## 하지 말아야 할 것
 *
 * - **릴리즈 파이프라인(`version`/`release` 스크립트) 체이닝 금지.** `changeset version` 시점엔
 *   해당 버전이 아직 npm에 없어 packument로 수집할 수 없습니다. 7423bfae에서 시도했다가
 *   `publishedAt: null` in-tree 보충 해킹이 따라붙어 4decf7d에서 되돌렸습니다.
 * - **generate:all 편입 금지.** 네트워크(registry.npmjs.org)에 의존해 CI/오프라인에서 깨집니다.
 * - **registry에서 파생되는 데이터를 싣지 말 것.** registry는 계속 커지므로 박제하는 순간
 *   낡습니다. 스니펫 요구 범위는 CLI가 라이브 `__registry__`에서 읽습니다.
 */

const SEED_SCOPE = "@seed-design/";

const TARGET_PACKAGES = [
  "@seed-design/css",
  "@seed-design/react",
  "@seed-design/stackflow",
] as const;

interface Packument {
  versions: Record<string, { peerDependencies?: Record<string, string> }>;
  time: Record<string, string>;
}

export interface VersionCompat {
  version: string;
  /** npm 배포 시각 (없으면 빈 문자열) */
  publishedAt: string;
  /** peerDependencies 중 @seed-design/* 만. 선언이 없으면 {} */
  peers: Record<string, string>;
}

export interface CompatManifest {
  schemaVersion: 1;
  framework: "react";
  generatedAt: string;
  packages: Record<string, { versions: VersionCompat[] }>;
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

  console.log(chalk.bold(`## 오버레이 (Layer 2) — ${manifest.overlays.length}건\n`));
}

async function main() {
  console.log(chalk.gray("Generating compat manifest..."));

  const packuments = await Promise.all(TARGET_PACKAGES.map(fetchPackument));

  const manifest: CompatManifest = {
    schemaVersion: 1,
    framework: "react",
    generatedAt: new Date().toISOString(),
    packages: Object.fromEntries(
      TARGET_PACKAGES.map((pkg, i) => [pkg, { versions: collectPackageVersions(packuments[i]) }]),
    ),
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
  main().catch((error) => {
    console.error(chalk.red("Failed to generate compat manifest:"), error);
    process.exit(1);
  });
}
