import { afterEach, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const cli = process.env.CHANGESETS_TEST_CLI ?? require.resolve("@changesets/cli/bin.js");
const directories: string[] = [];

afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

function versionFixture(peerRange: string, explicitMajor = false) {
  const cwd = mkdtempSync(join(tmpdir(), "seed-peer-bump-"));
  directories.push(cwd);
  const write = (path: string, value: unknown) =>
    writeFileSync(join(cwd, path), `${JSON.stringify(value, null, 2)}\n`);
  mkdirSync(join(cwd, ".changeset"));
  write("package.json", { name: "peer-bump-fixture", private: true, workspaces: ["packages/*"] });
  write("bun.lock", { lockfileVersion: 1, workspaces: {} });
  const config = JSON.parse(
    readFileSync(resolve(import.meta.dir, "../.changeset/config.json"), "utf8"),
  );
  write(".changeset/config.json", { ...config, linked: [], changelog: false, commit: false });
  for (const [name, version] of [
    ["lynx-css", "0.11.0"],
    ["tailwind3-plugin", "2.4.1"],
    ["tailwind4-theme", "2.4.1"],
  ]) {
    mkdirSync(join(cwd, "packages", name), { recursive: true });
    write(`packages/${name}/package.json`, {
      name: `@seed-design/${name}`,
      version,
      ...(name === "lynx-css"
        ? {}
        : {
            peerDependencies: { "@seed-design/lynx-css": peerRange },
            peerDependenciesMeta: { "@seed-design/lynx-css": { optional: true } },
          }),
    });
  }
  writeFileSync(
    join(cwd, ".changeset/peer-update.md"),
    `---\n"@seed-design/lynx-css": minor\n${explicitMajor ? '"@seed-design/tailwind3-plugin": major\n' : ""}---\n\nLynx CSS update.\n`,
  );
  const result = Bun.spawnSync(["node", cli, "version"], {
    cwd,
    env: { ...process.env, CI: "true" },
  });
  expect(result.exitCode, result.stdout.toString() + result.stderr.toString()).toBe(0);
  return (name: string) =>
    JSON.parse(readFileSync(join(cwd, `packages/${name}/package.json`), "utf8"));
}

test("out-of-range optional peers receive a patch, not an implicit major", () => {
  const get = versionFixture("^0.11.0");
  expect(get("lynx-css").version).toBe("0.12.0");
  for (const name of ["tailwind3-plugin", "tailwind4-theme"]) {
    expect(get(name).version).toBe("2.4.2");
    expect(get(name).peerDependenciesMeta["@seed-design/lynx-css"].optional).toBe(true);
  }
});

test("in-range optional peers do not trigger a release", () => {
  const get = versionFixture("^0.11.0 || ^0.12.0");
  expect(get("tailwind3-plugin").version).toBe("2.4.1");
  expect(get("tailwind4-theme").version).toBe("2.4.1");
});

test("explicit major changesets still produce a major release", () => {
  const get = versionFixture("^0.11.0", true);
  expect(get("tailwind3-plugin").version).toBe("3.0.0");
  expect(get("tailwind4-theme").version).toBe("2.4.2");
});
