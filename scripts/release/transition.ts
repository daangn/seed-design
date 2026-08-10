import { readFile, writeFile } from "node:fs/promises";
import type { LaneName, TransitionCommand } from "./types";

interface PreState {
  mode: "pre" | "exit";
  tag: string;
  initialVersions: Record<string, string>;
  changesets: string[];
}

export interface TransitionPlan {
  command: TransitionCommand;
  lane: Exclude<LaneName, "dev">;
  tag?: string;
  bunCommand?: string[];
}

export function validatePrereleaseTag(tag: string, protectedTags: string[]): string {
  const normalized = tag.trim().toLowerCase();
  if (!/^[a-z][a-z0-9-]{0,31}$/.test(normalized)) {
    throw new Error(
      "pre-release tag는 영문 소문자로 시작하는 1~32자의 영문·숫자·하이픈이어야 합니다.",
    );
  }
  if (protectedTags.includes(normalized)) {
    throw new Error(`'${normalized}'은 stable용으로 보호된 dist-tag입니다.`);
  }
  return normalized;
}

export function planTransition(
  lane: LaneName,
  command: TransitionCommand,
  tag: string | undefined,
  preState: PreState | null,
  protectedTags: string[],
): TransitionPlan {
  if (lane === "dev") throw new Error("dev 레인은 pre-release 상태 전환을 지원하지 않습니다.");

  if (command === "enter") {
    const nextTag = validatePrereleaseTag(tag ?? "beta", protectedTags);
    if (preState) throw new Error(`${lane} 레인은 이미 '${preState.tag}' pre-release 상태입니다.`);
    return {
      command,
      lane,
      tag: nextTag,
      bunCommand: ["bun", "changeset", "pre", "enter", nextTag],
    };
  }

  if (!preState || preState.mode !== "pre") {
    throw new Error(`${lane} 레인은 pre-release 상태가 아닙니다.`);
  }

  if (command === "retag") {
    const nextTag = validatePrereleaseTag(tag ?? "beta", protectedTags);
    if (preState.tag === nextTag)
      throw new Error(`${lane} 레인은 이미 '${nextTag}' tag를 사용합니다.`);
    return { command, lane, tag: nextTag };
  }

  return { command, lane, bunCommand: ["bun", "changeset", "pre", "exit"] };
}

export async function readPreState(path = ".changeset/pre.json"): Promise<PreState | null> {
  const file = Bun.file(path);
  if (!(await file.exists())) return null;
  return JSON.parse(await readFile(path, "utf8")) as PreState;
}

export async function applyTransition(plan: TransitionPlan): Promise<void> {
  if (plan.command === "retag") {
    const state = await readPreState();
    if (!state || !plan.tag) throw new Error("retag에 필요한 pre-release 상태가 없습니다.");
    state.tag = plan.tag;
    await writeFile(".changeset/pre.json", `${JSON.stringify(state, null, 2)}\n`);
    return;
  }

  if (!plan.bunCommand) throw new Error("실행할 Changesets 명령이 없습니다.");
  const child = Bun.spawn(plan.bunCommand, { stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0)
    throw new Error(`Changesets 상태 전환이 종료 코드 ${exitCode}로 실패했습니다.`);
}
