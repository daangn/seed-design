import { appendFile } from "node:fs/promises";
import { prepareCodePromotions } from "../promotion/create-code-promotion";
import { advanceStablePromotion } from "../promotion/advance-code-promotion";

const gitShaPattern = /^[0-9a-f]{40}$/;

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

async function gitHead(): Promise<string> {
  const child = Bun.spawn(["git", "rev-parse", "HEAD"], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`trusted control SHA 조회 실패:\n${stderr}`);
  return stdout.trim();
}

async function main(): Promise<void> {
  const token = required("GH_TOKEN");
  const repository = required("GITHUB_REPOSITORY");
  const lane = required("RELEASE_PLAN_LANE");
  const operationId = required("RELEASE_PROMOTION_OPERATION_ID");
  const expectedBaseSha = required("RELEASE_PLAN_BASE_SHA");
  const expectedHeadSha = required("RELEASE_VERSION_HEAD_SHA");
  const controlSha = required("RELEASE_PLAN_CONTROL_SHA");
  const exitMergeSha = required("RELEASE_PROMOTION_EXIT_MERGE_SHA");
  const exitPr = Number(required("RELEASE_PROMOTION_EXIT_PR"));
  const versionPr = Number(required("RELEASE_VERSION_PR"));
  if (
    (lane !== "minor" && lane !== "major") ||
    !/^[1-9][0-9]*$/.test(operationId) ||
    !gitShaPattern.test(expectedBaseSha) ||
    !gitShaPattern.test(expectedHeadSha) ||
    !gitShaPattern.test(controlSha) ||
    !gitShaPattern.test(exitMergeSha) ||
    expectedBaseSha !== exitMergeSha ||
    !Number.isSafeInteger(exitPr) ||
    exitPr <= 0 ||
    !Number.isSafeInteger(versionPr) ||
    versionPr <= 0
  ) {
    throw new Error("stable promotion workflow identity가 올바르지 않습니다.");
  }
  if ((await gitHead()) !== controlSha) {
    throw new Error("binder checkout이 exact control SHA가 아닙니다.");
  }
  const prepared = await prepareCodePromotions({
    repositoryPath: process.cwd(),
    repository,
    token,
    sourceLane: lane,
    operationId,
    exitPr,
    exitMergeSha,
    stablePr: versionPr,
    stableVersionHeadSha: expectedHeadSha,
    controlSha,
  });
  if (prepared.preflightReady) {
    await advanceStablePromotion({
      repositoryPath: process.cwd(),
      repository,
      token,
      stablePr: versionPr,
    });
  }
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      [
        "stablePromotion=true",
        `operationId=${operationId}`,
        `exitPr=${exitPr}`,
        `exitMergeSha=${exitMergeSha}`,
        `promotionManifestSha256=${prepared.marker.promotionManifestSha256}`,
        `promotionPulls=${JSON.stringify(prepared.promotionPulls)}`,
        "",
      ].join("\n"),
    );
  }
}

if (import.meta.main) await main();
