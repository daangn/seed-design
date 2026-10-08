import { expect, it } from "bun:test";
import { archivePrefix, archiveRoutes, validateArchive } from "./config";

const archive = {
  platform: "react",
  version: "v2",
  origin: "https://react-v2.example.pages.dev",
  sourceSha: "a".repeat(40),
  probe: { document: "components/button", registryItem: "ui/button" },
};

it("keeps all existing routes when adding another version or platform", () => {
  expect(
    archiveRoutes([
      archive,
      { ...archive, version: "v3" },
      { ...archive, platform: "lynx", version: "v1" },
    ]),
  ).toEqual(["seed-design.io/react/v2*", "seed-design.io/react/v3*", "seed-design.io/lynx/v1*"]);
});

it("rejects empty or duplicate registrations", () => {
  expect(() => archiveRoutes([])).toThrow();
  expect(() => archiveRoutes([archive, { ...archive, origin: "https://other.pages.dev" }])).toThrow(
    "Duplicate",
  );
});

it.each([
  "latest",
  "v00",
  "v01",
  "v2.0.1",
  "v2/*",
  "v2/../v3",
  "2",
  "2.0",
  "1.2",
  "v2.0",
  "v2.1",
  "v02",
  "v1.00",
])("rejects malformed channel %s", (version) => {
  expect(() => archivePrefix({ ...archive, version })).toThrow();
});

it("can register retained React minor versions alongside a major channel", () => {
  expect(
    archiveRoutes(["v1.0", "v1.1", "v1.2", "v2"].map((version) => ({ ...archive, version }))),
  ).toEqual([
    "seed-design.io/react/v1.0*",
    "seed-design.io/react/v1.1*",
    "seed-design.io/react/v1.2*",
    "seed-design.io/react/v2*",
  ]);
});

it("registers a Lynx v0 channel next to React archives", () => {
  expect(archiveRoutes([archive, { ...archive, platform: "lynx", version: "v0" }])).toEqual([
    "seed-design.io/react/v2*",
    "seed-design.io/lynx/v0*",
  ]);
});

it("rejects invalid platforms and incomplete or unsafe deployment inputs", () => {
  expect(() => archivePrefix({ ...archive, platform: "react/*" })).toThrow();
  expect(() => validateArchive({ ...archive, origin: "" })).toThrow();
  expect(() => validateArchive({ ...archive, sourceSha: "" })).toThrow();
  expect(() =>
    validateArchive({ ...archive, probe: { ...archive.probe, document: "../../react" } }),
  ).toThrow();
  expect(() => validateArchive(archive)).not.toThrow();
});

it("accepts a source branch so operators do not maintain current SHAs by hand", () => {
  const { sourceSha: _, ...definition } = archive;
  expect(() => validateArchive({ ...definition, sourceBranch: "react/v2" })).not.toThrow();
  for (const sourceBranch of ["../main", "a//b", "main\n", "a.lock", "-main"]) {
    expect(() => validateArchive({ ...definition, sourceBranch })).toThrow();
  }
});
