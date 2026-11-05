import { validateRootageOperationInput } from "./operation-input";

const input = validateRootageOperationInput({
  operation: process.env.ROOTAGE_INPUT_OPERATION ?? "",
  version: process.env.ROOTAGE_INPUT_VERSION,
  expectedCurrent: process.env.ROOTAGE_INPUT_EXPECTED_CURRENT,
  npmIntegrity: process.env.ROOTAGE_INPUT_NPM_INTEGRITY,
  sourceSha: process.env.ROOTAGE_INPUT_SOURCE_SHA,
  workerVersionId: process.env.ROOTAGE_INPUT_WORKER_VERSION_ID,
  expectedWorkerVersionId: process.env.ROOTAGE_INPUT_EXPECTED_WORKER_VERSION_ID,
  confirm: process.env.ROOTAGE_INPUT_CONFIRM,
});

console.log(`Rootage ${input.operation} 입력 검증이 완료되었습니다.`);
