import { describe, expect, test } from "bun:test";
import {
  applyInternalDependentReleasePolicy,
  type ChangesetsReleasePlan,
  remapChangesetsVersion,
  rewriteChangelogVersion,
  type VersionPolicyPackage,
} from "./internal-dependent-release-policy";

function pkg(
  path: string,
  name: string,
  version: string,
  dependencies: Record<string, Record<string, string>> = {},
): VersionPolicyPackage {
  return { path, value: { name, version, ...dependencies } };
}

function webPolicyFixture(input: {
  cssOld?: string;
  cssNew?: string;
  reactOld?: string;
  reactUpstream?: string;
  reactDirect?: "minor" | "major" | null;
  stable?: boolean;
}) {
  const cssOld = input.cssOld ?? "2.4.2";
  const cssNew = input.cssNew ?? "2.5.0-beta.0";
  const reactOld = input.reactOld ?? "2.2.2";
  const reactUpstream = input.reactUpstream ?? "3.0.0-beta.0";
  const oldRange = cssOld.includes("-") ? cssOld : "^2.4.0";
  const upstreamRange = input.stable ? cssNew : `^${cssNew}`;
  const direct = input.reactDirect ?? null;
  const changesetReleases: Array<{ name: string; type: "minor" | "major" }> = [
    { name: "@seed-design/css", type: "minor" },
  ];
  if (direct) changesetReleases.push({ name: "@seed-design/react", type: direct });
  const releasePlan: ChangesetsReleasePlan = {
    changesets: [{ id: "css-change", releases: changesetReleases }],
    releases: [
      {
        name: "@seed-design/css",
        type: "minor",
        oldVersion: cssOld,
        newVersion: cssNew,
        changesets: ["css-change"],
      },
      {
        name: "@seed-design/react",
        type: "major",
        oldVersion: reactOld,
        newVersion: reactUpstream,
        changesets: direct ? ["css-change"] : [],
      },
    ],
  };
  return {
    releasePlan,
    config: { fixed: [] as string[][], linked: [] as string[][], changelog: true },
    basePackages: [
      pkg("packages/css/package.json", "@seed-design/css", cssOld),
      pkg("packages/react/package.json", "@seed-design/react", reactOld, {
        peerDependencies: { "@seed-design/css": oldRange },
        devDependencies: { "@seed-design/css": oldRange },
      }),
    ],
    versionedPackages: [
      pkg("packages/css/package.json", "@seed-design/css", cssNew),
      pkg("packages/react/package.json", "@seed-design/react", reactUpstream, {
        peerDependencies: { "@seed-design/css": upstreamRange },
        devDependencies: { "@seed-design/css": input.stable ? cssNew : upstreamRange },
      }),
    ],
    versionedChangelogs: {
      "packages/react/CHANGELOG.md": `# @seed-design/react\n\n## ${reactUpstream}\n\n### Patch Changes\n`,
    },
  };
}

function lynxPolicyFixture(input: {
  cssOld?: string;
  cssNew?: string;
  reactOld?: string;
  reactUpstream?: string;
  reactDirect?: "minor" | "major" | null;
  stable?: boolean;
}) {
  const cssOld = input.cssOld ?? "0.7.0";
  const cssNew = input.cssNew ?? "0.8.0-beta.0";
  const reactOld = input.reactOld ?? "0.3.1";
  const reactUpstream = input.reactUpstream ?? "1.0.0-beta.0";
  const oldRange = cssOld.includes("-") ? cssOld : "0.0.0 || >=0.1.0 <1.0.0";
  const direct = input.reactDirect ?? null;
  const changesetReleases: Array<{ name: string; type: "minor" | "major" }> = [
    { name: "@seed-design/lynx-css", type: "minor" },
  ];
  if (direct) changesetReleases.push({ name: "@seed-design/lynx-react", type: direct });
  const releasePlan: ChangesetsReleasePlan = {
    changesets: [{ id: "lynx-change", releases: changesetReleases }],
    releases: [
      {
        name: "@seed-design/lynx-css",
        type: "minor",
        oldVersion: cssOld,
        newVersion: cssNew,
        changesets: ["lynx-change"],
      },
      {
        name: "@seed-design/lynx-react",
        type: "major",
        oldVersion: reactOld,
        newVersion: reactUpstream,
        changesets: direct ? ["lynx-change"] : [],
      },
    ],
  };
  return {
    releasePlan,
    config: { fixed: [] as string[][], linked: [] as string[][], changelog: true },
    basePackages: [
      pkg("packages/lynx-css/package.json", "@seed-design/lynx-css", cssOld),
      pkg("packages/lynx-react/package.json", "@seed-design/lynx-react", reactOld, {
        peerDependencies: { "@seed-design/lynx-css": oldRange },
        devDependencies: { "@seed-design/lynx-css": cssOld },
      }),
    ],
    versionedPackages: [
      pkg("packages/lynx-css/package.json", "@seed-design/lynx-css", cssNew),
      pkg("packages/lynx-react/package.json", "@seed-design/lynx-react", reactUpstream, {
        peerDependencies: {
          "@seed-design/lynx-css": input.stable ? cssNew : `0.0.0 || >=${cssNew} <1.0.0`,
        },
        devDependencies: { "@seed-design/lynx-css": cssNew },
      }),
    ],
    versionedChangelogs: {
      "packages/lynx-react/CHANGELOG.md": `# @seed-design/lynx-react\n\n## ${reactUpstream}\n\n### Patch Changes\n`,
    },
  };
}

function manifestVersion(
  output: ReturnType<typeof applyInternalDependentReleasePolicy>,
  name: string,
) {
  return output.packages.find((candidate) => candidate.value.name === name)?.value.version;
}

function dependencyRange(
  output: ReturnType<typeof applyInternalDependentReleasePolicy>,
  owner: string,
  field: "peerDependencies" | "devDependencies",
  target: string,
) {
  const value = output.packages.find((candidate) => candidate.value.name === owner)?.value[field];
  return (value as Record<string, string> | undefined)?.[target];
}

describe("internal dependent release policy", () => {
  test("Web auto peer-major는 첫 beta에서 최소 patch와 exact peer/dev로 교정한다", () => {
    const output = applyInternalDependentReleasePolicy(webPolicyFixture({}));
    expect(manifestVersion(output, "@seed-design/react")).toBe("2.2.3-beta.0");
    expect(
      dependencyRange(output, "@seed-design/react", "peerDependencies", "@seed-design/css"),
    ).toBe("2.5.0-beta.0");
    expect(
      dependencyRange(output, "@seed-design/react", "devDependencies", "@seed-design/css"),
    ).toBe("2.5.0-beta.0");
    expect(output.changelogs["packages/react/CHANGELOG.md"]).toContain("## 2.2.3-beta.0");
  });

  test("Web consumer의 explicit minor와 major bump를 보존한다", () => {
    const minor = applyInternalDependentReleasePolicy(webPolicyFixture({ reactDirect: "minor" }));
    expect(manifestVersion(minor, "@seed-design/react")).toBe("2.3.0-beta.0");

    const major = applyInternalDependentReleasePolicy(webPolicyFixture({ reactDirect: "major" }));
    expect(manifestVersion(major, "@seed-design/react")).toBe("3.0.0-beta.0");
  });

  test("다음 beta는 Web consumer의 같은 core에서 counter만 올린다", () => {
    const output = applyInternalDependentReleasePolicy(
      webPolicyFixture({
        cssOld: "2.5.0-beta.0",
        cssNew: "2.5.0-beta.1",
        reactOld: "2.2.3-beta.0",
        reactUpstream: "3.0.0-beta.1",
      }),
    );
    expect(manifestVersion(output, "@seed-design/react")).toBe("2.2.3-beta.1");
  });

  test("Web exit는 같은 core stable과 caret peer/exact dev로 마무리한다", () => {
    const output = applyInternalDependentReleasePolicy(
      webPolicyFixture({
        cssOld: "2.5.0-beta.1",
        cssNew: "2.5.0",
        reactOld: "2.2.3-beta.1",
        reactUpstream: "3.0.0",
        stable: true,
      }),
    );
    expect(manifestVersion(output, "@seed-design/react")).toBe("2.2.3");
    expect(
      dependencyRange(output, "@seed-design/react", "peerDependencies", "@seed-design/css"),
    ).toBe("^2.5.0");
    expect(
      dependencyRange(output, "@seed-design/react", "devDependencies", "@seed-design/css"),
    ).toBe("2.5.0");
  });

  test("Lynx auto peer-major는 0.x minor line으로 교정한다", () => {
    const first = applyInternalDependentReleasePolicy(lynxPolicyFixture({}));
    expect(manifestVersion(first, "@seed-design/lynx-react")).toBe("0.4.0-beta.0");
    expect(
      dependencyRange(
        first,
        "@seed-design/lynx-react",
        "peerDependencies",
        "@seed-design/lynx-css",
      ),
    ).toBe("0.8.0-beta.0");

    const next = applyInternalDependentReleasePolicy(
      lynxPolicyFixture({
        cssOld: "0.8.0-beta.0",
        cssNew: "0.8.0-beta.1",
        reactOld: "0.4.0-beta.0",
        reactUpstream: "1.0.0-beta.1",
      }),
    );
    expect(manifestVersion(next, "@seed-design/lynx-react")).toBe("0.4.0-beta.1");

    const exit = applyInternalDependentReleasePolicy(
      lynxPolicyFixture({
        cssOld: "0.8.0-beta.1",
        cssNew: "0.8.0",
        reactOld: "0.4.0-beta.1",
        reactUpstream: "1.0.0",
        stable: true,
      }),
    );
    expect(manifestVersion(exit, "@seed-design/lynx-react")).toBe("0.4.0");
    expect(
      dependencyRange(exit, "@seed-design/lynx-react", "peerDependencies", "@seed-design/lynx-css"),
    ).toBe("^0.8.0");
  });

  test("Lynx explicit major와 fixed/linked 복합 원인은 fail-closed한다", () => {
    expect(() =>
      applyInternalDependentReleasePolicy(lynxPolicyFixture({ reactDirect: "major" })),
    ).toThrow("explicit major");
    const grouped = webPolicyFixture({});
    grouped.config.fixed = [["@seed-design/react", "@seed-design/stackflow"]];
    expect(() => applyInternalDependentReleasePolicy(grouped)).toThrow("fixed/linked");
  });

  test("version remap과 CHANGELOG heading은 Changesets 형식을 exact하게 요구한다", () => {
    expect(remapChangesetsVersion("2.2.3-beta.0", "3.0.0-beta.1", "patch")).toBe("2.2.3-beta.1");
    expect(remapChangesetsVersion("0.3.1", "1.0.0-beta.0", "minor")).toBe("0.4.0-beta.0");
    expect(rewriteChangelogVersion("# a\n\n## 3.0.0\nbody\n", "3.0.0", "2.3.0")).toBe(
      "# a\n\n## 2.3.0\nbody\n",
    );
    expect(() => rewriteChangelogVersion("# a\n", "3.0.0", "2.3.0")).toThrow("heading");
  });
});
