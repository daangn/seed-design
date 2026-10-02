import { expect, it } from "bun:test";
import { docsBuildTarget } from "./build-target";

it.each([
  "dev",
  "feature/docs",
  "feat/react-v1-2-archive",
])("preserves ordinary Pages build for %s", (branch) => {
  expect(docsBuildTarget(branch)).toEqual({
    "output-dir": "docs/out",
    "archive-version": "",
    prefix: "",
    "preview-path": "",
    "cache-generation": "baseline",
  });
});

it.each([
  "v1.0",
  "v1.1",
  "v1.2",
  "v2",
  "v3",
])("selects %s from the build channel without an origin registry", (version) => {
  expect(docsBuildTarget(`react/${version}`)).toEqual({
    "output-dir": "docs/out-archive",
    "archive-version": version,
    prefix: `react/${version}/`,
    "preview-path": `/react/${version}/`,
    "cache-generation": `react-${version}-archive`,
  });
});

it.each([
  "react/v2.0",
  "react/v01",
  "react/v2/nested",
  "react/v2/../v3",
  "lynx/v1",
])("rejects unsupported archive channel %s", (branch) => {
  expect(() => docsBuildTarget(branch)).toThrow();
});
