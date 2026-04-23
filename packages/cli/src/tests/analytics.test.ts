import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import fs from "fs-extra";
import os from "os";
import path from "path";
import * as prompts from "@clack/prompts";
import { analytics } from "../utils/analytics";

describe("analytics command outcome tracking", () => {
  const originalEnv = { ...process.env };
  const tempDirs: string[] = [];

  beforeEach(() => {
    process.env.NODE_ENV = "prod";
    process.env.POSTHOG_API_KEY = "test-api-key";
    process.env.POSTHOG_HOST = "https://us.i.posthog.com";
    delete process.env.DISABLE_TELEMETRY;
    delete process.env.SEED_DISABLE_TELEMETRY;
  });

  afterEach(async () => {
    process.env = { ...originalEnv };
    mock.restore();

    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) {
        await fs.remove(dir);
      }
    }
  });

  async function createTempCwd() {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "seed-cli-analytics-"));
    tempDirs.push(cwd);
    return cwd;
  }

  it("command outcome payload에 status를 포함해야 한다", async () => {
    const cwd = await createTempCwd();
    const fetchSpy = spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response(null, { status: 200 }),
    );
    const infoSpy = spyOn(prompts.log, "info").mockImplementation(() => {});

    await analytics.trackCommandOutcome(cwd, {
      command: "add",
      status: "completed",
      properties: {
        items_count: 2,
      },
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalled();

    const [, request] = fetchSpy.mock.calls[0] ?? [];
    const payload = JSON.parse(String(request?.body));

    expect(payload.event).toBe("seed_cli.add");
    expect(payload.properties).toMatchObject({
      status: "completed",
      items_count: 2,
      $process_person_profile: false,
    });
  });

  it("failed outcome payload에는 error_type만 포함하고 message는 포함하지 않아야 한다", async () => {
    const cwd = await createTempCwd();
    const fetchSpy = spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response(null, { status: 200 }),
    );
    spyOn(prompts.log, "info").mockImplementation(() => {});

    await analytics.trackCommandFailure(cwd, {
      command: "docs",
      error: new Error("sensitive details"),
      properties: {
        raw_mode: true,
      },
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [, request] = fetchSpy.mock.calls[0] ?? [];
    const payload = JSON.parse(String(request?.body));

    expect(payload.event).toBe("seed_cli.docs");
    expect(payload.properties).toMatchObject({
      status: "failed",
      error_type: "Error",
      raw_mode: true,
    });
    expect(payload.properties.error_message).toBeUndefined();
  });
});
