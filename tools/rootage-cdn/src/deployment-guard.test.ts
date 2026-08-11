import { describe, expect, test } from "bun:test";
import {
  assertWorkerRollbackPlanOwned,
  createDeploymentGuardState,
  currentDeploymentFromJson,
  deployedVersionFromWranglerOutput,
  recordDeployedVersion,
  recordedDeployedVersionFromState,
  recordExpectedDeployedVersion,
  rollbackOwnedDeployment,
  rollbackWorkerVersion,
  rollbackVersionIfOwned,
  ROOTAGE_WORKER_ENVIRONMENT,
  ROOTAGE_WORKER_NAME,
  waitForDeployedVersion,
  workerRollbackPlanFromJson,
  WRANGLER_COMMAND,
  WRANGLER_DEPLOYMENTS_LIST_ARGS,
  WRANGLER_MANUAL_ROLLBACK_MESSAGE,
  WRANGLER_ROLLBACK_MESSAGE,
  wranglerRollbackArgs,
} from "./deployment-guard";

const ids = {
  priorDeployment: "11111111-1111-1111-1111-111111111111",
  priorVersion: "22222222-2222-2222-2222-222222222222",
  deployedDeployment: "33333333-3333-3333-3333-333333333333",
  deployedVersion: "44444444-4444-4444-4444-444444444444",
  concurrentDeployment: "55555555-5555-5555-5555-555555555555",
  concurrentVersion: "66666666-6666-6666-6666-666666666666",
  rollbackDeployment: "77777777-7777-7777-7777-777777777777",
  repeatedTargetDeployment: "88888888-8888-8888-8888-888888888888",
};

interface HistoryEntry {
  deploymentId: string;
  versionId: string;
  versions?: Array<{ version_id: string; percentage: number }>;
}

function history(entries: HistoryEntry[]): string {
  return JSON.stringify(
    entries.map((entry, index) => ({
      id: entry.deploymentId,
      created_on: `2026-08-09T${String(index).padStart(2, "0")}:00:00.000Z`,
      versions: entry.versions ?? [{ version_id: entry.versionId, percentage: 100 }],
    })),
  );
}

function priorOnly(): string {
  return history([{ deploymentId: ids.priorDeployment, versionId: ids.priorVersion }]);
}

function ownedDeployment(): string {
  return history([
    { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
    { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
  ]);
}

function concurrentDeployment(): string {
  return history([
    { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
    { deploymentId: ids.concurrentDeployment, versionId: ids.concurrentVersion },
  ]);
}

function completedManualRollback(): string {
  return history([
    { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
    { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
    { deploymentId: ids.rollbackDeployment, versionId: ids.priorVersion },
  ]);
}

function wranglerOutput(
  overrides: Record<string, unknown> = {},
  extraEntries: Array<Record<string, unknown>> = [],
): string {
  const timestamp = "2026-08-09T01:00:00.000Z";
  const entries = [
    {
      type: "wrangler-session",
      version: 1,
      wrangler_version: "4.45.3",
      command_line_args: ["deploy"],
      log_file_path: "/tmp/wrangler.log",
      timestamp,
    },
    {
      type: "deploy",
      version: 1,
      worker_name: ROOTAGE_WORKER_NAME,
      worker_tag: null,
      version_id: ids.deployedVersion,
      targets: [],
      wrangler_environment: ROOTAGE_WORKER_ENVIRONMENT,
      worker_name_overridden: false,
      timestamp,
      ...overrides,
    },
    ...extraEntries,
  ];
  return `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
}

function expectedState() {
  return recordExpectedDeployedVersion(createDeploymentGuardState(priorOnly()), wranglerOutput());
}

describe("Rootage production deployment guard", () => {
  test("Wrangler JSON의 최신 단일 100% traffic deployment를 선택한다", () => {
    expect(currentDeploymentFromJson(ownedDeployment())).toEqual({
      deploymentId: ids.deployedDeployment,
      versionId: ids.deployedVersion,
    });
  });

  test("부분 rollout, 잘못된 ID, 모호한 순서에는 fail closed한다", () => {
    expect(() =>
      currentDeploymentFromJson(
        history([
          { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
          {
            deploymentId: ids.deployedDeployment,
            versionId: ids.deployedVersion,
            versions: [
              { version_id: ids.priorVersion, percentage: 50 },
              { version_id: ids.deployedVersion, percentage: 50 },
            ],
          },
        ]),
      ),
    ).toThrow("정확히 하나의 100% traffic");
    expect(() =>
      currentDeploymentFromJson(
        history([{ deploymentId: ids.deployedDeployment, versionId: "$(unsafe)" }]),
      ),
    ).toThrow("올바른 Cloudflare ID");
    expect(() =>
      currentDeploymentFromJson(
        JSON.stringify([
          {
            id: ids.priorDeployment,
            created_on: "2026-08-09T01:00:00.000Z",
            versions: [{ version_id: ids.priorVersion, percentage: 100 }],
          },
          {
            id: ids.deployedDeployment,
            created_on: "2026-08-09T00:00:00.000Z",
            versions: [{ version_id: ids.deployedVersion, percentage: 100 }],
          },
        ]),
      ),
    ).toThrow("오름차순");
  });

  test("Wrangler 4.45.3 JSONL의 exact deploy entry만 신뢰한다", () => {
    expect(deployedVersionFromWranglerOutput(wranglerOutput())).toBe(ids.deployedVersion);
    expect(() =>
      deployedVersionFromWranglerOutput(wranglerOutput({ worker_name: "other-worker" })),
    ).toThrow("worker/environment");
    expect(() =>
      deployedVersionFromWranglerOutput(wranglerOutput({ wrangler_environment: "preview" })),
    ).toThrow("worker/environment");
    expect(() =>
      deployedVersionFromWranglerOutput(wranglerOutput({ version_id: "$(unsafe)" })),
    ).toThrow("올바른 Cloudflare ID");
    expect(() =>
      deployedVersionFromWranglerOutput(
        wranglerOutput({}, [
          {
            type: "deploy",
            version: 1,
            timestamp: "2026-08-09T01:01:00.000Z",
          },
        ]),
      ),
    ).toThrow("정확히 하나");
    expect(() =>
      deployedVersionFromWranglerOutput(
        wranglerOutput({}, [
          {
            type: "command-failed",
            version: 1,
            timestamp: "2026-08-09T01:01:00.000Z",
          },
        ]),
      ),
    ).toThrow("command-failed");
  });

  test("structured output version과 정확히 인접한 deployment만 기록한다", () => {
    const before = createDeploymentGuardState(priorOnly());
    const expected = recordExpectedDeployedVersion(before, wranglerOutput());
    expect(expected).toMatchObject({
      workerName: ROOTAGE_WORKER_NAME,
      priorDeploymentId: ids.priorDeployment,
      priorVersionId: ids.priorVersion,
      expectedVersionId: ids.deployedVersion,
    });
    const recorded = recordDeployedVersion(expected, ownedDeployment());
    expect(recorded).toMatchObject({
      deployedDeploymentId: ids.deployedDeployment,
      deployedVersionId: ids.deployedVersion,
    });
    expect(recordedDeployedVersionFromState(recorded)).toBe(ids.deployedVersion);

    expect(() =>
      recordDeployedVersion(
        expected,
        history([
          { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
          { deploymentId: ids.concurrentDeployment, versionId: ids.concurrentVersion },
          { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
        ]),
      ),
    ).toThrow("다른 deployment");
  });

  test("exact expected version이 current가 될 때까지 bounded retry한다", async () => {
    const responses = [priorOnly(), priorOnly(), ownedDeployment()];
    const sleeps: number[] = [];
    const state = await waitForDeployedVersion(
      expectedState(),
      { listDeployments: async () => responses.shift()! },
      {
        attempts: 3,
        delayMs: 7,
        sleep: async (milliseconds) => {
          sleeps.push(milliseconds);
        },
      },
    );
    expect(state.deployedVersionId).toBe(ids.deployedVersion);
    expect(sleeps).toEqual([7, 7]);
  });

  test("expected version 전후에 제3 deployment가 있으면 즉시 fail closed한다", async () => {
    const sleeps: number[] = [];
    await expect(
      waitForDeployedVersion(
        expectedState(),
        { listDeployments: async () => concurrentDeployment() },
        {
          attempts: 3,
          delayMs: 1,
          sleep: async (milliseconds) => {
            sleeps.push(milliseconds);
          },
        },
      ),
    ).rejects.toThrow("prior 또는 이 작업의 expected version");
    expect(sleeps).toEqual([]);
  });

  test("record 단계가 실패한 state도 current가 exact expected일 때만 rollback한다", async () => {
    const rolledBack: string[] = [];
    const state = expectedState();
    const responses = [ownedDeployment(), ownedDeployment(), completedManualRollback()];
    await expect(
      rollbackOwnedDeployment(
        state,
        {
          listDeployments: async () => responses.shift()!,
          rollback: async (versionId) => {
            rolledBack.push(versionId);
          },
        },
        { attempts: 1, delayMs: 0 },
      ),
    ).resolves.toEqual({ action: "rolled-back", versionId: ids.priorVersion });
    expect(rolledBack).toEqual([ids.priorVersion]);
  });

  test("Wrangler output이 없어도 prior의 exact 단일 후속 deployment만 복구한다", async () => {
    const rolledBack: string[] = [];
    const responses = [ownedDeployment(), ownedDeployment(), completedManualRollback()];
    await expect(
      rollbackOwnedDeployment(
        createDeploymentGuardState(priorOnly()),
        {
          listDeployments: async () => responses.shift()!,
          rollback: async (versionId) => {
            rolledBack.push(versionId);
          },
        },
        { attempts: 1, delayMs: 0 },
      ),
    ).resolves.toEqual({ action: "rolled-back", versionId: ids.priorVersion });
    expect(rolledBack).toEqual([ids.priorVersion]);
  });

  test("실패 뒤 current가 bounded window 동안 exact prior면 mutation 없이 no-op한다", async () => {
    const rolledBack: string[] = [];
    const sleeps: number[] = [];
    await expect(
      rollbackOwnedDeployment(
        createDeploymentGuardState(priorOnly()),
        {
          listDeployments: async () => priorOnly(),
          rollback: async (versionId) => {
            rolledBack.push(versionId);
          },
        },
        {
          attempts: 2,
          delayMs: 7,
          sleep: async (milliseconds) => {
            sleeps.push(milliseconds);
          },
        },
      ),
    ).resolves.toEqual({ action: "no-op", versionId: ids.priorVersion });
    expect(rolledBack).toEqual([]);
    expect(sleeps).toEqual([7]);
  });

  test("deploy 명령 실패 뒤 늦게 보이는 owned successor도 rollback하고 prior를 확인한다", async () => {
    const responses = [
      priorOnly(),
      ownedDeployment(),
      ownedDeployment(),
      completedManualRollback(),
    ];
    await expect(
      rollbackOwnedDeployment(
        createDeploymentGuardState(priorOnly()),
        {
          listDeployments: async () => responses.shift()!,
          rollback: async () => {
            throw new Error("Wrangler exited nonzero after accepting rollback");
          },
        },
        { attempts: 2, delayMs: 0, sleep: async () => {} },
      ),
    ).resolves.toEqual({ action: "rolled-back", versionId: ids.priorVersion });
  });

  test("prior 뒤 둘 이상의 deployment가 있으면 markerless 자동 rollback을 거부한다", async () => {
    const rolledBack: string[] = [];
    await expect(
      rollbackOwnedDeployment(
        createDeploymentGuardState(priorOnly()),
        {
          listDeployments: async () =>
            history([
              { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
              { deploymentId: ids.concurrentDeployment, versionId: ids.concurrentVersion },
              { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
            ]),
          rollback: async (versionId) => {
            rolledBack.push(versionId);
          },
        },
        { attempts: 1, delayMs: 0 },
      ),
    ).rejects.toThrow("다른 deployment");
    expect(rolledBack).toEqual([]);
  });

  test("동시 배포가 감지되면 runner의 rollback을 호출하지 않는다", async () => {
    const rolledBack: string[] = [];
    await expect(
      rollbackOwnedDeployment(
        expectedState(),
        {
          listDeployments: async () => concurrentDeployment(),
          rollback: async (versionId) => {
            rolledBack.push(versionId);
          },
        },
        { attempts: 1, delayMs: 0 },
      ),
    ).rejects.toThrow("exact expected version");
    expect(rolledBack).toEqual([]);
  });

  test("rollback 뒤 prior가 새 exact current가 되지 않으면 bounded failure한다", async () => {
    const responses = [ownedDeployment(), ownedDeployment(), ownedDeployment(), ownedDeployment()];
    await expect(
      rollbackOwnedDeployment(
        expectedState(),
        {
          listDeployments: async () => responses.shift()!,
          rollback: async () => {},
        },
        { attempts: 2, delayMs: 0, sleep: async () => {} },
      ),
    ).rejects.toThrow("2회 안에 확인하지 못했습니다");
  });

  test("현재 deployment와 version이 기록된 소유권과 모두 같아야 한다", () => {
    const recorded = recordDeployedVersion(expectedState(), ownedDeployment());
    expect(rollbackVersionIfOwned(recorded, ownedDeployment())).toBe(ids.priorVersion);
    expect(() =>
      rollbackVersionIfOwned(
        recorded,
        history([
          { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
          { deploymentId: ids.concurrentDeployment, versionId: ids.deployedVersion },
        ]),
      ),
    ).toThrow("기록된 deployment");
  });

  test("manual rollback plan은 strict target/current UUID와 history ownership을 고정한다", () => {
    expect(
      workerRollbackPlanFromJson(ownedDeployment(), ids.priorVersion, ids.deployedVersion),
    ).toEqual({
      targetVersionId: ids.priorVersion,
      targetHistoryDeploymentId: ids.priorDeployment,
      expectedCurrentVersionId: ids.deployedVersion,
      expectedCurrentDeploymentId: ids.deployedDeployment,
    });
    expect(() =>
      workerRollbackPlanFromJson(ownedDeployment(), ids.deployedVersion, ids.deployedVersion),
    ).toThrow("달라야");
    expect(() =>
      workerRollbackPlanFromJson(ownedDeployment(), "$(unsafe)", ids.deployedVersion),
    ).toThrow("올바른 Cloudflare ID");
    expect(() =>
      workerRollbackPlanFromJson(ownedDeployment(), ids.priorVersion, ids.concurrentVersion),
    ).toThrow("expected version");
  });

  test("manual rollback target은 과거 exact 100% deployment에 있어야 한다", () => {
    expect(() =>
      workerRollbackPlanFromJson(
        history([
          { deploymentId: ids.priorDeployment, versionId: ids.concurrentVersion },
          { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
        ]),
        ids.priorVersion,
        ids.deployedVersion,
      ),
    ).toThrow("과거 100% deployment history");
    expect(() =>
      workerRollbackPlanFromJson(
        history([
          {
            deploymentId: ids.priorDeployment,
            versionId: ids.priorVersion,
            versions: [
              { version_id: ids.priorVersion, percentage: 50 },
              { version_id: ids.concurrentVersion, percentage: 50 },
            ],
          },
          { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
        ]),
        ids.priorVersion,
        ids.deployedVersion,
      ),
    ).toThrow("과거 100% deployment history");
  });

  test("manual rollback은 잘못된 UUID를 credentialed history 조회 전에 거부한다", async () => {
    let reads = 0;
    const runner = {
      listDeployments: async () => {
        reads += 1;
        return ownedDeployment();
      },
      rollback: async () => {},
    };
    await expect(rollbackWorkerVersion("$(unsafe)", ids.deployedVersion, runner)).rejects.toThrow(
      "올바른 Cloudflare ID",
    );
    await expect(
      rollbackWorkerVersion(ids.deployedVersion, ids.deployedVersion, runner),
    ).rejects.toThrow("달라야");
    expect(reads).toBe(0);
  });

  test("manual rollback은 호출 직전 current와 target history를 다시 고정한다", () => {
    const plan = workerRollbackPlanFromJson(
      ownedDeployment(),
      ids.priorVersion,
      ids.deployedVersion,
    );
    expect(() =>
      assertWorkerRollbackPlanOwned(
        plan,
        history([
          { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
          { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
          { deploymentId: ids.concurrentDeployment, versionId: ids.deployedVersion },
        ]),
      ),
    ).toThrow("계획과 다릅니다");
    expect(() =>
      assertWorkerRollbackPlanOwned(
        plan,
        history([
          { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
          { deploymentId: ids.repeatedTargetDeployment, versionId: ids.priorVersion },
          { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
        ]),
      ),
    ).toThrow("계획과 다릅니다");
  });

  test("manual rollback은 exact history를 두 번 읽고 target current를 bounded 확인한다", async () => {
    const responses = [
      ownedDeployment(),
      ownedDeployment(),
      ownedDeployment(),
      completedManualRollback(),
    ];
    const events: string[] = [];
    const result = await rollbackWorkerVersion(
      ids.priorVersion,
      ids.deployedVersion,
      {
        listDeployments: async () => {
          events.push("list");
          return responses.shift()!;
        },
        rollback: async (versionId, message) => {
          events.push(`rollback:${versionId}:${message}`);
        },
      },
      {
        attempts: 2,
        delayMs: 7,
        sleep: async (milliseconds) => {
          events.push(`sleep:${milliseconds}`);
        },
      },
    );
    expect(result).toBe(ids.priorVersion);
    expect(events).toEqual([
      "list",
      "list",
      `rollback:${ids.priorVersion}:${WRANGLER_MANUAL_ROLLBACK_MESSAGE}`,
      "list",
      "sleep:7",
      "list",
    ]);
  });

  test("manual rollback은 pre-call concurrency에서 mutation을 호출하지 않는다", async () => {
    const rolledBack: string[] = [];
    const responses = [
      ownedDeployment(),
      history([
        { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
        { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
        { deploymentId: ids.concurrentDeployment, versionId: ids.deployedVersion },
      ]),
    ];
    await expect(
      rollbackWorkerVersion(
        ids.priorVersion,
        ids.deployedVersion,
        {
          listDeployments: async () => responses.shift()!,
          rollback: async (versionId) => {
            rolledBack.push(versionId);
          },
        },
        { attempts: 1, delayMs: 0 },
      ),
    ).rejects.toThrow("계획과 다릅니다");
    expect(rolledBack).toEqual([]);
  });

  test("manual rollback은 post-call concurrent deployment를 즉시 거부한다", async () => {
    const sleeps: number[] = [];
    const responses = [ownedDeployment(), ownedDeployment(), concurrentDeployment()];
    await expect(
      rollbackWorkerVersion(
        ids.priorVersion,
        ids.deployedVersion,
        {
          listDeployments: async () => responses.shift()!,
          rollback: async () => {},
        },
        {
          attempts: 3,
          delayMs: 1,
          sleep: async (milliseconds) => {
            sleeps.push(milliseconds);
          },
        },
      ),
    ).rejects.toThrow("prior 또는 이 작업의 expected version");
    expect(sleeps).toEqual([]);
  });

  test("manual rollback은 target current여도 중간 deployment가 끼면 거부한다", async () => {
    const responses = [
      ownedDeployment(),
      ownedDeployment(),
      history([
        { deploymentId: ids.priorDeployment, versionId: ids.priorVersion },
        { deploymentId: ids.deployedDeployment, versionId: ids.deployedVersion },
        { deploymentId: ids.concurrentDeployment, versionId: ids.concurrentVersion },
        { deploymentId: ids.rollbackDeployment, versionId: ids.priorVersion },
      ]),
    ];
    await expect(
      rollbackWorkerVersion(
        ids.priorVersion,
        ids.deployedVersion,
        {
          listDeployments: async () => responses.shift()!,
          rollback: async () => {},
        },
        { attempts: 1, delayMs: 0 },
      ),
    ).rejects.toThrow("다른 deployment");
  });

  test("manual rollback은 bounded confirmation timeout을 보고한다", async () => {
    const responses = [ownedDeployment(), ownedDeployment(), ownedDeployment(), ownedDeployment()];
    await expect(
      rollbackWorkerVersion(
        ids.priorVersion,
        ids.deployedVersion,
        {
          listDeployments: async () => responses.shift()!,
          rollback: async () => {},
        },
        { attempts: 2, delayMs: 0, sleep: async () => {} },
      ),
    ).rejects.toThrow("2회 안에 확인하지 못했습니다");
  });

  test("frozen Wrangler 4.45.3 명령 계약에 맞는 인자만 만든다", () => {
    expect(WRANGLER_COMMAND).toEqual(["bunx", "--no-install", "wrangler"]);
    expect(WRANGLER_DEPLOYMENTS_LIST_ARGS).toEqual([
      "deployments",
      "list",
      "--name",
      ROOTAGE_WORKER_NAME,
      "--json",
    ]);
    expect(wranglerRollbackArgs(ids.priorVersion)).toEqual([
      "rollback",
      ids.priorVersion,
      "--name",
      ROOTAGE_WORKER_NAME,
      "--message",
      WRANGLER_ROLLBACK_MESSAGE,
      "--yes",
    ]);
    expect(wranglerRollbackArgs(ids.priorVersion, WRANGLER_MANUAL_ROLLBACK_MESSAGE)).toEqual([
      "rollback",
      ids.priorVersion,
      "--name",
      ROOTAGE_WORKER_NAME,
      "--message",
      WRANGLER_MANUAL_ROLLBACK_MESSAGE,
      "--yes",
    ]);
  });
});
