import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse } from "yaml";

// 독립 패키지 packages/guidelines의 YAML을 빌드 타임에 그대로 읽는다(zero-build, SSOT).
// generate 단계 없이 docs가 직접 소비하며, id 구조(G-{C|F|P}-{target}-{NNN})를
// 역파싱해 어느 문서에서든 단일 id 조회가 가능하다.

export type GuidelineType = "do" | "dont";
export type GuidelineScope = "component" | "foundation" | "pattern";

export interface GuidelineItem {
  id: string;
  type: GuidelineType;
  group?: string;
  statement: string;
  description?: string;
  refs?: string[];
  deprecated?: boolean;
  reason?: string;
  detectable?: boolean;
}

export interface GuidelineSpec {
  kind: "GuidelineSpec";
  metadata: { target: string; scope: GuidelineScope };
  guidelines: GuidelineItem[];
}

const SCOPE_BY_PREFIX: Record<string, GuidelineScope> = {
  C: "component",
  F: "foundation",
  P: "pattern",
};

let cachedRoot: string | undefined;

/** process.cwd()에서 위로 올라가며 packages/guidelines를 찾는다. */
function guidelinesRoot(): string {
  if (cachedRoot) return cachedRoot;

  let dir = process.cwd();
  // biome-ignore lint/suspicious/noConstantCondition: 부모 디렉토리가 자기 자신이 되면 종료한다.
  while (true) {
    const candidate = join(dir, "packages", "guidelines");
    if (existsSync(join(candidate, "guideline.schema.json"))) {
      cachedRoot = candidate;
      return cachedRoot;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error(`[guidelines] packages/guidelines를 찾지 못했습니다 (from ${process.cwd()})`);
}

function readSpec(scope: GuidelineScope, target: string): GuidelineSpec {
  const file = join(guidelinesRoot(), scope, `${target}.yaml`);
  return parse(readFileSync(file, "utf-8")) as GuidelineSpec;
}

/** 한 target(컴포넌트/파운데이션/패턴)의 가이드라인 전체. deprecated 항목은 제외. */
export function getGuidelinesByTarget(
  target: string,
  scope: GuidelineScope = "component",
): GuidelineItem[] {
  return readSpec(scope, target).guidelines.filter((item) => !item.deprecated);
}

/**
 * 단일 id 조회. id 접두사(G-{C|F|P}-)로 scope를 알아내고 그 디렉토리의 yaml을 스캔해
 * id가 일치하는 항목을 찾는다. (슬러그 id는 target/slug 구분자가 없어 경로를 역산할 수 없으므로
 * scope 디렉토리만 좁혀 스캔한다. id는 전역 유일이라 충돌 없음.)
 */
export function getGuidelineById(id: string): GuidelineItem | undefined {
  const match = /^G-([CFP])-/.exec(id);
  if (!match) return undefined;

  const dir = join(guidelinesRoot(), SCOPE_BY_PREFIX[match[1]]);
  if (!existsSync(dir)) return undefined;

  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
    const spec = parse(readFileSync(join(dir, file), "utf-8")) as GuidelineSpec;
    const found = spec.guidelines?.find((item) => item.id === id);
    if (found) return found;
  }
  return undefined;
}
