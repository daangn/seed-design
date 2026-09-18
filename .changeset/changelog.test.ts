import { describe, expect, test } from "bun:test";
import changelog from "./changelog.cjs";

const dependency = { name: "@seed-design/lynx-css", newVersion: "0.12.0" };
const changeset = (id: string, commit?: string) => ({
  id,
  commit,
  summary: `Change ${id}`,
  releases: [],
});

describe("dependency changelog", () => {
  test("squash merge의 changeset 13개를 커밋 한 줄로 표시한다", async () => {
    const entries = Array.from({ length: 13 }, (_, index) => changeset(String(index), "fa699aa11"));
    expect(await changelog.getDependencyReleaseLine(entries, [dependency])).toBe(
      "- Updated dependencies [fa699aa]\n  - @seed-design/lynx-css@0.12.0",
    );
  });

  test("서로 다른 커밋과 모든 의존성은 유지한다", async () => {
    expect(
      await changelog.getDependencyReleaseLine(
        [changeset("a", "abcdef123"), changeset("b", "123456789"), changeset("c", "abcdef123")],
        [dependency, { name: "another-package", newVersion: "1.0.1" }],
      ),
    ).toBe(
      "- Updated dependencies [abcdef1]\n- Updated dependencies [1234567]\n  - @seed-design/lynx-css@0.12.0\n  - another-package@1.0.1",
    );
  });

  test("커밋이 없는 경우에도 같은 문구를 반복하지 않는다", async () => {
    expect(
      await changelog.getDependencyReleaseLine([changeset("a"), changeset("b")], [dependency]),
    ).toBe("- Updated dependencies\n  - @seed-design/lynx-css@0.12.0");
  });

  test("갱신된 의존성이 없으면 빈 문자열을 반환한다", async () => {
    expect(await changelog.getDependencyReleaseLine([changeset("a")], [])).toBe("");
  });

  test("같은 커밋의 개별 변경 설명은 각각 유지한다", async () => {
    const entries = [changeset("a", "fa699aa11"), changeset("b", "fa699aa11")];
    expect(
      await Promise.all(entries.map((entry) => changelog.getReleaseLine(entry, "patch"))),
    ).toEqual(["- fa699aa: Change a", "- fa699aa: Change b"]);
  });
});
