import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import Ajv from "../../packages/react/node_modules/ajv/dist/ajv.js";

const schemaPath = path.join(
  import.meta.dir,
  "../../skills/seed-design/assets/doctor-report.schema.json",
);
const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);

function report() {
  return {
    schemaVersion: 2,
    meta: {
      target: "/tmp/example",
      framework: "react",
      projectKinds: ["app"],
      date: "2026-08-16",
    },
    summary: { error: 0, warn: 0, info: 0 },
    checks: [
      {
        rule: "seed/project-config",
        category: "config",
        status: "pass",
        evidence: "seed-design.json의 framework와 직접 의존성이 일치함",
        references: ["https://seed-design.io/react/llms.txt"],
      },
      {
        rule: "seed/library-authors",
        category: "library",
        status: "not-applicable",
        reason: "공개 진입점이나 라이브러리 빌드 증거가 없음",
        references: ["https://seed-design.io/react/llms.txt"],
      },
    ],
    findings: [],
    verdicts: [],
    rejected: [],
  };
}

describe("SEED Doctor report schema v2", () => {
  it("accepts a report with non-exclusive project kinds and explicit check coverage", () => {
    const value = report();
    value.meta.projectKinds = ["app", "library"];

    expect(validate(value)).toBe(true);
  });

  it("does not invent a project kind when app or library evidence is absent", () => {
    const value = report();
    value.meta.projectKinds = [];

    expect(validate(value)).toBe(true);
  });

  it("rejects a v1 report without checks", () => {
    const value = report();
    value.schemaVersion = 1;
    delete (value as Partial<typeof value>).checks;

    expect(validate(value)).toBe(false);
  });

  it("rejects unsupported check categories and statuses", () => {
    const value = report();
    value.checks[0] = {
      ...value.checks[0],
      category: "versions",
      status: "unknown",
    };

    expect(validate(value)).toBe(false);
  });

  it("rejects a report that records no check coverage", () => {
    const value = report();
    value.checks = [];

    expect(validate(value)).toBe(false);
  });

  it("requires evidence for pass and fail checks", () => {
    const value = report();
    delete (value.checks[0] as Partial<(typeof value.checks)[number]>).evidence;

    expect(validate(value)).toBe(false);
  });

  it("requires a reason for not-applicable and not-verified checks", () => {
    const value = report();
    delete (value.checks[1] as Partial<(typeof value.checks)[number]>).reason;

    expect(validate(value)).toBe(false);
  });
});
