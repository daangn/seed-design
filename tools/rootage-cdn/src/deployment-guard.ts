import { readFile, writeFile } from "node:fs/promises";

export const ROOTAGE_WORKER_NAME = "seed-design-rootage";
export const ROOTAGE_WORKER_ENVIRONMENT = "production";
export const WRANGLER_DEPLOYMENTS_LIST_ARGS = [
  "deployments",
  "list",
  "--name",
  ROOTAGE_WORKER_NAME,
  "--json",
] as const;
export const WRANGLER_ROLLBACK_MESSAGE =
  "Automated rollback after Rootage production smoke failure in GitHub Actions";
export const WRANGLER_MANUAL_ROLLBACK_MESSAGE =
  "Approved manual Rootage production rollback in GitHub Actions";
export const WRANGLER_COMMAND = ["bunx", "--no-install", "wrangler"] as const;

const CLOUDFLARE_ID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const DEFAULT_RETRY_ATTEMPTS = 12;
const DEFAULT_RETRY_DELAY_MS = 5_000;

interface DeploymentVersion {
  version_id: string;
  percentage: number;
}

interface Deployment {
  id: string;
  created_on: string;
  versions: DeploymentVersion[];
}

export interface CurrentDeployment {
  deploymentId: string;
  versionId: string;
}

export interface DeploymentGuardState {
  schemaVersion: 1;
  workerName: typeof ROOTAGE_WORKER_NAME;
  priorDeploymentId: string;
  priorVersionId: string;
  expectedVersionId?: string;
  deployedDeploymentId?: string;
  deployedVersionId?: string;
}

export interface WranglerRunner {
  listDeployments(): Promise<string>;
  rollback(versionId: string, message?: string): Promise<void>;
}

export interface DeploymentRetryOptions {
  attempts?: number;
  delayMs?: number;
  sleep?: (milliseconds: number) => Promise<void>;
}

export interface FailedDeploymentReconciliationResult {
  action: "no-op" | "rolled-back";
  versionId: string;
}

export interface WorkerRollbackPlan {
  targetVersionId: string;
  targetHistoryDeploymentId: string;
  expectedCurrentVersionId: string;
  expectedCurrentDeploymentId: string;
}

class ConcurrentDeploymentError extends Error {}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function cloudflareId(value: unknown, label: string): string {
  if (typeof value !== "string" || !CLOUDFLARE_ID_PATTERN.test(value)) {
    throw new Error(`${label}가 올바른 Cloudflare ID가 아닙니다.`);
  }
  return value;
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label}가 객체가 아닙니다.`);
  }
  return value as Record<string, unknown>;
}

function parseDeployment(value: unknown, index: number): Deployment {
  const candidate = object(value, `deployment[${index}]`);
  const id = cloudflareId(candidate.id, `deployment[${index}].id`);
  if (typeof candidate.created_on !== "string" || Number.isNaN(Date.parse(candidate.created_on))) {
    throw new Error(`deployment[${index}].created_on이 올바르지 않습니다.`);
  }
  if (!Array.isArray(candidate.versions) || candidate.versions.length === 0) {
    throw new Error(`deployment[${index}].versions가 비어 있습니다.`);
  }
  const versions = candidate.versions.map((value, versionIndex) => {
    const version = object(value, `deployment[${index}].versions[${versionIndex}]`);
    if (
      typeof version.percentage !== "number" ||
      !Number.isFinite(version.percentage) ||
      version.percentage < 0 ||
      version.percentage > 100
    ) {
      throw new Error(
        `deployment[${index}].versions[${versionIndex}].percentage가 올바르지 않습니다.`,
      );
    }
    return {
      version_id: cloudflareId(
        version.version_id,
        `deployment[${index}].versions[${versionIndex}].version_id`,
      ),
      percentage: version.percentage,
    };
  });
  return { id, created_on: candidate.created_on, versions };
}

function deploymentsFromJson(json: string): Deployment[] {
  let decoded: unknown;
  try {
    decoded = JSON.parse(json);
  } catch {
    throw new Error("Wrangler deployments JSON을 읽을 수 없습니다.");
  }
  if (!Array.isArray(decoded) || decoded.length === 0) {
    throw new Error("현재 Rootage production deployment가 없습니다.");
  }
  const deployments = decoded.map(parseDeployment);
  for (let index = 1; index < deployments.length; index += 1) {
    if (deployments[index - 1]!.created_on >= deployments[index]!.created_on) {
      throw new Error("Wrangler deployments가 생성 시각 오름차순이 아니거나 시각이 중복됩니다.");
    }
  }
  return deployments;
}

function exactDeploymentVersion(deployment: Deployment, label: string): string {
  if (deployment.versions.length !== 1 || deployment.versions[0]!.percentage !== 100) {
    throw new Error(`${label}가 정확히 하나의 100% traffic 버전이 아닙니다.`);
  }
  return deployment.versions[0]!.version_id;
}

function currentDeployment(deployments: Deployment[]): CurrentDeployment {
  const current = deployments.at(-1)!;
  return {
    deploymentId: current.id,
    versionId: exactDeploymentVersion(current, "현재 deployment"),
  };
}

export function currentDeploymentFromJson(json: string): CurrentDeployment {
  return currentDeployment(deploymentsFromJson(json));
}

function workerRollbackVersionIds(
  targetVersionIdValue: string,
  expectedCurrentVersionIdValue: string,
): { targetVersionId: string; expectedCurrentVersionId: string } {
  const targetVersionId = cloudflareId(targetVersionIdValue, "worker rollback target version ID");
  const expectedCurrentVersionId = cloudflareId(
    expectedCurrentVersionIdValue,
    "expected current Worker version ID",
  );
  if (targetVersionId === expectedCurrentVersionId) {
    throw new Error("Worker rollback 대상은 현재 예상 version과 달라야 합니다.");
  }
  return { targetVersionId, expectedCurrentVersionId };
}

export function workerRollbackPlanFromJson(
  deploymentsJson: string,
  targetVersionIdValue: string,
  expectedCurrentVersionIdValue: string,
): WorkerRollbackPlan {
  const { targetVersionId, expectedCurrentVersionId } = workerRollbackVersionIds(
    targetVersionIdValue,
    expectedCurrentVersionIdValue,
  );

  const deployments = deploymentsFromJson(deploymentsJson);
  const current = currentDeployment(deployments);
  if (current.versionId !== expectedCurrentVersionId) {
    throw new Error("현재 Worker version이 rollback 입력의 expected version과 다릅니다.");
  }
  let targetHistoryDeployment: Deployment | undefined;
  for (let index = deployments.length - 2; index >= 0; index -= 1) {
    const deployment = deployments[index]!;
    if (
      deployment.versions.length === 1 &&
      deployment.versions[0]!.percentage === 100 &&
      deployment.versions[0]!.version_id === targetVersionId
    ) {
      targetHistoryDeployment = deployment;
      break;
    }
  }
  if (!targetHistoryDeployment) {
    throw new Error("rollback 대상 Worker version이 과거 100% deployment history에 없습니다.");
  }
  return {
    targetVersionId,
    targetHistoryDeploymentId: targetHistoryDeployment.id,
    expectedCurrentVersionId,
    expectedCurrentDeploymentId: current.deploymentId,
  };
}

export function assertWorkerRollbackPlanOwned(
  plan: WorkerRollbackPlan,
  deploymentsJson: string,
): void {
  const currentPlan = workerRollbackPlanFromJson(
    deploymentsJson,
    plan.targetVersionId,
    plan.expectedCurrentVersionId,
  );
  if (
    currentPlan.expectedCurrentDeploymentId !== plan.expectedCurrentDeploymentId ||
    currentPlan.targetHistoryDeploymentId !== plan.targetHistoryDeploymentId
  ) {
    throw new ConcurrentDeploymentError(
      "rollback 호출 직전 current 또는 target history deployment가 계획과 다릅니다.",
    );
  }
}

export function createDeploymentGuardState(deploymentsJson: string): DeploymentGuardState {
  const current = currentDeploymentFromJson(deploymentsJson);
  return {
    schemaVersion: 1,
    workerName: ROOTAGE_WORKER_NAME,
    priorDeploymentId: current.deploymentId,
    priorVersionId: current.versionId,
  };
}

function optionalCloudflareId(value: unknown, label: string): string | undefined {
  return value === undefined ? undefined : cloudflareId(value, label);
}

function parseState(value: unknown): DeploymentGuardState {
  const state = object(value, "Rootage deployment guard state");
  if (state.schemaVersion !== 1 || state.workerName !== ROOTAGE_WORKER_NAME) {
    throw new Error("Rootage deployment guard state 계약이 올바르지 않습니다.");
  }
  const priorDeploymentId = cloudflareId(state.priorDeploymentId, "priorDeploymentId");
  const priorVersionId = cloudflareId(state.priorVersionId, "priorVersionId");
  const expectedVersionId = optionalCloudflareId(state.expectedVersionId, "expectedVersionId");
  const deployedDeploymentId = optionalCloudflareId(
    state.deployedDeploymentId,
    "deployedDeploymentId",
  );
  const deployedVersionId = optionalCloudflareId(state.deployedVersionId, "deployedVersionId");
  if ((deployedDeploymentId === undefined) !== (deployedVersionId === undefined)) {
    throw new Error("배포된 deployment ID와 version ID는 함께 기록되어야 합니다.");
  }
  if (deployedVersionId !== undefined && deployedVersionId !== expectedVersionId) {
    throw new Error("기록된 deployment version과 Wrangler expected version이 다릅니다.");
  }
  return {
    schemaVersion: 1,
    workerName: ROOTAGE_WORKER_NAME,
    priorDeploymentId,
    priorVersionId,
    expectedVersionId,
    deployedDeploymentId,
    deployedVersionId,
  };
}

export function deployedVersionFromWranglerOutput(
  jsonLines: string,
  expectedWorker = ROOTAGE_WORKER_NAME,
  expectedEnvironment = ROOTAGE_WORKER_ENVIRONMENT,
): string {
  const lines = jsonLines.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) throw new Error("Wrangler structured output이 비어 있습니다.");

  const entries = lines.map((line, index) => {
    let decoded: unknown;
    try {
      decoded = JSON.parse(line);
    } catch {
      throw new Error(`Wrangler structured output ${index + 1}번째 줄이 JSON이 아닙니다.`);
    }
    const entry = object(decoded, `Wrangler structured output ${index + 1}번째 줄`);
    if (typeof entry.type !== "string" || entry.version !== 1) {
      throw new Error(`Wrangler structured output ${index + 1}번째 줄의 계약이 올바르지 않습니다.`);
    }
    if (typeof entry.timestamp !== "string" || Number.isNaN(Date.parse(entry.timestamp))) {
      throw new Error(
        `Wrangler structured output ${index + 1}번째 줄의 timestamp가 올바르지 않습니다.`,
      );
    }
    return entry;
  });

  if (entries.some((entry) => entry.type === "command-failed")) {
    throw new Error("Wrangler structured output에 command-failed가 기록되었습니다.");
  }
  const deployEntries = entries.filter((entry) => entry.type === "deploy");
  if (deployEntries.length !== 1) {
    throw new Error(`Wrangler deploy entry는 정확히 하나여야 합니다: ${deployEntries.length}개`);
  }
  const deploy = deployEntries[0]!;
  if (
    deploy.worker_name !== expectedWorker ||
    deploy.wrangler_environment !== expectedEnvironment ||
    deploy.worker_name_overridden !== false ||
    !Array.isArray(deploy.targets) ||
    (deploy.worker_tag !== null && typeof deploy.worker_tag !== "string")
  ) {
    throw new Error("Wrangler deploy entry의 worker/environment 계약이 올바르지 않습니다.");
  }
  return cloudflareId(deploy.version_id, "Wrangler deploy version_id");
}

export function recordExpectedDeployedVersion(
  stateValue: unknown,
  wranglerOutput: string,
): DeploymentGuardState {
  const state = parseState(stateValue);
  const expectedVersionId = deployedVersionFromWranglerOutput(wranglerOutput);
  if (expectedVersionId === state.priorVersionId) {
    throw new Error("Wrangler deploy가 기존 version ID를 다시 보고했습니다.");
  }
  if (state.expectedVersionId !== undefined && state.expectedVersionId !== expectedVersionId) {
    throw new Error("이미 기록된 expected version과 Wrangler deploy output이 다릅니다.");
  }
  return { ...state, expectedVersionId };
}

export function recordDeployedVersion(
  stateValue: unknown,
  deploymentsJson: string,
): DeploymentGuardState {
  const state = parseState(stateValue);
  if (state.expectedVersionId === undefined) {
    throw new Error("Wrangler deploy의 exact expected version이 기록되지 않았습니다.");
  }
  const deployments = deploymentsFromJson(deploymentsJson);
  const current = deployments.at(-1)!;
  const currentVersionId = exactDeploymentVersion(current, "현재 deployment");
  if (currentVersionId !== state.expectedVersionId) {
    throw new Error("현재 version이 Wrangler deploy의 exact expected version과 다릅니다.");
  }
  const previous = deployments.at(-2);
  if (!previous) {
    throw new Error("새 deployment의 정확한 직전 rollback 대상을 확인할 수 없습니다.");
  }
  const previousVersionId = exactDeploymentVersion(previous, "직전 deployment");
  if (
    previous.id !== state.priorDeploymentId ||
    previousVersionId !== state.priorVersionId ||
    current.id === state.priorDeploymentId
  ) {
    throw new Error("배포 전후 사이에 다른 deployment가 있어 소유권 확인을 거부했습니다.");
  }
  if (
    state.deployedDeploymentId !== undefined &&
    (state.deployedDeploymentId !== current.id || state.deployedVersionId !== currentVersionId)
  ) {
    throw new Error("기록된 deployment가 현재 exact expected deployment와 다릅니다.");
  }
  return {
    ...state,
    deployedDeploymentId: current.id,
    deployedVersionId: currentVersionId,
  };
}

function retryOptions(options: DeploymentRetryOptions): Required<DeploymentRetryOptions> {
  const attempts = options.attempts ?? DEFAULT_RETRY_ATTEMPTS;
  const delayMs = options.delayMs ?? DEFAULT_RETRY_DELAY_MS;
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error("deployment 조회 재시도 횟수는 1 이상의 정수여야 합니다.");
  }
  if (!Number.isInteger(delayMs) || delayMs < 0) {
    throw new Error("deployment 조회 재시도 간격은 0 이상의 정수여야 합니다.");
  }
  return { attempts, delayMs, sleep: options.sleep ?? ((milliseconds) => Bun.sleep(milliseconds)) };
}

export async function waitForDeployedVersion(
  stateValue: unknown,
  runner: Pick<WranglerRunner, "listDeployments">,
  options: DeploymentRetryOptions = {},
): Promise<DeploymentGuardState> {
  const state = parseState(stateValue);
  if (state.expectedVersionId === undefined) {
    throw new Error("Wrangler deploy의 exact expected version이 기록되지 않았습니다.");
  }
  const retry = retryOptions(options);
  let lastError: unknown;
  for (let attempt = 1; attempt <= retry.attempts; attempt += 1) {
    try {
      const deploymentsJson = await runner.listDeployments();
      const current = currentDeploymentFromJson(deploymentsJson);
      if (current.versionId === state.expectedVersionId) {
        try {
          return recordDeployedVersion(state, deploymentsJson);
        } catch (error) {
          throw new ConcurrentDeploymentError(errorMessage(error));
        }
      }
      if (
        current.deploymentId !== state.priorDeploymentId ||
        current.versionId !== state.priorVersionId
      ) {
        throw new ConcurrentDeploymentError(
          "현재 deployment가 prior 또는 이 작업의 expected version이 아닙니다.",
        );
      }
      lastError = new Error("Wrangler deploy의 exact version이 아직 current로 보이지 않습니다.");
    } catch (error) {
      if (error instanceof ConcurrentDeploymentError) throw error;
      lastError = error;
    }
    if (attempt < retry.attempts) await retry.sleep(retry.delayMs);
  }
  throw new Error(
    `Wrangler deploy의 exact version을 ${retry.attempts}회 안에 확인하지 못했습니다: ${errorMessage(lastError)}`,
    { cause: lastError },
  );
}

export function recordedDeployedVersionFromState(stateValue: unknown): string {
  const state = parseState(stateValue);
  if (
    state.expectedVersionId === undefined ||
    state.deployedDeploymentId === undefined ||
    state.deployedVersionId !== state.expectedVersionId
  ) {
    throw new Error("검증할 exact deployed version이 deployment guard state에 없습니다.");
  }
  return state.expectedVersionId;
}

export function rollbackVersionIfOwned(stateValue: unknown, deploymentsJson: string): string {
  const state = parseState(stateValue);
  const observed = recordDeployedVersion(state, deploymentsJson);
  if (
    state.deployedDeploymentId !== undefined &&
    observed.deployedDeploymentId !== state.deployedDeploymentId
  ) {
    throw new Error("현재 deployment가 이 작업이 기록한 대상과 달라 자동 rollback을 거부했습니다.");
  }
  return state.priorVersionId;
}

type FailedDeploymentObservation =
  | { kind: "prior"; state: DeploymentGuardState }
  | { kind: "owned"; state: DeploymentGuardState };

function failedDeploymentObservation(
  stateValue: unknown,
  deploymentsJson: string,
): FailedDeploymentObservation {
  const state = parseState(stateValue);
  const deployments = deploymentsFromJson(deploymentsJson);
  const current = currentDeployment(deployments);

  if (
    current.deploymentId === state.priorDeploymentId &&
    current.versionId === state.priorVersionId
  ) {
    if (state.deployedDeploymentId !== undefined) {
      throw new ConcurrentDeploymentError(
        "이미 기록한 deployment가 사라지고 배포 전 deployment가 current여서 자동 복구를 거부했습니다.",
      );
    }
    return { kind: "prior", state };
  }

  const previous = deployments.at(-2);
  if (!previous) {
    throw new ConcurrentDeploymentError(
      "배포 전 deployment와 현재 deployment의 exact 인접 관계를 확인할 수 없습니다.",
    );
  }
  const previousVersionId = exactDeploymentVersion(previous, "직전 deployment");
  if (
    previous.id !== state.priorDeploymentId ||
    previousVersionId !== state.priorVersionId ||
    current.deploymentId === state.priorDeploymentId ||
    current.versionId === state.priorVersionId
  ) {
    throw new ConcurrentDeploymentError(
      "배포 전후 사이에 다른 deployment가 있거나 새 version 소유권이 모호합니다.",
    );
  }
  if (state.expectedVersionId !== undefined && current.versionId !== state.expectedVersionId) {
    throw new ConcurrentDeploymentError(
      "현재 deployment가 Wrangler output의 exact expected version과 다릅니다.",
    );
  }
  if (
    state.deployedDeploymentId !== undefined &&
    (current.deploymentId !== state.deployedDeploymentId ||
      current.versionId !== state.deployedVersionId)
  ) {
    throw new ConcurrentDeploymentError(
      "현재 deployment가 이 작업이 기록한 exact deployment와 다릅니다.",
    );
  }
  return {
    kind: "owned",
    state: {
      ...state,
      expectedVersionId: current.versionId,
      deployedDeploymentId: current.deploymentId,
      deployedVersionId: current.versionId,
    },
  };
}

async function waitForFailedDeploymentObservation(
  stateValue: unknown,
  runner: Pick<WranglerRunner, "listDeployments">,
  options: DeploymentRetryOptions,
): Promise<FailedDeploymentObservation> {
  const state = parseState(stateValue);
  const retry = retryOptions(options);
  let priorObservations = 0;
  let lastError: unknown;
  for (let attempt = 1; attempt <= retry.attempts; attempt += 1) {
    try {
      const observation = failedDeploymentObservation(state, await runner.listDeployments());
      if (observation.kind === "owned") return observation;
      priorObservations += 1;
      lastError = new Error("배포 전 deployment가 아직 current입니다.");
    } catch (error) {
      if (error instanceof ConcurrentDeploymentError) throw error;
      lastError = error;
    }
    if (attempt < retry.attempts) await retry.sleep(retry.delayMs);
  }
  if (priorObservations === retry.attempts) return { kind: "prior", state };
  throw new Error(
    `실패한 deployment의 소유권을 ${retry.attempts}회 안에 확인하지 못했습니다: ${errorMessage(lastError)}`,
    { cause: lastError },
  );
}

function assertSameOwnedDeployment(
  planned: DeploymentGuardState,
  observation: FailedDeploymentObservation,
): DeploymentGuardState {
  if (
    observation.kind !== "owned" ||
    observation.state.deployedDeploymentId !== planned.deployedDeploymentId ||
    observation.state.deployedVersionId !== planned.deployedVersionId
  ) {
    throw new ConcurrentDeploymentError(
      "rollback 호출 직전 current deployment가 복구 계획과 달라졌습니다.",
    );
  }
  return observation.state;
}

export function wranglerRollbackArgs(
  versionId: string,
  message = WRANGLER_ROLLBACK_MESSAGE,
): string[] {
  return [
    "rollback",
    cloudflareId(versionId, "rollback version ID"),
    "--name",
    ROOTAGE_WORKER_NAME,
    "--message",
    message,
    "--yes",
  ];
}

export async function rollbackOwnedDeployment(
  stateValue: unknown,
  runner: WranglerRunner,
  options: DeploymentRetryOptions = {},
): Promise<FailedDeploymentReconciliationResult> {
  const observed = await waitForFailedDeploymentObservation(stateValue, runner, options);
  if (observed.kind === "prior") {
    return { action: "no-op", versionId: observed.state.priorVersionId };
  }

  const rechecked = assertSameOwnedDeployment(
    observed.state,
    failedDeploymentObservation(observed.state, await runner.listDeployments()),
  );
  const deployedDeploymentId = rechecked.deployedDeploymentId!;
  const deployedVersionId = rechecked.deployedVersionId!;
  let rollbackError: unknown;
  try {
    await runner.rollback(rechecked.priorVersionId, WRANGLER_ROLLBACK_MESSAGE);
  } catch (error) {
    rollbackError = error;
  }

  try {
    await waitForDeployedVersion(
      {
        schemaVersion: 1,
        workerName: ROOTAGE_WORKER_NAME,
        priorDeploymentId: deployedDeploymentId,
        priorVersionId: deployedVersionId,
        expectedVersionId: rechecked.priorVersionId,
      },
      runner,
      options,
    );
  } catch (confirmationError) {
    if (rollbackError !== undefined) {
      throw new Error(
        `Wrangler rollback 명령과 rollback 후 current 확인이 모두 실패했습니다: ${errorMessage(rollbackError)}; ${errorMessage(confirmationError)}`,
        { cause: confirmationError },
      );
    }
    throw confirmationError;
  }
  return { action: "rolled-back", versionId: rechecked.priorVersionId };
}

export async function rollbackWorkerVersion(
  targetVersionId: string,
  expectedCurrentVersionId: string,
  runner: WranglerRunner,
  options: DeploymentRetryOptions = {},
): Promise<string> {
  const versionIds = workerRollbackVersionIds(targetVersionId, expectedCurrentVersionId);
  const plan = workerRollbackPlanFromJson(
    await runner.listDeployments(),
    versionIds.targetVersionId,
    versionIds.expectedCurrentVersionId,
  );
  assertWorkerRollbackPlanOwned(plan, await runner.listDeployments());
  await runner.rollback(plan.targetVersionId, WRANGLER_MANUAL_ROLLBACK_MESSAGE);
  const observed = await waitForDeployedVersion(
    {
      schemaVersion: 1,
      workerName: ROOTAGE_WORKER_NAME,
      priorDeploymentId: plan.expectedCurrentDeploymentId,
      priorVersionId: plan.expectedCurrentVersionId,
      expectedVersionId: plan.targetVersionId,
    },
    runner,
    options,
  );
  return recordedDeployedVersionFromState(observed);
}

async function runWrangler(args: readonly string[], captureStdout: boolean): Promise<string> {
  const subprocess = Bun.spawn([...WRANGLER_COMMAND, ...args], {
    env: process.env,
    stdin: "ignore",
    stdout: captureStdout ? "pipe" : "inherit",
    stderr: "inherit",
  });
  const stdout = captureStdout ? await new Response(subprocess.stdout).text() : "";
  const exitCode = await subprocess.exited;
  if (exitCode !== 0) throw new Error(`Wrangler 명령이 종료 코드 ${exitCode}로 실패했습니다.`);
  return stdout;
}

const wranglerRunner: WranglerRunner = {
  listDeployments: () => runWrangler(WRANGLER_DEPLOYMENTS_LIST_ARGS, true),
  rollback: async (versionId, message) => {
    await runWrangler(wranglerRollbackArgs(versionId, message), false);
  },
};

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

async function readState(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    throw new Error("Rootage deployment guard state를 읽을 수 없습니다.");
  }
}

async function writeState(path: string, state: DeploymentGuardState): Promise<void> {
  await writeFile(path, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
}

async function main(): Promise<void> {
  const command = process.argv[2];
  if (command === "worker-rollback") {
    requiredEnvironment("CLOUDFLARE_API_TOKEN");
    requiredEnvironment("CLOUDFLARE_ACCOUNT_ID");
    const versionId = await rollbackWorkerVersion(
      requiredEnvironment("ROOTAGE_WORKER_VERSION_ID"),
      requiredEnvironment("ROOTAGE_EXPECTED_WORKER_VERSION_ID"),
      wranglerRunner,
    );
    console.log(`Rootage production manually rolled back to exact version: ${versionId}`);
    return;
  }
  const statePath = requiredEnvironment("ROOTAGE_DEPLOY_STATE");
  if (command === "before") {
    const state = createDeploymentGuardState(await wranglerRunner.listDeployments());
    await writeState(statePath, state);
    console.log(`Rootage rollback target recorded: ${state.priorVersionId}`);
    return;
  }
  if (command === "after") {
    const captured = recordExpectedDeployedVersion(
      await readState(statePath),
      await readFile(requiredEnvironment("WRANGLER_OUTPUT_FILE_PATH"), "utf8"),
    );
    await writeState(statePath, captured);
    const state = await waitForDeployedVersion(captured, wranglerRunner);
    await writeState(statePath, state);
    console.log(`Rootage deployment recorded: ${state.deployedVersionId}`);
    return;
  }
  if (command === "rollback-if-owned") {
    const result = await rollbackOwnedDeployment(await readState(statePath), wranglerRunner);
    console.log(
      result.action === "rolled-back"
        ? `Rootage production rolled back to exact version: ${result.versionId}`
        : `Rootage production already remains at exact prior version: ${result.versionId}`,
    );
    return;
  }
  throw new Error("사용법: deployment-guard.ts <before|after|rollback-if-owned|worker-rollback>");
}

if (import.meta.main) {
  await main();
}
