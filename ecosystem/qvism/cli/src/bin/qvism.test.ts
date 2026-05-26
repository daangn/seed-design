import { expect, test } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

async function withTempDir<T>(callback: (tempDir: string) => Promise<T>) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "qvism-cli-"));

  try {
    return await callback(tempDir);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function writeConfig(tempDir: string, generateLayeredCss?: boolean) {
  const configPath = path.join(tempDir, "qvism.config.mjs");
  const generateLayeredCssOption =
    generateLayeredCss === undefined
      ? ""
      : `  generateLayeredCss: ${JSON.stringify(generateLayeredCss)},\n`;

  await fs.writeFile(
    configPath,
    `export default {
${generateLayeredCssOption}  theme: {
    tokens: { _raw: "" },
    recipes: {
      badge: {
        name: "badge",
        base: { color: "red" },
        variants: {},
        defaultVariants: {},
      },
    },
    keyframes: {},
  },
};
`,
  );

  return configPath;
}

async function runQvism(args: string[]) {
  const proc = Bun.spawn(["bun", "ecosystem/qvism/cli/src/bin/qvism.ts", ...args], {
    cwd: path.resolve(import.meta.dir, "../../../../.."),
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  return { stdout, stderr, exitCode };
}

async function expectFile(filePath: string) {
  await expect(fs.stat(filePath)).resolves.toBeDefined();
}

async function expectNoFile(filePath: string) {
  await expect(fs.stat(filePath)).rejects.toThrow();
}

test("generates layered output by default", async () => {
  await withTempDir(async (tempDir) => {
    // given
    const outputDir = path.join(tempDir, "dist");
    const recipesDir = path.join(outputDir, "recipes");
    await fs.mkdir(recipesDir, { recursive: true });
    const configPath = await writeConfig(tempDir);

    // when
    const result = await runQvism([
      "--dir",
      outputDir,
      "--recipesDir",
      recipesDir,
      "--config",
      configPath,
    ]);

    // then
    expect(result.exitCode).toBe(0);
    await expectFile(path.join(outputDir, "all.layered.css"));
    await expectFile(path.join(outputDir, "all.layered.min.css"));
    await expectFile(path.join(outputDir, "base.layered.css"));
    await expectFile(path.join(outputDir, "base.layered.min.css"));
    await expectFile(path.join(recipesDir, "badge.layered.css"));
    await expectFile(path.join(recipesDir, "badge.layered.mjs"));
  });
});

test("config can disable layered output and stale layered files are removed", async () => {
  await withTempDir(async (tempDir) => {
    // given
    const outputDir = path.join(tempDir, "dist");
    const recipesDir = path.join(outputDir, "recipes");
    await fs.mkdir(recipesDir, { recursive: true });
    await Promise.all([
      fs.writeFile(path.join(outputDir, "all.layered.css"), "stale"),
      fs.writeFile(path.join(outputDir, "all.layered.min.css"), "stale"),
      fs.writeFile(path.join(outputDir, "base.layered.css"), "stale"),
      fs.writeFile(path.join(outputDir, "base.layered.min.css"), "stale"),
      fs.writeFile(path.join(recipesDir, "badge.layered.css"), "stale"),
      fs.writeFile(path.join(recipesDir, "badge.layered.mjs"), "stale"),
    ]);
    const configPath = await writeConfig(tempDir, false);

    // when
    const result = await runQvism([
      "--dir",
      outputDir,
      "--recipesDir",
      recipesDir,
      "--config",
      configPath,
    ]);

    // then
    expect(result.exitCode).toBe(0);
    await expectFile(path.join(outputDir, "all.css"));
    await expectFile(path.join(outputDir, "all.min.css"));
    await expectFile(path.join(outputDir, "base.css"));
    await expectFile(path.join(outputDir, "base.min.css"));
    await expectFile(path.join(recipesDir, "badge.css"));
    await expectFile(path.join(recipesDir, "badge.mjs"));
    await expectFile(path.join(recipesDir, "badge.d.ts"));
    await expectNoFile(path.join(outputDir, "all.layered.css"));
    await expectNoFile(path.join(outputDir, "all.layered.min.css"));
    await expectNoFile(path.join(outputDir, "base.layered.css"));
    await expectNoFile(path.join(outputDir, "base.layered.min.css"));
    await expectNoFile(path.join(recipesDir, "badge.layered.css"));
    await expectNoFile(path.join(recipesDir, "badge.layered.mjs"));
  });
});

test("--no-layered overrides config layered output", async () => {
  await withTempDir(async (tempDir) => {
    // given
    const outputDir = path.join(tempDir, "dist");
    const recipesDir = path.join(outputDir, "recipes");
    await fs.mkdir(recipesDir, { recursive: true });
    const configPath = await writeConfig(tempDir, true);

    // when
    const result = await runQvism([
      "--dir",
      outputDir,
      "--recipesDir",
      recipesDir,
      "--config",
      configPath,
      "--no-layered",
    ]);

    // then
    expect(result.exitCode).toBe(0);
    await expectFile(path.join(outputDir, "all.css"));
    await expectFile(path.join(recipesDir, "badge.css"));
    await expectNoFile(path.join(outputDir, "all.layered.css"));
    await expectNoFile(path.join(recipesDir, "badge.layered.mjs"));
  });
});

test("--layered overrides config disabled layered output", async () => {
  await withTempDir(async (tempDir) => {
    // given
    const outputDir = path.join(tempDir, "dist");
    const recipesDir = path.join(outputDir, "recipes");
    await fs.mkdir(recipesDir, { recursive: true });
    const configPath = await writeConfig(tempDir, false);

    // when
    const result = await runQvism([
      "--dir",
      outputDir,
      "--recipesDir",
      recipesDir,
      "--config",
      configPath,
      "--layered",
    ]);

    // then
    expect(result.exitCode).toBe(0);
    await expectFile(path.join(outputDir, "all.layered.css"));
    await expectFile(path.join(outputDir, "base.layered.css"));
    await expectFile(path.join(recipesDir, "badge.layered.css"));
    await expectFile(path.join(recipesDir, "badge.layered.mjs"));
  });
});
