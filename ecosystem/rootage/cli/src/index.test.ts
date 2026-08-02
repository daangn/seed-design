import { expect, test } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const CLI = path.resolve(import.meta.dir, "./index.ts");
const OUT = "./out";

async function withTempDir<T>(callback: (tempDir: string) => Promise<T>) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "rootage-cli-"));

  try {
    return await callback(tempDir);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

/** cwd를 임시 디렉토리로 두므로 config는 cosmiconfig가 거기서 찾는다. */
async function runComponentSpec(tempDir: string, args: string[] = []) {
  const proc = Bun.spawn(["bun", CLI, "component-spec", OUT, ...args], {
    cwd: tempDir,
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stderr, exitCode] = await Promise.all([new Response(proc.stderr).text(), proc.exited]);

  return { stderr, exitCode };
}

async function writeConfig(tempDir: string, body: string) {
  await fs.writeFile(path.join(tempDir, "rootage.config.mjs"), `export default ${body};\n`);
}

function readSpec(tempDir: string, id: string) {
  return fs.readFile(path.join(tempDir, OUT, `${id}.d.ts`), "utf-8");
}

test("config의 prefix가 생성 결과에 반영된다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(tempDir, `{ prefix: "cfg" }`);

    const { exitCode } = await runComponentSpec(tempDir);
    expect(exitCode).toBe(0);

    expect(await readSpec(tempDir, "action-button")).toContain("var(--cfg-");
  });
});

test("--prefix 플래그가 config보다 우선한다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(tempDir, `{ prefix: "cfg" }`);

    const { exitCode } = await runComponentSpec(tempDir, ["--prefix", "flag"]);
    expect(exitCode).toBe(0);

    const dts = await readSpec(tempDir, "action-button");
    expect(dts).toContain("var(--flag-");
    expect(dts).not.toContain("var(--cfg-");
  });
});

test("dtsBanner의 content가 붙고 ignore한 spec은 제외된다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(
      tempDir,
      `{ componentSpec: { dtsBanner: { content: "/** marked */", ignore: ["typography"] } } }`,
    );

    const { exitCode } = await runComponentSpec(tempDir);
    expect(exitCode).toBe(0);

    expect(await readSpec(tempDir, "action-button")).toStartWith("/** marked */\n");
    expect(await readSpec(tempDir, "typography")).toStartWith("export declare const vars:");
  });
});

test("config가 없으면 배너를 붙이지 않는다", async () => {
  await withTempDir(async (tempDir) => {
    const { exitCode } = await runComponentSpec(tempDir);
    expect(exitCode).toBe(0);

    expect(await readSpec(tempDir, "action-button")).toStartWith("export declare const vars:");
  });
});

test("잘못된 config는 명확한 에러로 실패한다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(tempDir, `{ componentSpec: { dtsBanner: { ignore: ["typography"] } } }`);

    const { stderr, exitCode } = await runComponentSpec(tempDir);

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("componentSpec.dtsBanner.content must be a string");
  });
});
