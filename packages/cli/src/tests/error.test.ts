import { describe, expect, it } from "bun:test";
import { CliError, formatCliError } from "@/src/utils/error";

/**
 * What the user is told when a command we spawned is the thing that failed.
 *
 * The rejection `execa` throws is the only account of why, so a `CliError` wrapping one has to
 * pass it through. Dropping it left "네트워크 상태를 확인하고" standing in front of a peer
 * dependency conflict.
 */
describe("formatCliError", () => {
  it("reports what the wrapped process said", () => {
    const cause = Object.assign(new Error("Command failed with exit code 1"), {
      escapedCommand: "npm i @seed-design/react",
      exitCode: 1,
      stderr: "npm error code ERESOLVE\nnpm error ERESOLVE could not resolve",
    });

    const lines = formatCliError(new CliError({ message: "의존성 설치에 실패했어요.", cause }), {
      defaultMessage: "추가에 실패했어요.",
    });

    expect(lines).toEqual([
      "추가에 실패했어요.",
      "원인: 의존성 설치에 실패했어요.",
      "실행 명령어: npm i @seed-design/react",
      "종료 코드: 1",
      "stderr: npm error code ERESOLVE\nnpm error ERESOLVE could not resolve",
    ]);
  });

  it("keeps the details the error declared for itself", () => {
    const lines = formatCliError(
      new CliError({
        message: "항목을 찾을 수 없어요.",
        details: ["ui:does-not-exist"],
        hint: "이름을 확인해주세요.",
      }),
      { defaultMessage: "추가에 실패했어요." },
    );

    expect(lines).toEqual([
      "추가에 실패했어요.",
      "원인: 항목을 찾을 수 없어요.",
      "ui:does-not-exist",
      "해결 힌트: 이름을 확인해주세요.",
    ]);
  });
});
