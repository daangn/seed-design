import { join } from "node:path";

export async function reconcileSyncLockfile(repositoryPath: string): Promise<void> {
  const packageJsonExists = await Bun.file(join(repositoryPath, "package.json")).exists();
  const lockfileExists = await Bun.file(join(repositoryPath, "bun.lock")).exists();

  if (!packageJsonExists && !lockfileExists) return;
  if (!packageJsonExists || !lockfileExists) {
    throw new Error("sync lockfile 재계산에 필요한 package.json 또는 bun.lock이 없습니다.");
  }

  const child = Bun.spawn(
    [process.execPath, "install", "--lockfile-only", "--ignore-scripts", "--no-immutable"],
    {
      cwd: repositoryPath,
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) {
    throw new Error(`sync lockfile 재계산 실패:\n${stdout}${stderr}`.trim());
  }
}
