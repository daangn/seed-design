import { existsSync, readFileSync } from "node:fs";
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

/** 단일 id 조회. id에 scope/target이 인코딩돼 있어 글로벌 인덱스 없이 파일을 특정한다. */
export function getGuidelineById(id: string): GuidelineItem | undefined {
  const match = /^G-([CFP])-(.+)-(\d{3})$/.exec(id);
  if (!match) return undefined;

  const scope = SCOPE_BY_PREFIX[match[1]];
  const target = match[2];

  try {
    return readSpec(scope, target).guidelines.find((item) => item.id === id);
  } catch {
    return undefined;
  }
}
