export interface Counts {
  total: number;
  nonEmpty: number;
  bytes: number;
}

export interface Measurement extends Counts {
  /** 저장소 루트 기준 테스트 파일 경로 */
  file: string;
  /** describe를 포함한 전체 테스트 이름 */
  test: string;
  /** 그 테스트 안에서 몇 번째 `measureCommits` 호출인지(0부터) */
  index: number;
}

export type Status =
  | "regressed"
  | "improved"
  | "unchanged"
  | "unmeasured-at-base"
  | "unmeasured-at-head";

export interface Row {
  file: string;
  test: string;
  index: number;
  base?: Counts;
  head?: Counts;
  status: Status;
}

const STATUS_ORDER: Status[] = [
  "regressed",
  "unmeasured-at-base",
  "unmeasured-at-head",
  "improved",
  "unchanged",
];

const STATUS_LABEL: Record<Status, string> = {
  regressed: "회귀",
  "unmeasured-at-base": "기준 측정 없음",
  "unmeasured-at-head": "현재 측정 없음",
  improved: "개선",
  unchanged: "변화 없음",
};

const STATUS_MEANING: Record<Status, string> = {
  regressed: "이번 변경에서 늘었다",
  "unmeasured-at-base": "기준 소스에서 재지 못했다(기준에 없는 API이거나 앞 단언이 실패했다)",
  "unmeasured-at-head": "현재 소스에서 재지 못했다(측정 전에 테스트가 실패했다)",
  improved: "이번 변경에서 줄었다",
  unchanged: "기준에도 같은 값이다",
};

const COMPONENT_PATH = /^packages\/lynx-react\/src\/components\/(?!private\/)([^/]+)\//;
const LYNX_SOURCE_PATH = /^packages\/(?:lynx-react-headless|lynx-react\/src)\//;
const SOURCE_FILE = /(?<!\.test)\.[cm]?[jt]sx?$/;

function keyOf({ file, test, index }: { file: string; test: string; index: number }) {
  return `${file}\0${test}\0${index}`;
}

function classify(base: Counts | undefined, head: Counts | undefined): Status {
  if (!head) return "unmeasured-at-head";
  if (!base) return "unmeasured-at-base";
  if (head.total > base.total || head.nonEmpty > base.nonEmpty) return "regressed";
  if (head.total < base.total || head.nonEmpty < base.nonEmpty) return "improved";
  return "unchanged";
}

function countsOf({ total, nonEmpty, bytes }: Counts): Counts {
  return { total, nonEmpty, bytes };
}

export function compareMeasurements(base: Measurement[], head: Measurement[]): Row[] {
  const rows = new Map<string, Row>();
  const rowFor = (measurement: Measurement) => {
    const key = keyOf(measurement);
    const row = rows.get(key) ?? {
      file: measurement.file,
      test: measurement.test,
      index: measurement.index,
      status: "unchanged",
    };
    rows.set(key, row);
    return row;
  };
  for (const measurement of base) rowFor(measurement).base = countsOf(measurement);
  for (const measurement of head) rowFor(measurement).head = countsOf(measurement);
  for (const row of rows.values()) row.status = classify(row.base, row.head);
  return [...rows.values()];
}

export interface ReportInput {
  rows: Row[];
  /** 기준 이후 바뀐 파일(추적되지 않은 파일 포함), 저장소 루트 기준 */
  changedFiles: string[];
  baseLabel: string;
  /** 변화 없는 행도 표에 펼친다 */
  all: boolean;
}

function formatCounts(counts: Counts | undefined) {
  return counts ? `${counts.total}/${counts.nonEmpty} (${counts.bytes}B)` : "-";
}

function escapeCell(text: string) {
  return text.replaceAll("|", "\\|");
}

export function renderReport({ rows, changedFiles, baseLabel, all }: ReportInput): string {
  const touchedComponents = new Set(
    changedFiles.flatMap((file) => COMPONENT_PATH.exec(file)?.[1] ?? []),
  );
  const sharedFiles = changedFiles.filter(
    (file) => LYNX_SOURCE_PATH.test(file) && SOURCE_FILE.test(file) && !COMPONENT_PATH.test(file),
  );
  const componentOf = (row: Row) => COMPONENT_PATH.exec(row.file)?.[1];
  const isTouched = (row: Row) => touchedComponents.has(componentOf(row) ?? "");
  const multiMeasured = new Set(
    rows.filter((row) => row.index > 0).map((row) => row.file + row.test),
  );

  const shown = rows
    .filter((row) => all || row.status !== "unchanged")
    .sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
        Number(isTouched(b)) - Number(isTouched(a)) ||
        a.file.localeCompare(b.file) ||
        a.test.localeCompare(b.test) ||
        a.index - b.index,
    );
  const unchangedCount = rows.filter((row) => row.status === "unchanged").length;

  const lines = [
    "## Lynx commit 수 비교",
    "",
    `기준 ${baseLabel} ↔ 현재 워킹 트리. 값은 total/nonEmpty (bytes)이고, 판정은 total·nonEmpty로만 한다.`,
  ];
  if (touchedComponents.size > 0) {
    lines.push("", `작업 중인 컴포넌트: ${[...touchedComponents].sort().join(", ")}`);
  }
  if (sharedFiles.length > 0) {
    const listed = sharedFiles.slice(0, 5).map((file) => `\`${file}\``);
    const rest = sharedFiles.length > 5 ? ` 외 ${sharedFiles.length - 5}개` : "";
    lines.push(
      "",
      `공유 코드 변경: ${listed.join(", ")}${rest}. 작업 중으로 표시되지 않은 컴포넌트도 이 변경의 영향을 받을 수 있다.`,
    );
  }
  if (shown.length > 0) {
    lines.push(
      "",
      "| 상태 | 컴포넌트 | 테스트 | 기준 → 현재 | 의미 |",
      "| --- | --- | --- | --- | --- |",
    );
    for (const row of shown) {
      const component = componentOf(row) ?? "-";
      const name = multiMeasured.has(row.file + row.test)
        ? `${row.test} #${row.index + 1}`
        : row.test;
      lines.push(
        `| ${STATUS_LABEL[row.status]} | ${isTouched(row) ? `**${component}** (작업 중)` : component} | ${escapeCell(name)} | ${formatCounts(row.base)} → ${formatCounts(row.head)} | ${STATUS_MEANING[row.status]} |`,
      );
    }
  }
  if (!all && unchangedCount > 0) {
    lines.push("", `변화 없음 ${unchangedCount}건: 기준에도 같은 값이다. \`--all\`로 펼친다.`);
  }
  return `${lines.join("\n")}\n`;
}
