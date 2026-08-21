import { describe, expect, test } from "bun:test";
import { validateRootageOperationInput } from "./operation-input";

const integrity = `sha512-${"A".repeat(86)}==`;
const sha = "a".repeat(40);
const targetWorkerVersion = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const currentWorkerVersion = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

describe("Rootage production operation input", () => {
  test("backfill 입력을 credential 사용 전에 검증한다", () => {
    expect(
      validateRootageOperationInput({
        operation: "backfill-version",
        version: "2.5.0-next.1",
        npmIntegrity: integrity,
        sourceSha: sha,
      }),
    ).toMatchObject({ operation: "backfill-version", version: "2.5.0-next.1" });
    expect(() =>
      validateRootageOperationInput({
        operation: "backfill-version",
        version: "2.5.0",
        npmIntegrity: "$(danger)",
        sourceSha: sha,
      }),
    ).toThrow("sha512 SRI");
    expect(() =>
      validateRootageOperationInput({
        operation: "backfill-stable",
        version: "2.5.0-next.1",
        npmIntegrity: integrity,
        sourceSha: sha,
      }),
    ).toThrow("정식 SemVer");
  });

  test("stable rollback은 현재 버전과 대상 버전을 모두 요구한다", () => {
    expect(
      validateRootageOperationInput({
        operation: "stable-rollback",
        version: "2.4.0",
        expectedCurrent: "2.5.0",
      }),
    ).toMatchObject({ version: "2.4.0", expectedCurrent: "2.5.0" });
    expect(() =>
      validateRootageOperationInput({ operation: "stable-rollback", version: "2.4.0" }),
    ).toThrow("expected-current");
  });

  test("worker rollback은 서로 다른 strict target/current UUID를 요구한다", () => {
    expect(
      validateRootageOperationInput({
        operation: "worker-rollback",
        workerVersionId: targetWorkerVersion,
        expectedWorkerVersionId: currentWorkerVersion,
      }),
    ).toMatchObject({
      operation: "worker-rollback",
      workerVersionId: targetWorkerVersion,
      expectedWorkerVersionId: currentWorkerVersion,
    });
    expect(() =>
      validateRootageOperationInput({
        operation: "worker-rollback",
        workerVersionId: targetWorkerVersion,
      }),
    ).toThrow("expected-worker-version-id");
    expect(() =>
      validateRootageOperationInput({
        operation: "worker-rollback",
        workerVersionId: "11111111111111111111111111111111",
        expectedWorkerVersionId: currentWorkerVersion,
      }),
    ).toThrow("소문자 UUID");
    expect(() =>
      validateRootageOperationInput({
        operation: "worker-rollback",
        workerVersionId: targetWorkerVersion.toUpperCase(),
        expectedWorkerVersionId: currentWorkerVersion,
      }),
    ).toThrow("소문자 UUID");
    expect(() =>
      validateRootageOperationInput({
        operation: "worker-rollback",
        workerVersionId: currentWorkerVersion,
        expectedWorkerVersionId: currentWorkerVersion,
      }),
    ).toThrow("달라야");
  });

  test("cleanup apply만 정확한 확인 문구를 허용한다", () => {
    expect(
      validateRootageOperationInput({
        operation: "cleanup-apply",
        confirm: "DELETE-INCOMPLETE",
      }).operation,
    ).toBe("cleanup-apply");
    expect(() =>
      validateRootageOperationInput({ operation: "cleanup-apply", confirm: "yes" }),
    ).toThrow("DELETE-INCOMPLETE");
    expect(() =>
      validateRootageOperationInput({ operation: "cleanup-report", confirm: "DELETE-INCOMPLETE" }),
    ).toThrow("confirm");
  });

  test("선택한 작업과 무관한 입력을 거부한다", () => {
    expect(() =>
      validateRootageOperationInput({ operation: "route-cutover", version: "2.4.0" }),
    ).toThrow("version");
    expect(() =>
      validateRootageOperationInput({
        operation: "route-cutover",
        workerVersionId: targetWorkerVersion,
      }),
    ).toThrow("worker-version-id");
    expect(() =>
      validateRootageOperationInput({
        operation: "worker-rollback",
        workerVersionId: targetWorkerVersion,
        expectedWorkerVersionId: currentWorkerVersion,
        expectedCurrent: "2.5.0",
      }),
    ).toThrow("expected-current");
    expect(() => validateRootageOperationInput({ operation: "unknown" })).toThrow("지원하지 않는");
  });
});
