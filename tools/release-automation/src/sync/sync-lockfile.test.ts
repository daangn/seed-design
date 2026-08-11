import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { reconcileSyncLockfile } from "./sync-lockfile";

const temporaryDirectories: string[] = [];

async function write(root: string, path: string, content: string): Promise<void> {
  const absolutePath = join(root, path);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content);
}

async function bunInstall(root: string, ...arguments_: string[]): Promise<number> {
  const child = Bun.spawn([process.execPath, "install", ...arguments_], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text()]);
  return child.exited;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

describe("sync lockfile reconciliation", () => {
  test("새 control-plane workspace를 lane lockfile에 스크립트 실행 없이 반영한다", async () => {
    const root = await mkdtemp(join(tmpdir(), "seed-sync-lockfile-test-"));
    temporaryDirectories.push(root);
    await write(
      root,
      "package.json",
      JSON.stringify({
        name: "fixture",
        private: true,
        workspaces: ["tools/*"],
        scripts: { preinstall: "touch lifecycle-ran" },
      }),
    );
    await write(
      root,
      "tools/existing/package.json",
      JSON.stringify({ name: "@seed-design/existing-tool", version: "0.0.0" }),
    );
    expect(await bunInstall(root, "--lockfile-only", "--ignore-scripts", "--no-immutable")).toBe(0);

    await write(
      root,
      "tools/release-automation/package.json",
      JSON.stringify({ name: "@seed-design/release-automation", version: "0.0.0" }),
    );
    await reconcileSyncLockfile(root);

    expect(await Bun.file(join(root, "bun.lock")).text()).toContain(
      "@seed-design/release-automation",
    );
    expect(await Bun.file(join(root, "lifecycle-ran")).exists()).toBe(false);
    expect(await bunInstall(root, "--lockfile-only", "--ignore-scripts", "--frozen-lockfile")).toBe(
      0,
    );
  });
});
