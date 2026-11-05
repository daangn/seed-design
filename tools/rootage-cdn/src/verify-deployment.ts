import { readFile } from "node:fs/promises";
import { recordedDeployedVersionFromState } from "./deployment-guard";
import { ROOTAGE_PRODUCTION_SMOKE_URL } from "./deployment-metadata";
import { type FetchImplementation, verifyWorkerRoutePublic } from "./operations";

export async function verifyProductionDeployment(
  statePath: string,
  fetchImplementation: FetchImplementation = globalThis.fetch.bind(globalThis),
): Promise<string> {
  let state: unknown;
  try {
    state = JSON.parse(await readFile(statePath, "utf8"));
  } catch {
    throw new Error("Rootage deployment guard state를 smoke 검증 전에 읽을 수 없습니다.");
  }
  const expectedWorkerVersionId = recordedDeployedVersionFromState(state);
  await verifyWorkerRoutePublic(ROOTAGE_PRODUCTION_SMOKE_URL, fetchImplementation, {
    expectedWorkerVersionId,
  });
  return expectedWorkerVersionId;
}

if (import.meta.main) {
  const statePath = process.env.ROOTAGE_DEPLOY_STATE;
  if (!statePath) throw new Error("ROOTAGE_DEPLOY_STATE 환경 변수가 필요합니다.");
  const versionId = await verifyProductionDeployment(statePath);
  console.log(`Rootage production contract smoke passed for exact Worker version: ${versionId}`);
}
