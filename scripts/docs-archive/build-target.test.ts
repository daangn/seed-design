import { expect, it } from "bun:test";
import { docsBuildTarget } from "./build-target";

const archive = {
  platform: "react",
  version: "2.0",
  sourceBranch: "react/2.0",
  origin: "",
  probe: { document: "components/button", registryItem: "ui/button" },
};

it("preserves ordinary Pages previews and latest builds", () => {
  expect(docsBuildTarget("feature/docs", [archive])).toEqual({
    "output-dir": "docs/out",
    "archive-version": "",
    prefix: "",
    "preview-path": "",
    "cache-generation": "baseline",
  });
});

it.each([
  ["react/2.0", "2.0"],
  ["react/3.0", "3.0"],
])("selects %s builds from registration without workflow edits", (sourceBranch, version) => {
  expect(docsBuildTarget(sourceBranch, [{ ...archive, sourceBranch, version }])).toEqual({
    "output-dir": "docs/out-archive",
    "archive-version": version,
    prefix: `react/${version}/`,
    "preview-path": `/react/${version}/`,
    "cache-generation": `react-${version}-archive`,
  });
});

it("rejects multiple archives from one branch and unimplemented Lynx builds", () => {
  expect(() => docsBuildTarget("react/2.0", [archive, { ...archive, version: "3.0" }])).toThrow(
    "Multiple",
  );
  expect(() =>
    docsBuildTarget("react/2.0", [{ ...archive, platform: "lynx", version: "1.0" }]),
  ).toThrow("exporter");
});

it("keeps the content build selected while public traffic is pinned for rollback", () => {
  expect(
    docsBuildTarget("react/2.0", [{ ...archive, sourceSha: "b".repeat(40) }])["archive-version"],
  ).toBe("2.0");
});
