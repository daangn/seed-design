import { access, readFile, realpath } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  mapSeedComponent,
  type ComponentMapResult,
  type ComponentPlatform,
} from "../../seed-component-map/scripts/component-map";

export type ScaffoldPlatform = ComponentPlatform | "cross-platform";
export type DeliverySurface = "package-only" | "snippet-only" | "package+snippet" | "docs-only";
export type ScaffoldBoundary = "source" | "generated" | "reference";

export interface ScaffoldPlanInput {
  component: string;
  platform: ScaffoldPlatform;
  deliverySurface: DeliverySurface;
}

export interface ScaffoldPlanItem {
  path: string;
  action: "create" | "update" | "generate" | "existing";
  boundary: ScaffoldBoundary;
  editable: boolean;
  reason: string;
}

export interface ScaffoldConflict {
  path: string;
  reason: string;
}

export interface ScaffoldPlanResult {
  input: ScaffoldPlanInput;
  component: ComponentMapResult["component"];
  currentSurface: ComponentMapResult;
  items: ScaffoldPlanItem[];
  conflicts: ScaffoldConflict[];
  boundaries: {
    rule: string;
  };
  readOnly: true;
}

const REPOSITORY_NAME = "@seed-design/project";

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

async function repositoryName(directory: string): Promise<string | undefined> {
  try {
    const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8")) as {
      name?: unknown;
    };
    return typeof manifest.name === "string" ? manifest.name : undefined;
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return undefined;
    throw error;
  }
}

async function findRepositoryRoot(start = process.cwd()): Promise<string> {
  let current = await realpath(start);
  for (;;) {
    if ((await repositoryName(current)) === REPOSITORY_NAME) return current;
    const parent = dirname(current);
    if (parent === current) throw new Error("SEED Design 저장소 안에서 실행해야 합니다.");
    current = parent;
  }
}

function item(
  path: string,
  action: ScaffoldPlanItem["action"],
  boundary: ScaffoldBoundary,
  reason: string,
): ScaffoldPlanItem {
  return { path, action, boundary, editable: boundary !== "generated", reason };
}

function packageItems(platform: ComponentPlatform, pascal: string): ScaffoldPlanItem[] {
  const packageName = platform === "react" ? "react" : "lynx-react";
  const base = `packages/${packageName}/src/components/${pascal}`;
  return [
    item(`${base}/${pascal}.tsx`, "create", "source", `${platform} 구현 원천`),
    item(`${base}/index.ts`, "create", "source", `${platform} 컴포넌트 공개 entry`),
    item(
      `packages/${packageName}/src/components/index.ts`,
      "update",
      "source",
      `${platform} 컴포넌트 barrel`,
    ),
  ];
}

function currentPackageItems(
  platform: ComponentPlatform,
  map: ComponentMapResult,
): ScaffoldPlanItem[] {
  const surfaces = [
    ["구현", map.implementations[platform]],
    ["Headless", map.headless[platform]],
    ["공개 export", map.packageExports[platform]],
  ] as const;
  return surfaces.flatMap(([surface, paths]) =>
    paths.map((path) => item(path, "existing", "source", `${platform} 현재 ${surface} 표면`)),
  );
}

function packagePlanItems(
  platform: ComponentPlatform,
  map: ComponentMapResult,
): ScaffoldPlanItem[] {
  const current = currentPackageItems(platform, map);
  return current.length > 0 ? current : packageItems(platform, map.component.pascal);
}

function snippetItems(platform: ComponentPlatform, kebab: string): ScaffoldPlanItem[] {
  return [
    item(
      `docs/registry/${platform}/ui/${kebab}.tsx`,
      "create",
      "source",
      `${platform} Registry snippet 원천`,
    ),
    item(
      `docs/registry/${platform}/registry-ui.ts`,
      "update",
      "source",
      `${platform} Registry 목록`,
    ),
    item(
      `docs/public/__registry__/${platform}/ui/${kebab}.json`,
      "generate",
      "generated",
      "Registry 생성물",
    ),
  ];
}

function documentationItems(platform: ComponentPlatform, kebab: string): ScaffoldPlanItem[] {
  const documentationPath =
    platform === "react"
      ? `docs/content/react/components/${kebab}.mdx`
      : `docs/content/lynx/components/${kebab}.mdx`;
  return [
    item(documentationPath, "create", "reference", `${platform} 사용자 문서`),
    item(
      `docs/examples/${platform}/${kebab}/preview.tsx`,
      "create",
      "reference",
      `${platform} 실행 예제`,
    ),
    item("docs/public/__docs__/index.json", "generate", "generated", "문서 생성물"),
  ];
}

function selectedPlatforms(platform: ScaffoldPlatform): ComponentPlatform[] {
  return platform === "cross-platform" ? ["react", "lynx"] : [platform];
}

function platformItems(
  platform: ComponentPlatform,
  deliverySurface: DeliverySurface,
  map: ComponentMapResult,
): ScaffoldPlanItem[] {
  const includesPackage = ["package-only", "package+snippet"].includes(deliverySurface);
  const includesSnippet = ["snippet-only", "package+snippet"].includes(deliverySurface);
  return [
    ...(includesPackage ? packagePlanItems(platform, map) : []),
    ...(includesSnippet ? snippetItems(platform, map.component.kebab) : []),
    ...documentationItems(platform, map.component.kebab),
  ];
}

function plannedItems(input: ScaffoldPlanInput, map: ComponentMapResult): ScaffoldPlanItem[] {
  const byPath = new Map<string, ScaffoldPlanItem>();
  for (const platform of selectedPlatforms(input.platform)) {
    for (const target of platformItems(platform, input.deliverySurface, map)) {
      byPath.set(target.path, target);
    }
  }

  return [...byPath.values()].sort((left, right) => left.path.localeCompare(right.path));
}

function assertUnambiguous(map: ComponentMapResult): void {
  if (map.component.state !== "ambiguous") return;
  const candidates = map.ambiguities.map(({ candidate }) => candidate).join(", ");
  throw new Error(`컴포넌트 이름이 모호합니다. 정확한 후보를 지정하세요: ${candidates}`);
}

function existingConflict(path: string, reason: string): ScaffoldConflict {
  return { path, reason };
}

async function resolveTarget(
  root: string,
  target: ScaffoldPlanItem,
): Promise<{ item: ScaffoldPlanItem; conflict?: ScaffoldConflict }> {
  if (target.action === "existing") {
    return {
      item: target,
      conflict: existingConflict(
        target.path,
        "현재 패키지 표면입니다. 새 기본 경로를 만들지 말고 기존 구현을 검토해야 합니다.",
      ),
    };
  }
  if (target.action !== "create" || !(await pathExists(root, target.path))) {
    return { item: target };
  }
  return {
    item: { ...target, action: "existing" },
    conflict: existingConflict(
      target.path,
      "새로 만들 대상이 이미 있습니다. 덮어쓰지 말고 현재 구현을 검토해야 합니다.",
    ),
  };
}

async function pathExists(root: string, path: string): Promise<boolean> {
  try {
    await access(join(root, path));
    return true;
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return false;
    throw error;
  }
}

/** 확정된 플랫폼과 공개 표면으로 실제 쓰기 전 읽기 전용 파일 계획을 만듭니다. */
export async function createScaffoldPlan(input: ScaffoldPlanInput): Promise<ScaffoldPlanResult> {
  const [root, map] = await Promise.all([findRepositoryRoot(), mapSeedComponent(input.component)]);
  assertUnambiguous(map);
  const resolved = await Promise.all(
    plannedItems(input, map).map((target) => resolveTarget(root, target)),
  );

  return {
    input,
    component: map.component,
    currentSurface: map,
    items: resolved.map(({ item }) => item),
    conflicts: resolved.flatMap(({ conflict }) => (conflict ? [conflict] : [])),
    boundaries: {
      rule: "source와 reference만 편집합니다. generated는 원천 변경 뒤 생성 명령으로 갱신합니다.",
    },
    readOnly: true,
  };
}

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function parsePlatform(value: string | undefined): ScaffoldPlatform {
  if (value === "react" || value === "lynx" || value === "cross-platform") return value;
  throw new Error("--platform은 react, lynx, cross-platform 중 하나여야 합니다.");
}

function parseDeliverySurface(value: string | undefined): DeliverySurface {
  if (
    value === "package-only" ||
    value === "snippet-only" ||
    value === "package+snippet" ||
    value === "docs-only"
  ) {
    return value;
  }
  throw new Error(
    "--surface는 package-only, snippet-only, package+snippet, docs-only 중 하나여야 합니다.",
  );
}

async function runCli(args: string[]): Promise<void> {
  try {
    const component = args[0];
    if (!component) {
      throw new Error(
        "사용법: bun skills/seed-create-component/scripts/scaffold-plan.ts <component> --platform <platform> --surface <surface>",
      );
    }
    const result = await createScaffoldPlan({
      component,
      platform: parsePlatform(option(args, "--platform")),
      deliverySurface: parseDeliverySurface(option(args, "--surface")),
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.main) await runCli(Bun.argv.slice(2));
