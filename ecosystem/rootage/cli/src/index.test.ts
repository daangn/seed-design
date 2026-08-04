import { expect, test } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const CLI = path.resolve(import.meta.dir, "./index.ts");
const JSDOC_PLUGIN = path.resolve(import.meta.dir, "../../core/src/plugins/jsdoc.ts");
const OUT = "./out";

async function withTempDir<T>(callback: (tempDir: string) => Promise<T>) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "rootage-cli-"));

  try {
    return await callback(tempDir);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

// cwd를 임시 디렉토리로 두므로 config는 cosmiconfig가 거기서 찾는다.
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
  await fs.writeFile(path.join(tempDir, "rootage.config.mjs"), `${body}\n`);
}

function readSpec(tempDir: string, id: string) {
  return fs.readFile(path.join(tempDir, OUT, `${id}.d.ts`), "utf-8");
}

test("config의 prefix가 생성 결과에 반영된다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(tempDir, `export default { prefix: "cfg" };`);

    const { exitCode } = await runComponentSpec(tempDir);
    expect(exitCode).toBe(0);

    expect(await readSpec(tempDir, "action-button")).toContain("var(--cfg-");
  });
});

test("--prefix 플래그가 config보다 우선한다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(tempDir, `export default { prefix: "cfg" };`);

    const { exitCode } = await runComponentSpec(tempDir, ["--prefix", "flag"]);
    expect(exitCode).toBe(0);

    const dts = await readSpec(tempDir, "action-button");
    expect(dts).toContain("var(--flag-");
    expect(dts).not.toContain("var(--cfg-");
  });
});

test("jsdoc 플러그인이 대상 dts에 주석을 붙이고 exclude는 건너뛴다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(
      tempDir,
      `import { jsdoc } from ${JSON.stringify(JSDOC_PLUGIN)};

export default {
  plugins: [
    jsdoc({ target: "ComponentSpec", exclude: ["typography"], text: "internal only", tag: "internal" }),
  ],
};`,
    );

    const { exitCode } = await runComponentSpec(tempDir);
    expect(exitCode).toBe(0);

    const dts = await readSpec(tempDir, "action-button");
    expect(dts).toStartWith("/**\n * internal only\n *\n * @internal\n */\n");
    expect(await readSpec(tempDir, "typography")).toStartWith("export declare const vars:");
    expect(await fs.readFile(path.join(tempDir, OUT, "action-button.mjs"), "utf-8")).not.toContain(
      "@internal",
    );
  });
});

test("config가 없으면 주석 없이 생성된다", async () => {
  await withTempDir(async (tempDir) => {
    const { exitCode } = await runComponentSpec(tempDir);
    expect(exitCode).toBe(0);

    expect(await readSpec(tempDir, "action-button")).toStartWith("export declare const vars:");
  });
});

test("잘못된 config는 어긋난 키를 짚는 에러로 실패한다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(tempDir, `export default { plugins: [{ transform: () => "" }] };`);

    const { stderr, exitCode } = await runComponentSpec(tempDir);

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("plugins[0].name must be a non-empty string");
  });
});

test("플러그인 transform의 예외는 플러그인 이름으로 귀속된다", async () => {
  await withTempDir(async (tempDir) => {
    await writeConfig(
      tempDir,
      `export default {
  plugins: [{ name: "boom", transform: () => { throw new Error("nope"); } }],
};`,
    );

    const { stderr, exitCode } = await runComponentSpec(tempDir);

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("[boom] transform failed");
  });
});
