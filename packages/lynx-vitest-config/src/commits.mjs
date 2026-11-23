import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";

import { expect } from "vitest";

const MAX_SETTLE_ROUNDS = 20;

// testing-library의 waitSchedule과 같은 대기. @lynx-js/react를 import하면 테스트 패키지와 다른 인스턴스가 될 수 있다.
function waitSchedule() {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)));
}

// 런타임이 `flushOptions.emptyPatch`를 붙이는 조건과 같다. 0.123 미만에는 플래그가 없어 직접 판정한다.
function isNonEmpty(payload) {
  const { patchList, delayedRunOnMainThreadData } = JSON.parse(payload.data);
  return (
    patchList.some((patch) => patch.snapshotPatch?.length > 0) ||
    delayedRunOnMainThreadData?.length > 0
  );
}

const reportDir = process.env.SEED_LYNX_COMMITS_REPORT_DIR;
const callsByTest = new Map();

// `bun lynx:commits`가 기준·현재 소스의 측정값을 비교할 때 읽는다. 뒤의 단언이 실패해도 남도록 반환 전에 동기로 쓴다.
function record(counts) {
  const { testPath, currentTestName } = expect.getState();
  const file = path.relative(process.cwd(), testPath);
  const index = callsByTest.get(`${file}\0${currentTestName}`) ?? 0;
  callsByTest.set(`${file}\0${currentTestName}`, index + 1);
  mkdirSync(reportDir, { recursive: true });
  appendFileSync(
    path.join(reportDir, `${file.replaceAll(path.sep, "__")}.ndjson`),
    `${JSON.stringify({ file, test: currentTestName, index, ...counts })}\n`,
  );
}

export async function measureCommits(action) {
  // testing-library가 테스트마다 env를 다시 만들므로 호출할 때 app을 찾는다.
  const app = globalThis.lynxTestingEnv.backgroundThread.globalThis.lynx.getNativeApp();
  const original = app.callLepusMethod;
  const commits = [];
  app.callLepusMethod = function (name, payload, ...rest) {
    if (name === "rLynxChange" && !payload.patchOptions?.isHydration) commits.push(payload);
    return original.call(this, name, payload, ...rest);
  };
  try {
    await action();
    let settledAt = -1;
    for (let round = 0; settledAt !== commits.length; round++) {
      if (round === MAX_SETTLE_ROUNDS) {
        throw new Error(`Commits did not settle after ${MAX_SETTLE_ROUNDS} schedules.`);
      }
      settledAt = commits.length;
      await waitSchedule();
    }
  } finally {
    app.callLepusMethod = original;
  }
  const counts = {
    total: commits.length,
    nonEmpty: commits.filter(isNonEmpty).length,
    bytes: commits.reduce((sum, payload) => sum + payload.data.length, 0),
  };
  if (reportDir) record(counts);
  return counts;
}
