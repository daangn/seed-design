import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import fs from "fs-extra";

import { getRawDoctorConfig } from "../utils/doctor-config";

let tempDir: string;

beforeAll(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "seed-doctor-config-"));
});

afterAll(async () => {
  await fs.remove(tempDir);
});

describe("getRawDoctorConfig", () => {
  test("seed-doctor.json이 없으면 null을 반환한다", async () => {
    const emptyDir = path.join(tempDir, "empty");
    await fs.ensureDir(emptyDir);

    expect(await getRawDoctorConfig(emptyDir)).toBeNull();
  });

  test("seed-doctor.json 내용을 원본 그대로 반환한다", async () => {
    const configDir = path.join(tempDir, "with-config");
    const config = {
      ignore: ["legacy/**"],
      rules: { "seed/no-deprecated-component": "error" },
    };
    await fs.outputJSON(path.join(configDir, "seed-doctor.json"), config);

    expect(await getRawDoctorConfig(configDir)).toEqual(config);
  });
});
