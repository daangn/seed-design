import { afterEach, describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import {
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import {
  assertPublishEnvironment,
  parsePublishArtifactManifest,
  prepareSanitizedChangesetsWorkspace,
  verifyPublishArtifact,
  type PublishArtifactManifest,
} from "./publish-artifact";
import { assertPublishLanePackageContract, resolvePublishDistTag } from "./publish-plan";
import { expectedRootageIntegrity } from "./rootage-input";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

async function command(
  arguments_: string[],
  cwd: string,
  env?: Record<string, string>,
): Promise<{ code: number; stdout: string; stderr: string }> {
  const child = Bun.spawn(arguments_, {
    cwd,
    env: env ? { ...process.env, ...env } : undefined,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [code, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  return { code, stdout, stderr };
}

async function fixture(
  version = "1.0.0-beta.0",
  packageName: "@seed-design/a" | "@seed-design/rootage-artifacts" = "@seed-design/a",
) {
  const repositoryPath = await mkdtemp(join(tmpdir(), "publish-artifact-source-"));
  const artifactPath = await mkdtemp(join(tmpdir(), "publish-artifact-parent-"));
  await rm(artifactPath, { recursive: true, force: true });
  temporaryDirectories.push(repositoryPath, artifactPath);
  const packagePath =
    packageName === "@seed-design/rootage-artifacts" ? "packages/rootage" : "packages/a";
  await mkdir(join(repositoryPath, packagePath), { recursive: true });
  await writeFile(
    join(repositoryPath, "package.json"),
    `${JSON.stringify({ name: "fixture", private: true, workspaces: ["packages/*"] })}\n`,
  );
  await writeFile(
    join(repositoryPath, packagePath, "package.json"),
    `${JSON.stringify({
      name: packageName,
      version,
      files: packageName === "@seed-design/rootage-artifacts" ? ["__generated__"] : ["index.js"],
      publishConfig: { access: "public" },
    })}\n`,
  );
  if (packageName === "@seed-design/rootage-artifacts") {
    const generated = join(repositoryPath, packagePath, "__generated__");
    await mkdir(generated);
    await writeFile(
      join(generated, "index.json"),
      `${JSON.stringify({ name: "Rootage", version, resources: [{ path: "/color.json" }] })}\n`,
    );
    await writeFile(join(generated, "color.json"), '{"orange":"#ff6f0f"}\n');
    await writeFile(
      join(generated, "index.d.ts"),
      `declare const artifact: {\n  "name": "Rootage";\n  "version": ${JSON.stringify(version)};\n};\nexport default artifact;\n`,
    );
  } else {
    await writeFile(join(repositoryPath, packagePath, "index.js"), "export const value = 1;\n");
  }
  for (const arguments_ of [
    ["init", "--initial-branch=dev"],
    ["config", "user.name", "Release Test"],
    ["config", "user.email", "release@example.com"],
    ["config", "commit.gpgsign", "false"],
    ["add", "--all"],
    ["commit", "-m", "fixture"],
  ]) {
    const result = await command(["git", ...arguments_], repositoryPath);
    expect(result.code, result.stderr).toBe(0);
  }
  const mergeSha = (await command(["git", "rev-parse", "HEAD"], repositoryPath)).stdout.trim();
  const packages = [{ name: packageName, version, path: packagePath }];
  const mode = "production" as const;
  const lane = "minor" as const;
  const distTag = version.includes("-") ? "beta" : "latest";
  const build = await command(
    ["bun", join(import.meta.dir, "publish-artifact.ts"), "build"],
    repositoryPath,
    {
      PUBLISH_ARTIFACT_PATH: artifactPath,
      PUBLISH_DIST_TAG: distTag,
      PUBLISH_LANE: lane,
      PUBLISH_MERGE_SHA: mergeSha,
      PUBLISH_MODE: mode,
      PUBLISH_PACKAGES: JSON.stringify(packages),
    },
  );
  expect(build.code, build.stderr).toBe(0);
  const manifest = JSON.parse(
    await readFile(join(artifactPath, "manifest.json"), "utf8"),
  ) as PublishArtifactManifest;
  return { artifactPath, distTag, lane, manifest, mergeSha, mode, packages, repositoryPath };
}

async function repackRootageArtifact(
  item: Awaited<ReturnType<typeof fixture>>,
  mutate: (generatedPath: string) => Promise<void>,
): Promise<void> {
  const archivePath = join(item.artifactPath, item.manifest.packages[0].archive);
  const extracted = await mkdtemp(join(tmpdir(), "rootage-artifact-tamper-"));
  temporaryDirectories.push(extracted);
  const unpack = await command(["tar", "-xzf", archivePath, "-C", extracted], extracted);
  expect(unpack.code, unpack.stderr).toBe(0);
  await mutate(join(extracted, "package", "__generated__"));
  const repack = await command(
    ["tar", "--format", "ustar", "-czf", archivePath, "-C", extracted, "package"],
    extracted,
    { COPYFILE_DISABLE: "1" },
  );
  expect(repack.code, repack.stderr).toBe(0);
  const archive = new Uint8Array(await readFile(archivePath));
  item.manifest.packages[0].size = archive.byteLength;
  item.manifest.packages[0].sha256 = createHash("sha256").update(archive).digest("hex");
  item.manifest.packages[0].integrity = `sha512-${createHash("sha512")
    .update(archive)
    .digest("base64")}`;
  await writeFile(
    join(item.artifactPath, "manifest.json"),
    `${JSON.stringify(item.manifest, null, 2)}\n`,
  );
}

describe("isolated publish artifact", () => {
  test("exact merge/package/tarball identity와 hash를 검증한다", async () => {
    const item = await fixture();
    await expect(
      verifyPublishArtifact({
        artifactPath: item.artifactPath,
        repositoryPath: item.repositoryPath,
        expectedMode: item.mode,
        expectedLane: item.lane,
        expectedMergeSha: item.mergeSha,
        expectedDistTag: item.distTag,
        expectedPackages: item.packages,
      }),
    ).resolves.toEqual(item.manifest);
    expect(item.manifest.packages[0].integrity).toMatch(/^sha512-[A-Za-z0-9+/]{86}==$/);

    const archivePath = join(item.artifactPath, item.manifest.packages[0].archive);
    await chmod(archivePath, 0o755);
    await expect(
      verifyPublishArtifact({
        artifactPath: item.artifactPath,
        repositoryPath: item.repositoryPath,
        expectedMode: item.mode,
        expectedLane: item.lane,
        expectedMergeSha: item.mergeSha,
        expectedDistTag: item.distTag,
        expectedPackages: item.packages,
      }),
    ).rejects.toThrow("filesystem mode");
  });

  test("artifact path/mode/schema spoof를 fail-closed한다", async () => {
    const item = await fixture();
    expect(() =>
      parsePublishArtifactManifest({
        ...item.manifest,
        packages: [{ ...item.manifest.packages[0], archive: "../escape.tgz" }],
      }),
    ).toThrow("archive path");
    expect(() =>
      parsePublishArtifactManifest({ ...item.manifest, mode: "production", extra: true }),
    ).toThrow("strict schema");
    expect(() => parsePublishArtifactManifest({ ...item.manifest, mode: "preview" })).toThrow(
      "mode",
    );

    const manifestPath = join(item.artifactPath, "manifest.json");
    await writeFile(
      manifestPath,
      `${JSON.stringify({
        ...item.manifest,
        packages: [{ ...item.manifest.packages[0], size: item.manifest.packages[0].size + 1 }],
      })}\n`,
    );
    await expect(
      verifyPublishArtifact({
        artifactPath: item.artifactPath,
        repositoryPath: item.repositoryPath,
        expectedMode: item.mode,
        expectedLane: item.lane,
        expectedMergeSha: item.mergeSha,
        expectedDistTag: item.distTag,
        expectedPackages: item.packages,
      }),
    ).rejects.toThrow("size");

    await writeFile(
      manifestPath,
      `${JSON.stringify({
        ...item.manifest,
        packages: [{ ...item.manifest.packages[0], sha256: "0".repeat(64) }],
      })}\n`,
    );
    await expect(
      verifyPublishArtifact({
        artifactPath: item.artifactPath,
        repositoryPath: item.repositoryPath,
        expectedMode: item.mode,
        expectedLane: item.lane,
        expectedMergeSha: item.mergeSha,
        expectedDistTag: item.distTag,
        expectedPackages: item.packages,
      }),
    ).rejects.toThrow("SHA-256");
  });

  test("manifest hash를 다시 계산해도 tarball name/version spoof를 거부한다", async () => {
    const approved = await fixture();
    const spoofed = await fixture("1.0.0-beta.9");
    const approvedArchive = join(approved.artifactPath, approved.manifest.packages[0].archive);
    const spoofedArchive = join(spoofed.artifactPath, spoofed.manifest.packages[0].archive);
    await copyFile(spoofedArchive, approvedArchive);
    const archive = new Uint8Array(await readFile(approvedArchive));
    approved.manifest.packages[0].size = (await stat(approvedArchive)).size;
    approved.manifest.packages[0].sha256 = createHash("sha256").update(archive).digest("hex");
    approved.manifest.packages[0].integrity = `sha512-${createHash("sha512")
      .update(archive)
      .digest("base64")}`;
    await writeFile(
      join(approved.artifactPath, "manifest.json"),
      `${JSON.stringify(approved.manifest)}\n`,
    );

    await expect(
      verifyPublishArtifact({
        artifactPath: approved.artifactPath,
        repositoryPath: approved.repositoryPath,
        expectedMode: approved.mode,
        expectedLane: approved.lane,
        expectedMergeSha: approved.mergeSha,
        expectedDistTag: approved.distTag,
        expectedPackages: approved.packages,
      }),
    ).rejects.toThrow("name/version/private");
  });

  test("Rootage tar의 generated index/version/resources를 npm write 전에 검증한다", async () => {
    const wrongVersion = await fixture("2.5.0", "@seed-design/rootage-artifacts");
    await repackRootageArtifact(wrongVersion, async (generatedPath) => {
      await writeFile(
        join(generatedPath, "index.json"),
        `${JSON.stringify({
          name: "Rootage",
          version: "9.9.9",
          resources: [{ path: "/color.json" }],
        })}\n`,
      );
    });
    await expect(
      verifyPublishArtifact({
        artifactPath: wrongVersion.artifactPath,
        repositoryPath: wrongVersion.repositoryPath,
        expectedMode: wrongVersion.mode,
        expectedLane: wrongVersion.lane,
        expectedMergeSha: wrongVersion.mergeSha,
        expectedDistTag: wrongVersion.distTag,
        expectedPackages: wrongVersion.packages,
      }),
    ).rejects.toThrow("Rootage index.json identity");

    const missingResource = await fixture("2.5.1", "@seed-design/rootage-artifacts");
    await repackRootageArtifact(missingResource, async (generatedPath) => {
      await rm(join(generatedPath, "color.json"));
    });
    await expect(
      verifyPublishArtifact({
        artifactPath: missingResource.artifactPath,
        repositoryPath: missingResource.repositoryPath,
        expectedMode: missingResource.mode,
        expectedLane: missingResource.lane,
        expectedMergeSha: missingResource.mergeSha,
        expectedDistTag: missingResource.distTag,
        expectedPackages: missingResource.packages,
      }),
    ).rejects.toThrow("누락된 JSON");

    const wrongTypesVersion = await fixture("2.5.2", "@seed-design/rootage-artifacts");
    await repackRootageArtifact(wrongTypesVersion, async (generatedPath) => {
      await writeFile(
        join(generatedPath, "index.d.ts"),
        'declare const artifact: {\n  "name": "Rootage";\n  "version": "9.9.9";\n};\n',
      );
    });
    await expect(
      verifyPublishArtifact({
        artifactPath: wrongTypesVersion.artifactPath,
        repositoryPath: wrongTypesVersion.repositoryPath,
        expectedMode: wrongTypesVersion.mode,
        expectedLane: wrongTypesVersion.lane,
        expectedMergeSha: wrongTypesVersion.mergeSha,
        expectedDistTag: wrongTypesVersion.distTag,
        expectedPackages: wrongTypesVersion.packages,
      }),
    ).rejects.toThrow("index.d.ts");
  });

  test("sanitized workspace는 source config 밖의 synthetic exact-merge Git root만 사용한다", async () => {
    const item = await fixture();
    await writeFile(
      join(item.repositoryPath, ".npmrc"),
      "registry=https://registry.attacker.invalid\nproxy=https://proxy.attacker.invalid\n",
    );
    const staged = await prepareSanitizedChangesetsWorkspace({
      artifactPath: item.artifactPath,
      approvedWorktree: item.repositoryPath,
      manifest: item.manifest,
      missingNames: new Set(["@seed-design/a"]),
    });
    temporaryDirectories.push(staged.workspacePath);
    const head = await command(["git", "rev-parse", "HEAD"], staged.workspacePath);
    expect(head.stdout.trim()).toBe(item.mergeSha);
    expect(relative(item.repositoryPath, staged.workspacePath).startsWith("..")).toBe(true);
    expect(await Bun.file(join(staged.workspacePath, "bunfig.toml")).exists()).toBe(false);
    expect(await readFile(join(staged.workspacePath, ".npmrc"), "utf8")).toBe(
      "registry=https://registry.npmjs.org\nignore-scripts=true\nprovenance=true\n",
    );
    expect(staged.arguments).toEqual(["publish", "--no-git-tag", "--tag", "beta"]);
    const synthetic = JSON.parse(
      await readFile(join(staged.workspacePath, "packages/0000/package.json"), "utf8"),
    );
    expect(synthetic).toEqual({
      name: "@seed-design/a",
      version: "1.0.0-beta.0",
      publishConfig: {
        access: "public",
        directory: "../../tarballs/0000.tgz",
        registry: "https://registry.npmjs.org",
      },
    });
    expect(await Bun.file(join(staged.workspacePath, "tarballs/0000.tgz")).exists()).toBe(true);
  });

  test("tarball이 npm gitHead를 미리 주입하면 registry write 전에 거부한다", async () => {
    const item = await fixture();
    const packagePath = join(item.repositoryPath, "packages/a/package.json");
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
    await writeFile(
      packagePath,
      `${JSON.stringify({ ...packageJson, gitHead: "f".repeat(40) })}\n`,
    );
    expect((await command(["git", "add", "--all"], item.repositoryPath)).code).toBe(0);
    expect(
      (await command(["git", "commit", "-m", "preseed gitHead"], item.repositoryPath)).code,
    ).toBe(0);
    const maliciousMergeSha = (
      await command(["git", "rev-parse", "HEAD"], item.repositoryPath)
    ).stdout.trim();
    const maliciousArtifactPath = await mkdtemp(join(tmpdir(), "publish-artifact-parent-"));
    await rm(maliciousArtifactPath, { recursive: true, force: true });
    temporaryDirectories.push(maliciousArtifactPath);

    const build = await command(
      ["bun", join(import.meta.dir, "publish-artifact.ts"), "build"],
      item.repositoryPath,
      {
        PUBLISH_ARTIFACT_PATH: maliciousArtifactPath,
        PUBLISH_DIST_TAG: item.distTag,
        PUBLISH_LANE: item.lane,
        PUBLISH_MERGE_SHA: maliciousMergeSha,
        PUBLISH_MODE: item.mode,
        PUBLISH_PACKAGES: JSON.stringify(item.packages),
      },
    );
    expect(build.code).not.toBe(0);
    expect(build.stderr).toContain("gitHead");
  });

  test("reviewed Changesets는 sanitized tarball을 exact tag로 publish하고 git tag를 만들지 않는다", async () => {
    const item = await fixture();
    const staged = await prepareSanitizedChangesetsWorkspace({
      artifactPath: item.artifactPath,
      approvedWorktree: item.repositoryPath,
      manifest: item.manifest,
      missingNames: new Set(["@seed-design/a"]),
    });
    temporaryDirectories.push(staged.workspacePath);
    const fakeBin = await mkdtemp(join(tmpdir(), "publish-fake-npm-"));
    temporaryDirectories.push(fakeBin);
    const logPath = join(fakeBin, "calls.jsonl");
    const npmPath = join(fakeBin, "npm");
    await writeFile(
      npmPath,
      `#!/usr/bin/env bun
import { appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const args = process.argv.slice(2);
if (args[0] === "info") {
  console.log(JSON.stringify({ name: args[1], versions: [] }));
  process.exit(0);
}
if (args[0] === "publish") {
  const head = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim();
  appendFileSync(process.env.FAKE_NPM_LOG, JSON.stringify({
    args,
    cwd: process.cwd(),
    head,
    ignoreScripts: process.env.NPM_CONFIG_IGNORE_SCRIPTS,
    provenance: process.env.NPM_CONFIG_PROVENANCE,
    registry: process.env.NPM_CONFIG_REGISTRY,
    childRegistry: process.env.npm_config_registry,
  }) + "\\n");
  console.log(JSON.stringify({ id: "published" }));
  process.exit(0);
}
console.error("unexpected npm invocation", args);
process.exit(2);
`,
    );
    await chmod(npmPath, 0o755);
    const result = await command(
      [
        "bun",
        join(import.meta.dir, "../../../../node_modules/@changesets/cli/bin.js"),
        ...staged.arguments,
      ],
      staged.workspacePath,
      {
        CI: "true",
        FAKE_NPM_LOG: logPath,
        NPM_CONFIG_IGNORE_SCRIPTS: "true",
        NPM_CONFIG_PROVENANCE: "true",
        NPM_CONFIG_REGISTRY: "https://registry.npmjs.org",
        PATH: `${fakeBin}:${process.env.PATH ?? ""}`,
      },
    );
    expect(result.code, result.stderr).toBe(0);
    const calls = (await readFile(logPath, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      cwd: await realpath(staged.workspacePath),
      head: item.mergeSha,
      ignoreScripts: "true",
      provenance: "true",
      registry: "https://registry.npmjs.org",
      childRegistry: "https://registry.npmjs.org",
    });
    expect(calls[0].args[0]).toBe("publish");
    expect(calls[0].args[1]).toBe(await realpath(join(staged.workspacePath, "tarballs/0000.tgz")));
    expect(calls[0].args).toContain("beta");
    expect((await command(["git", "tag", "--list"], staged.workspacePath)).stdout.trim()).toBe("");
  });
});

describe("publish runtime policy", () => {
  test("OIDC publish는 reviewed Changesets/npm과 ignore-scripts/provenance를 모두 요구한다", () => {
    const valid = {
      ignoreScripts: "true",
      provenance: "true",
      registry: "https://registry.npmjs.org",
      idTokenUrl: "https://oidc.example",
      idTokenToken: "opaque",
      npmVersion: "11.5.1",
      changesetsVersion: "2.29.7",
    };
    expect(() => assertPublishEnvironment(valid)).not.toThrow();
    expect(() => assertPublishEnvironment({ ...valid, ignoreScripts: "false" })).toThrow(
      "ignore-scripts",
    );
    expect(() => assertPublishEnvironment({ ...valid, provenance: undefined })).toThrow(
      "provenance",
    );
    expect(() =>
      assertPublishEnvironment({ ...valid, registry: "https://registry.attacker.invalid" }),
    ).toThrow("registry");
    expect(() => assertPublishEnvironment({ ...valid, npmVersion: "11.5.0" })).toThrow("11.5.1");
    expect(() => assertPublishEnvironment({ ...valid, changesetsVersion: "2.30.0" })).toThrow(
      "2.29.7",
    );
  });

  test("stable은 latest, prerelease는 exact pre tag만 허용한다", () => {
    expect(resolvePublishDistTag([{ name: "a", version: "1.0.0" }], null, ["latest"])).toBe(
      "latest",
    );
    expect(
      resolvePublishDistTag(
        [{ name: "a", version: "1.0.0-beta.1" }],
        { mode: "pre", tag: "beta" },
        ["latest", "stable"],
      ),
    ).toBe("beta");
    expect(() =>
      resolvePublishDistTag([{ name: "a", version: "1.0.0-rc.1" }], { mode: "pre", tag: "beta" }, [
        "latest",
        "stable",
      ]),
    ).toThrow("dist-tag");
    expect(() =>
      resolvePublishDistTag(
        [{ name: "a", version: "1.0.0-beta.1" }],
        { mode: "pre", tag: "latest" },
        ["latest", "stable"],
      ),
    ).toThrow("보호");
  });

  test("dev stable과 non-dev prerelease만 허용한다", () => {
    expect(() =>
      assertPublishLanePackageContract("dev", [{ name: "a", version: "1.0.0" }]),
    ).not.toThrow();
    expect(() =>
      assertPublishLanePackageContract("minor", [{ name: "a", version: "1.0.0-beta.1" }]),
    ).not.toThrow();
    expect(() =>
      assertPublishLanePackageContract("minor", [{ name: "a", version: "1.0.0" }]),
    ).toThrow("stable package");
    expect(() =>
      assertPublishLanePackageContract("major", [{ name: "a", version: "2.0.0" }]),
    ).toThrow("stable package");
    expect(() =>
      assertPublishLanePackageContract("dev", [{ name: "a", version: "1.0.0-beta.1" }]),
    ).toThrow("pre-release package");
  });

  test("Rootage 입력은 artifact에서 계산한 exact integrity에 결속된다", async () => {
    const item = await fixture();
    const integrity = item.manifest.packages[0].integrity;
    expect(
      expectedRootageIntegrity("1.0.0-beta.0", [
        { name: "@seed-design/rootage-artifacts", version: "1.0.0-beta.0", integrity },
      ]),
    ).toBe(integrity);
    expect(() => expectedRootageIntegrity("1.0.0-beta.0", [])).toThrow("integrity 계약");
    expect(expectedRootageIntegrity("", [])).toBeNull();
  });
});
