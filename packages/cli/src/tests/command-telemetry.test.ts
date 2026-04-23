import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { CAC } from "cac";
import { cac } from "cac";
import { CliCancelError } from "../utils/error";
import { analytics } from "../utils/analytics";

const introMock = mock(() => {});
const outroMock = mock(() => {});
const infoMock = mock(() => {});
const messageMock = mock(() => {});
const errorMock = mock(() => {});
const noteMock = mock(() => {});
const spinnerStartMock = mock(() => {});
const spinnerStopMock = mock(() => {});
const promptInitConfigMock = mock(async () => ({
  tsx: true,
  rsc: false,
  path: "./seed-design",
  telemetry: true,
}));
const writeInitConfigFileMock = mock(async () => ({
  relativePath: "seed-design.json",
}));

mock.module("@clack/prompts", () => ({
  intro: introMock,
  outro: outroMock,
  note: noteMock,
  log: {
    info: infoMock,
    message: messageMock,
    error: errorMock,
  },
  spinner: () => ({
    start: spinnerStartMock,
    stop: spinnerStopMock,
  }),
  isCancel: () => false,
}));

mock.module("../utils/init-config", () => ({
  DEFAULT_INIT_CONFIG: {
    tsx: true,
    rsc: false,
    path: "./seed-design",
    telemetry: true,
  },
  promptInitConfig: promptInitConfigMock,
  writeInitConfigFile: writeInitConfigFileMock,
}));

const { addCommand } = await import("../commands/add");
const { initCommand } = await import("../commands/init");

function getCommand(cli: CAC, name: string) {
  const command = cli.commands.find((item) => item.name === name);

  if (!command) {
    throw new Error(`Command not found: ${name}`);
  }

  return command;
}

describe("command telemetry", () => {
  beforeEach(() => {
    introMock.mockClear();
    outroMock.mockClear();
    infoMock.mockClear();
    messageMock.mockClear();
    errorMock.mockClear();
    noteMock.mockClear();
    spinnerStartMock.mockClear();
    spinnerStopMock.mockClear();
    promptInitConfigMock.mockClear();
    writeInitConfigFileMock.mockClear();
  });

  it("init 성공 시 completed outcome을 전송해야 한다", async () => {
    const trackCommandOutcomeSpy = spyOn(analytics, "trackCommandOutcome").mockImplementation(
      async () => {},
    );
    const trackCommandFailureSpy = spyOn(analytics, "trackCommandFailure").mockImplementation(
      async () => {},
    );
    const cli = cac("seed-design");
    initCommand(cli);

    await getCommand(cli, "init").commandAction({
      cwd: "/tmp/seed-design",
      yes: true,
      default: false,
    });

    expect(writeInitConfigFileMock).toHaveBeenCalledTimes(1);
    expect(trackCommandOutcomeSpy).toHaveBeenCalledWith(
      "/tmp/seed-design",
      expect.objectContaining({
        command: "init",
        status: "completed",
        properties: expect.objectContaining({
          yes_option: true,
          telemetry: true,
        }),
      }),
    );
    expect(trackCommandFailureSpy).not.toHaveBeenCalled();

    trackCommandOutcomeSpy.mockRestore();
    trackCommandFailureSpy.mockRestore();
  });

  it("init 취소 시 cancelled outcome을 전송해야 한다", async () => {
    const trackCommandOutcomeSpy = spyOn(analytics, "trackCommandOutcome").mockImplementation(
      async () => {},
    );
    const trackCommandFailureSpy = spyOn(analytics, "trackCommandFailure").mockImplementation(
      async () => {},
    );
    promptInitConfigMock.mockImplementationOnce(async () => {
      throw new CliCancelError("작업이 취소됐어요.");
    });

    const exitSpy = spyOn(process, "exit").mockImplementation(((code?: number) => {
      throw new Error(`EXIT:${code}`);
    }) as never);

    const cli = cac("seed-design");
    initCommand(cli);

    await expect(
      getCommand(cli, "init").commandAction({
        cwd: "/tmp/seed-design",
        yes: false,
        default: false,
      }),
    ).rejects.toThrow("EXIT:0");

    expect(trackCommandOutcomeSpy).toHaveBeenCalledWith(
      "/tmp/seed-design",
      expect.objectContaining({
        command: "init",
        status: "cancelled",
      }),
    );
    expect(trackCommandFailureSpy).not.toHaveBeenCalled();

    exitSpy.mockRestore();
    trackCommandOutcomeSpy.mockRestore();
    trackCommandFailureSpy.mockRestore();
  });

  it("add 실패 시 failed outcome을 전송해야 한다", async () => {
    const trackCommandFailureSpy = spyOn(analytics, "trackCommandFailure").mockImplementation(
      async () => {},
    );
    const exitSpy = spyOn(process, "exit").mockImplementation(((code?: number) => {
      throw new Error(`EXIT:${code}`);
    }) as never);

    const cli = cac("seed-design");
    addCommand(cli);

    await expect(
      getCommand(cli, "add").commandAction([], {
        all: true,
        cwd: "/tmp/seed-design",
        baseUrl: "https://seed-design.io",
      }),
    ).rejects.toThrow("EXIT:1");

    expect(trackCommandFailureSpy).toHaveBeenCalledWith(
      "/tmp/seed-design",
      expect.objectContaining({
        command: "add",
        error: expect.objectContaining({
          name: "CliError",
        }),
      }),
    );

    exitSpy.mockRestore();
    trackCommandFailureSpy.mockRestore();
  });
});
