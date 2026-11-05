import { expect, it } from "bun:test";
import { docsBuildTarget } from "./build-target";

it.each([
  "dev",
  "feature/docs",
  "feat/react-v1-2-archive",
])("preserves ordinary Pages build for %s", (branch) => {
  expect(docsBuildTarget(branch)).toEqual({
    "output-dir": "docs/out",
    "archive-platform": "",
    "archive-version": "",
    prefix: "",
    "preview-path": "",
    "cache-generation": "baseline",
  });
});

it.each([
  ["react", "v1.0"],
  ["react", "v1.1"],
  ["react", "v1.2"],
  ["react", "v2"],
  ["react", "v3"],
  ["lynx", "v0"],
])("selects %s/%s from the build channel without an origin registry", (platform, version) => {
  expect(docsBuildTarget(`${platform}/${version}`)).toEqual({
    "output-dir": "docs/out-archive",
    "archive-platform": platform,
    "archive-version": version,
    prefix: `${platform}/${version}/`,
    "preview-path": `/${platform}/${version}/`,
    "cache-generation": `${platform}-${version}-archive`,
  });
});

it.each([
  "react/v2.0",
  "react/v01",
  "react/v2/nested",
  "react/v2/../v3",
  "lynx/v00",
])("rejects unsupported archive channel %s", (branch) => {
  expect(() => docsBuildTarget(branch)).toThrow();
});
