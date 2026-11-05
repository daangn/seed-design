import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { ROOTAGE_WORKER_VERSION_HEADER } from "./deployment-metadata";
import { verifyProductionDeployment } from "./verify-deployment";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

async function stateFile(state: unknown): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "rootage-deploy-smoke-test-"));
  temporaryDirectories.push(directory);
  const path = join(directory, "state.json");
  await writeFile(path, `${JSON.stringify(state)}\n`);
  return path;
}

describe("Rootage exact production deployment smoke", () => {
  test("state에 기록한 exact Worker version header만 승인한다", async () => {
    const expectedVersionId = "44444444-4444-4444-4444-444444444444";
    const path = await stateFile({
      schemaVersion: 1,
      workerName: "seed-design-rootage",
      priorDeploymentId: "11111111-1111-1111-1111-111111111111",
      priorVersionId: "22222222-2222-2222-2222-222222222222",
      expectedVersionId,
      deployedDeploymentId: "33333333-3333-3333-3333-333333333333",
      deployedVersionId: expectedVersionId,
    });
    await expect(
      verifyProductionDeployment(path, async () =>
        Response.json(
          { version: "2.4.0", resources: [{ path: "/color.json" }] },
          { headers: { [ROOTAGE_WORKER_VERSION_HEADER]: expectedVersionId } },
        ),
      ),
    ).resolves.toBe(expectedVersionId);
  });

  test("record 완료 전 state는 public 요청 전에 거부한다", async () => {
    const path = await stateFile({
      schemaVersion: 1,
      workerName: "seed-design-rootage",
      priorDeploymentId: "11111111-1111-1111-1111-111111111111",
      priorVersionId: "22222222-2222-2222-2222-222222222222",
      expectedVersionId: "44444444-4444-4444-4444-444444444444",
    });
    let requested = false;
    await expect(
      verifyProductionDeployment(path, async () => {
        requested = true;
        return new Response();
      }),
    ).rejects.toThrow("exact deployed version");
    expect(requested).toBe(false);
  });
});
