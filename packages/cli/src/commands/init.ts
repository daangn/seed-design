import * as p from "@clack/prompts";
import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { command, constant, option } from "@optique/core/primitives";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import { cwdOption, type ParsedOptions } from "../utils/cli-options";
import { handleCliError, isCliCancelError } from "../utils/error";
import {
  DEFAULT_INIT_CONFIG,
  detectFramework,
  promptInitConfig,
  writeInitConfigFile,
} from "../utils/init-config";

import type { Config } from "@/src/utils/get-config";

import dedent from "dedent";

export const initParser = command(
  "init",
  object({
    command: constant("init"),
    cwd: cwdOption,
    yes: option("-y", "--yes", { description: message`모든 질문에 기본값으로 답변합니다.` }),
  }),
  { brief: message`seed-design.json 파일을 생성합니다` },
);

export async function runInit({ verbose, ...options }: ParsedOptions<typeof initParser>) {
  const startTime = Date.now();
  const trackCwd = options.cwd;
  p.intro("seed-design.json 파일 생성");

  try {
    const config: Config = options.yes
      ? { ...DEFAULT_INIT_CONFIG, framework: detectFramework(options.cwd) }
      : await promptInitConfig(options.cwd);

    const { start, stop } = p.spinner();
    start("seed-design.json 파일 생성중...");
    const relativePath = await (async () => {
      try {
        const result = await writeInitConfigFile({
          cwd: options.cwd,
          config,
        });

        return result.relativePath;
      } catch (error) {
        stop("seed-design.json 파일 생성이 중단됐어요.");
        throw error;
      }
    })();

    stop(`seed-design.json 파일이 ${highlight(relativePath)}에 생성됐어요.`);

    p.log.info(highlight("seed-design add {component} 명령어로 컴포넌트를 추가해보세요!"));
    p.log.info(highlight("seed-design add 명령어로 추가할 수 있는 모든 컴포넌트를 확인해보세요."));

    p.note(
      dedent(`SEED Design CLI는 개선을 위해 익명 사용 데이터를 수집해요.

      비활성화하려면:
        • seed-design.json에서 ${highlight('"telemetry": false')}로 설정
        • ${highlight("DISABLE_TELEMETRY=true")} 환경 변수 설정

      자세한 내용: https://seed-design.io/react/getting-started/cli/configuration#telemetry`),
      "Telemetry 안내",
    );

    p.outro("작업이 완료됐어요.");

    // init 성공 이벤트 추적
    const duration = Date.now() - startTime;
    try {
      await analytics.trackCommandOutcome(options.cwd, {
        command: "init",
        status: "completed",
        properties: {
          tsx: config.tsx,
          rsc: config.rsc,
          telemetry: config.telemetry,
          yes_option: options.yes,
          duration_ms: duration,
        },
      });
    } catch (telemetryError) {
      if (verbose) {
        console.error("[Telemetry] init 이벤트 전송에 실패했어요:", telemetryError);
      }
    }
  } catch (error) {
    if (isCliCancelError(error)) {
      try {
        await analytics.trackCommandOutcome(trackCwd, {
          command: "init",
          status: "cancelled",
          properties: {
            duration_ms: Date.now() - startTime,
          },
        });
      } catch (telemetryError) {
        if (verbose) {
          console.error("[Telemetry] init 이벤트 전송에 실패했어요:", telemetryError);
        }
      }
      p.outro(highlight(error.message));
      process.exit(0);
    }

    try {
      await analytics.trackCommandFailure(trackCwd, {
        command: "init",
        error,
        properties: {
          duration_ms: Date.now() - startTime,
        },
      });
    } catch (telemetryError) {
      if (verbose) {
        console.error("[Telemetry] init 이벤트 전송에 실패했어요:", telemetryError);
      }
    }

    handleCliError(error, {
      defaultMessage: "seed-design.json 파일 생성에 실패했어요.",
      defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
      verbose,
    });
    process.exit(1);
  }
}
