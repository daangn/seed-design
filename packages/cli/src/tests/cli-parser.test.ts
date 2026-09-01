import { describe, expect, it } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "../../../..");

/**
 * What the parser answers before any command runs.
 *
 * Every case here reaches an exit code without a network call, so none of them needs a
 * fixture server. The one that matters most is the unknown command: it used to print
 * nothing and exit 0, which reads as success to anything checking the code.
 */
async function runCli(args: string[], cwd = repoRoot) {
  const proc = Bun.spawn({
    cmd: [process.execPath, path.join(repoRoot, "packages/cli/src/index.ts"), ...args],
    cwd,
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
  it("exits 2 with an empty stdout on an unknown command", async () => {
    const result = await runCli(["bogus-command"]);

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
  });

  it("exits 2 with an empty stdout on an unknown option", async () => {
    const result = await runCli(["docs", "list", "--nope"]);

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
  });

  it("rejects a value outside an option's choices", async () => {
    const result = await runCli(["add", "--framework", "svelte"]);

    expect(result.exitCode).toBe(2);
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

    expect(result.exitCode).toBe(2);
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

    expect(result.exitCode).toBe(2);
    expect(`${result.stdout}${result.stderr}`).toContain("1.50");
  });

  it("answers to -h as well as --help", async () => {
    const result = await runCli(["-h"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("seed-design docs");
  });

  it("prints the help outside a Node project", async () => {
    // The version used to be read from the project's package.json before the parser ran, so
    // a directory without one took down `--help` and `docs` alike with an unhandled throw.
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "seed-design-cli-"));
    const result = await runCli(["--help"], cwd);
    await fs.rm(cwd, { recursive: true, force: true });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("seed-design docs");
  });

  it("reports its own version and not the surrounding project's", async () => {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "seed-design-cli-"));
    await fs.writeFile(
      path.join(cwd, "package.json"),
      `${JSON.stringify({ name: "elsewhere", version: "9.9.9" })}\n`,
    );
    const result = await runCli(["-v"], cwd);
    await fs.rm(cwd, { recursive: true, force: true });

    const { version } = await Bun.file(path.join(import.meta.dir, "../../package.json")).json();
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toBe(version);
  });

  it("breaks the help footer's examples onto their own lines", async () => {
    // A single newline inside a `message` template renders as a space, which ran every
    // example of a command together into one line.
    const result = await runCli(["help", "compat"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(
      [
        "예시:",
        "  seed-design compat",
        "  seed-design compat -c action-button",
        "  seed-design compat ui:action-button ui:alert-dialog",
        "  seed-design compat --all",
      ].join("\n"),
    );
  });

  it("no longer takes init's deprecated --default", async () => {
    const [help, run] = await Promise.all([
      runCli(["help", "init"]),
      runCli(["init", "--default"]),
    ]);

    expect(help.stdout).not.toContain("--default");
    expect(run.exitCode).toBe(2);
  });
});
