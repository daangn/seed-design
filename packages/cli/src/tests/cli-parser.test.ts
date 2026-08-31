import { describe, expect, it } from "bun:test";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "../../../..");

/**
 * What the parser answers before any command runs.
 *
 * Every case here reaches an exit code without a network call, so none of them needs a
 * fixture server. The one that matters most is the unknown command: it used to print
 * nothing and exit 0, which reads as success to anything checking the code.
 */
async function runCli(args: string[]) {
  const proc = Bun.spawn({
    cmd: [process.execPath, "packages/cli/src/index.ts", ...args],
    cwd: repoRoot,
    env: { ...process.env, DISABLE_TELEMETRY: "true", FORCE_COLOR: "0" },
    stderr: "pipe",
    stdout: "pipe",
    stdin: "ignore",
  });

  const [exitCode, stdout, stderr] = await Promise.all([
    proc.exited,
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  return { exitCode, stderr, stdout };
}

describe("cli parser", () => {
  it("exits 1 with an empty stdout on an unknown command", async () => {
    const result = await runCli(["bogus-command"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
  });

  it("exits 1 with an empty stdout on an unknown option", async () => {
    const result = await runCli(["docs", "list", "--nope"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
  });

  it("rejects a value outside an option's choices", async () => {
    const result = await runCli(["add", "--framework", "svelte"]);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("svelte");
  });

  it("names every command in the help, on stdout", async () => {
    const result = await runCli(["--help"]);

    expect(result.exitCode).toBe(0);
    for (const name of ["add", "add-all", "compat", "docs", "init"]) {
      expect(result.stdout).toContain(`seed-design ${name}`);
    }
  });

  it("keeps an option value that looks like a number as the string it was", async () => {
    // cac coerced `1.50` to 1.5 and lost the trailing zero, which is why the CLI used to
    // read this flag straight out of rawArgs.
    const result = await runCli(["add", "--seed-react-version", "1.50"]);

    expect(result.exitCode).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toContain("1.50");
  });

  it("declares both spellings of every multi-word option", async () => {
    const [add, addAll] = await Promise.all([
      runCli(["add", "--help"]),
      runCli(["add-all", "--help"]),
    ]);

    for (const name of [
      "--baseUrl",
      "--base-url",
      "--seed-react-version",
      "--seedReactVersion",
      "--on-diff",
      "--onDiff",
    ]) {
      expect(add.stdout).toContain(name);
    }
    for (const name of ["--include-deprecated", "--includeDeprecated"]) {
      expect(addAll.stdout).toContain(name);
    }
  });

  it("reads the value given to the camel spelling", async () => {
    const result = await runCli(["add", "--seedReactVersion", "1.50"]);

    expect(result.exitCode).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toContain("1.50");
  });

  it("answers to -h as well as --help", async () => {
    const result = await runCli(["-h"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("seed-design docs");
  });
});
