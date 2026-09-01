import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { createScaffoldPlan } from "./scaffold-plan";

describe("seed-create-component scaffold plan", () => {
  it("원천, 생성물과 기존 대상 충돌을 구분하고 파일을 수정하지 않는다", async () => {
    const path = "packages/react/src/components/ProgressCircle/ProgressCircle.tsx";
    const before = await readFile(path, "utf8");
    const result = await createScaffoldPlan({
      component: "ProgressCircle",
      platform: "cross-platform",
      deliverySurface: "package+snippet",
    });

    expect(result.component.state).toBe("matched");
    expect(result.items.find((target) => target.path === path)).toMatchObject({
      action: "existing",
      boundary: "source",
      editable: true,
    });
    expect(result.conflicts.map((conflict) => conflict.path)).toContain(path);
    expect(result.items.map((target) => target.path)).toEqual(
      expect.arrayContaining([
        "docs/content/react/components/progress-circle.mdx",
        "docs/content/lynx/components/progress-circle.mdx",
      ]),
    );
    expect(result.items.some((target) => target.boundary === "reference")).toBe(true);
    expect(result.items.some((target) => target.boundary === "generated")).toBe(true);
    expect(result.items.filter((target) => target.boundary === "generated")).toSatisfy((targets) =>
      targets.every((target) => !target.editable),
    );
    expect(await readFile(path, "utf8")).toBe(before);
    expect(result.readOnly).toBe(true);
  });

  it("비표준 기존 구현은 기본 package 경로로 복제하지 않는다", async () => {
    const result = await createScaffoldPlan({
      component: "AppBar",
      platform: "cross-platform",
      deliverySurface: "package-only",
    });

    expect(result.items).toContainEqual(
      expect.objectContaining({
        path: "packages/stackflow/src/components/AppBar/AppBar.tsx",
        action: "existing",
      }),
    );
    expect(
      result.items.some((target) =>
        target.path.startsWith("packages/react/src/components/AppBar/"),
      ),
    ).toBe(false);
  });

  it("모호한 컴포넌트 이름으로 scaffold 경로를 만들지 않는다", async () => {
    await expect(
      createScaffoldPlan({
        component: "button",
        platform: "react",
        deliverySurface: "package-only",
      }),
    ).rejects.toThrow("컴포넌트 이름이 모호합니다");
  });
});
