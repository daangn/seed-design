import { describe, expect, test } from "bun:test";
import {
  assertPrereleaseTransition,
  classifyPrereleaseState,
  isWorkspaceDirectory,
  parsePrereleaseState,
} from "./prerelease-state";

const versions = { "@seed-design/a": "1.2.3", "@seed-design/b": "2.0.0" };
const active = {
  mode: "pre" as const,
  tag: "beta",
  initialVersions: versions,
  changesets: ["bright-dogs-run"],
};

describe("prerelease state contract", () => {
  test("dev/dormant/active/exiting 상태를 exact pre state에서 분류한다", () => {
    expect(classifyPrereleaseState("dev", null)).toBe("stable");
    expect(classifyPrereleaseState("minor", null)).toBe("dormant");
    expect(classifyPrereleaseState("minor", active)).toBe("active");
    expect(classifyPrereleaseState("major", { ...active, mode: "exit" })).toBe("exiting");
    expect(() => classifyPrereleaseState("dev", active)).toThrow("dev");
  });

  test("enter는 absent에서 exact beta baseline만 허용한다", () => {
    const proposed = { ...active, changesets: [] };
    expect(() =>
      assertPrereleaseTransition({
        lane: "minor",
        operation: "enter",
        base: null,
        proposed,
        workspaceVersions: versions,
      }),
    ).not.toThrow();
    expect(() =>
      assertPrereleaseTransition({
        lane: "minor",
        operation: "enter",
        base: null,
        proposed: { ...proposed, initialVersions: { "@seed-design/a": "9.9.9" } },
        workspaceVersions: versions,
      }),
    ).toThrow("workspace baseline");
  });

  test("exit intent는 mode 외 값을 바꾸거나 pre.json을 삭제할 수 없다", () => {
    expect(() =>
      assertPrereleaseTransition({
        lane: "major",
        operation: "exit",
        base: active,
        proposed: { ...active, mode: "exit" },
      }),
    ).not.toThrow();
    expect(() =>
      assertPrereleaseTransition({
        lane: "major",
        operation: "exit",
        base: active,
        proposed: { ...active, mode: "exit", changesets: [] },
      }),
    ).toThrow("exact");
    expect(() =>
      assertPrereleaseTransition({
        lane: "major",
        operation: "exit",
        base: active,
        proposed: null,
      }),
    ).toThrow("삭제");
  });

  test("malformed/extra-key state와 workspace 밖 package를 거부한다", () => {
    expect(() => parsePrereleaseState({ ...active, extra: true }, "state")).toThrow("key");
    expect(() => parsePrereleaseState({ ...active, tag: "latest" }, "state")).toThrow("beta");
    expect(isWorkspaceDirectory("packages/a", ["packages/*", "docs"])).toBe(true);
    expect(isWorkspaceDirectory("packages/a/nested", ["packages/*", "docs"])).toBe(false);
    expect(isWorkspaceDirectory("docs", ["packages/*", "docs"])).toBe(true);
  });
});
