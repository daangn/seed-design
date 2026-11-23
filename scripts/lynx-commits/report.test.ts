import { describe, expect, it } from "bun:test";

import { compareMeasurements, type Measurement, renderReport } from "./report";

const FILE = "packages/lynx-react/src/components/Switch/Switch.commits.test.tsx";

function measurement(test: string, total: number, nonEmpty: number, bytes = 100): Measurement {
  return { file: FILE, test, index: 0, total, nonEmpty, bytes };
}

describe("compareMeasurements", () => {
  it("classifies each key by total and nonEmpty", () => {
    const rows = compareMeasurements(
      [
        measurement("more total", 2, 1),
        measurement("more nonEmpty", 2, 1),
        measurement("mixed", 3, 1),
        measurement("fewer", 3, 2),
        measurement("bytes only", 2, 1, 100),
        measurement("removed", 1, 1),
      ],
      [
        measurement("more total", 3, 1),
        measurement("more nonEmpty", 2, 2),
        measurement("mixed", 2, 2),
        measurement("fewer", 3, 1),
        measurement("bytes only", 2, 1, 900),
        measurement("added", 1, 1),
      ],
    );
    expect(Object.fromEntries(rows.map((row) => [row.test, row.status]))).toEqual({
      "more total": "regressed",
      "more nonEmpty": "regressed",
      mixed: "regressed",
      fewer: "improved",
      "bytes only": "unchanged",
      removed: "unmeasured-at-head",
      added: "unmeasured-at-base",
    });
  });

  it("keeps the n-th measurement of a test as its own key", () => {
    const rows = compareMeasurements(
      [measurement("t", 1, 1), { ...measurement("t", 1, 1), index: 1 }],
      [measurement("t", 1, 1), { ...measurement("t", 2, 1), index: 1 }],
    );
    expect(rows.map((row) => [row.index, row.status])).toEqual([
      [0, "unchanged"],
      [1, "regressed"],
    ]);
  });
});

describe("renderReport", () => {
  const other = "packages/lynx-react/src/components/Avatar/Avatar.commits.test.tsx";
  const rows = compareMeasurements(
    [
      measurement("same", 1, 1),
      measurement("fewer", 2, 1),
      { ...measurement("grew", 1, 1), file: other },
      measurement("grew", 1, 1),
    ],
    [
      measurement("same", 1, 1),
      measurement("fewer", 1, 1),
      { ...measurement("grew", 2, 1), file: other },
      measurement("grew", 2, 1),
      measurement("new", 1, 0),
    ],
  );
  const changedFiles = [
    "packages/lynx-react/src/components/Switch/Switch.tsx",
    "packages/lynx-react-headless/switch/src/useSwitch.ts",
    "packages/lynx-react-headless/switch/src/useSwitch.test.ts",
    "packages/lynx-react-headless/AGENTS.md",
  ];

  it("sorts by status with touched components first and collapses unchanged rows", () => {
    expect(renderReport({ rows, changedFiles, baseLabel: "`dev`", all: false })).toBe(
      `## Lynx commit 수 비교

기준 \`dev\` ↔ 현재 워킹 트리. 값은 total/nonEmpty (bytes)이고, 판정은 total·nonEmpty로만 한다.

작업 중인 컴포넌트: Switch

공유 코드 변경: \`packages/lynx-react-headless/switch/src/useSwitch.ts\`. 작업 중으로 표시되지 않은 컴포넌트도 이 변경의 영향을 받을 수 있다.

| 상태 | 컴포넌트 | 테스트 | 기준 → 현재 | 의미 |
| --- | --- | --- | --- | --- |
| 회귀 | **Switch** (작업 중) | grew | 1/1 (100B) → 2/1 (100B) | 이번 변경에서 늘었다 |
| 회귀 | Avatar | grew | 1/1 (100B) → 2/1 (100B) | 이번 변경에서 늘었다 |
| 기준 측정 없음 | **Switch** (작업 중) | new | - → 1/0 (100B) | 기준 소스에서 재지 못했다(기준에 없는 API이거나 앞 단언이 실패했다) |
| 개선 | **Switch** (작업 중) | fewer | 2/1 (100B) → 1/1 (100B) | 이번 변경에서 줄었다 |

변화 없음 1건: 기준에도 같은 값이다. \`--all\`로 펼친다.
`,
    );
  });

  it("lists unchanged rows with --all", () => {
    const report = renderReport({ rows, changedFiles: [], baseLabel: "`dev`", all: true });
    expect(
      report
        .split("\n")
        .filter((line) => line.startsWith("| "))
        .slice(2),
    ).toEqual([
      "| 회귀 | Avatar | grew | 1/1 (100B) → 2/1 (100B) | 이번 변경에서 늘었다 |",
      "| 회귀 | Switch | grew | 1/1 (100B) → 2/1 (100B) | 이번 변경에서 늘었다 |",
      "| 기준 측정 없음 | Switch | new | - → 1/0 (100B) | 기준 소스에서 재지 못했다(기준에 없는 API이거나 앞 단언이 실패했다) |",
      "| 개선 | Switch | fewer | 2/1 (100B) → 1/1 (100B) | 이번 변경에서 줄었다 |",
      "| 변화 없음 | Switch | same | 1/1 (100B) → 1/1 (100B) | 기준에도 같은 값이다 |",
    ]);
  });
});
