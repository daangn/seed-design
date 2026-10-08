import { expect, it } from "bun:test";
import { archivePrefix, validateArchive } from "./config";

const archive = {
  platform: "react",
  version: "v2",
  origin: "https://react-v2.example.pages.dev",
  sourceSha: "a".repeat(40),
  probe: { document: "components/button", registryItem: "ui/button" },
};

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

it("supports retained React minor versions and the Lynx v0 channel", () => {
  expect(
    ["v1.0", "v1.1", "v1.2", "v2"].map((version) => archivePrefix({ ...archive, version })),
  ).toEqual(["/react/v1.0", "/react/v1.1", "/react/v1.2", "/react/v2"]);
  expect(archivePrefix({ ...archive, platform: "lynx", version: "v0" })).toBe("/lynx/v0");
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
