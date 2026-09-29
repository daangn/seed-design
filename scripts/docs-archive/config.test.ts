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
  "v0",
  "v01",
  "v2.1",
  "v2/*",
  "v2/../v3",
])("rejects non-major version %s", (version) => {
  expect(() => archivePrefix({ ...archive, version })).toThrow();
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
