import { rm } from "node:fs/promises";
import { join } from "node:path";
import { sha256 } from "./sync";

export const controlPlanePaths = [
  ".github/actions",
  ".github/workflows",
  "tools/release-automation",
  "tools/rootage-cdn",
] as const;

export function isControlPlanePath(path: string): boolean {
  return controlPlanePaths.some(
    (controlPath) => path === controlPath || path.startsWith(`${controlPath}/`),
  );
}

async function git(
  repositoryPath: string,
  arguments_: string[],
  allowFailure = false,
): Promise<{ code: number; output: string }> {
  const child = Bun.spawn(["git", ...arguments_], {
    cwd: repositoryPath,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  const output = `${stdout}${stderr}`.trim();
  if (code !== 0 && !allowFailure) {
    throw new Error(`git ${arguments_.join(" ")} 실패:\n${output}`);
  }
  return { code, output };
}

export async function controlPlaneFingerprint(
  repositoryPath: string,
  controlSha: string,
): Promise<string> {
  const tree = await git(repositoryPath, [
    "ls-tree",
    "-r",
    "--full-tree",
    controlSha,
    "--",
    ...controlPlanePaths,
  ]);
  if (!tree.output) throw new Error("control-plane tree가 비어 있습니다.");
  return sha256(`${tree.output}\n`);
}

export async function isTrustedDevControlCommit(
  repositoryPath: string,
  controlSha: string,
): Promise<boolean> {
  return (
    (await git(repositoryPath, ["merge-base", "--is-ancestor", controlSha, "origin/dev"], true))
      .code === 0
  );
}

export async function applyControlPlaneOverlay(
  repositoryPath: string,
  controlSha: string,
): Promise<void> {
  for (const path of controlPlanePaths) {
    await rm(join(repositoryPath, path), { recursive: true, force: true });
  }
  await git(repositoryPath, [
    "rm",
    "-r",
    "-f",
    "--cached",
    "--ignore-unmatch",
    "--",
    ...controlPlanePaths,
  ]);
  const existingPaths: string[] = [];
  for (const path of controlPlanePaths) {
    if ((await git(repositoryPath, ["cat-file", "-e", `${controlSha}:${path}`], true)).code === 0) {
      existingPaths.push(path);
    }
  }
  if (existingPaths.length === 0) throw new Error("trusted control-plane tree가 비어 있습니다.");
  await git(repositoryPath, [
    "restore",
    `--source=${controlSha}`,
    "--staged",
    "--worktree",
    "--",
    ...existingPaths,
  ]);
}
