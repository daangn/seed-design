import { describe, expect, test } from "bun:test";
import { diffLines, unifiedDiff } from "./unified-diff";

const lines = (count: number, prefix = "  line") =>
  Array.from({ length: count }, (_, index) => `${prefix} ${index + 1}`);

describe("unified diff", () => {
  test("같은 입력이면 빈 문자열을 돌려준다", () => {
    expect(unifiedDiff(["a", "b"], ["a", "b"])).toBe("");
  });

  test("hunk 머리말에 변경 위쪽의 가장 가까운 export 줄을 붙인다", () => {
    const base = ["# pkg", "component Button", ...lines(10)];
    const head = base.map((line) => (line === "  line 6" ? "  line six" : line));

    expect(unifiedDiff(base, head)).toBe(`@@ -5,7 +5,7 @@ component Button
   line 3
   line 4
   line 5
-  line 6
+  line six
   line 7
   line 8
   line 9`);
  });

  test("문맥이 겹치는 변경은 한 hunk로 묶고 먼 변경은 나눈다", () => {
    const base = lines(30, "item");
    const head = base
      .map((line) => (line === "item 2" || line === "item 8" ? `${line}!` : line))
      .filter((line) => line !== "item 25");

    expect(unifiedDiff(base, head)).toBe(`@@ -1,11 +1,11 @@
 item 1
-item 2
+item 2!
 item 3
 item 4
 item 5
 item 6
 item 7
-item 8
+item 8!
 item 9
 item 10
 item 11
@@ -22,7 +22,6 @@ item 21
 item 22
 item 23
 item 24
-item 25
 item 26
 item 27
 item 28`);
  });

  test("edit에서 두 입력을 그대로 복원할 수 있다", () => {
    let seed = 7;
    const random = () => {
      seed = (seed * 48271) % 2147483647;
      return seed % 5;
    };

    for (let round = 0; round < 200; round++) {
      const a = Array.from({ length: random() * 4 }, () => `${random()}`);
      const b = Array.from({ length: random() * 4 }, () => `${random()}`);
      const edits = diffLines(a, b);

      expect(edits.filter((edit) => edit.type !== "+").map((edit) => edit.line)).toEqual(a);
      expect(edits.filter((edit) => edit.type !== "-").map((edit) => edit.line)).toEqual(b);
    }
  });

  test("한쪽이 비어 있으면 전체를 추가하거나 삭제한다", () => {
    expect(unifiedDiff([], ["a", "b"])).toBe("@@ -0,0 +1,2 @@\n+a\n+b");
    expect(unifiedDiff(["a"], [])).toBe("@@ -1 +0,0 @@\n-a");
  });
});
