import * as p from "@clack/prompts";
import { z } from "zod";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import { handleCliError, isCliCancelError, isVerboseMode } from "../utils/error";
import { DEFAULT_INIT_CONFIG, promptInitConfig, writeInitConfigFile } from "../utils/init-config";

import type { Config } from "@/src/utils/get-config";

import type { CAC } from "cac";
import dedent from "dedent";

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean().optional(),
  default: z.boolean().optional(),
});

export const initCommand = (cli: CAC) => {
  cli
    .command("init", "seed-design.json 파일 생성")
    .option("-c, --cwd <cwd>", "작업 디렉토리. 기본값은 현재 디렉토리.", {
      default: process.cwd(),
    })
    .option("-y, --yes", "모든 질문에 대해 기본값으로 답변합니다.")
    .option("--default", "Deprecated. --yes와 동일하게 기본값으로 생성합니다.")
    .action(async (opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      p.intro("seed-design.json 파일 생성");

      try {
        const parsed = initOptionsSchema.safeParse(opts);
        if (!parsed.success) {
          throw parsed.error;
        }

        const options = parsed.data;
        const isDefaultMode = options.yes || options.default;
        const config: Config = isDefaultMode ? DEFAULT_INIT_CONFIG : await promptInitConfig();

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
        p.log.info(
          highlight("seed-design add 명령어로 추가할 수 있는 모든 컴포넌트를 확인해보세요."),
        );

        p.note(
          dedent(`SEED Design CLI는 개선을 위해 익명 사용 데이터를 수집해요.

      비활성화하려면:
        • seed-design.json에서 ${highlight('"telemetry": false')}로 설정
        • ${highlight("DISABLE_TELEMETRY=true")} 환경 변수 설정

      자세한 내용: https://seed-design.com/react/getting-started/cli/configuration#telemetry`),
          "Telemetry 안내",
        );

        p.outro("작업이 완료됐어요.");

        // init 성공 이벤트 추적
        const duration = Date.now() - startTime;
        try {
          await analytics.track(options.cwd, {
            event: "init",
            properties: {
              tsx: config.tsx,
              rsc: config.rsc,
              telemetry: config.telemetry,
              yes_option: isDefaultMode,
              duration_ms: duration,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] init tracking failed:", telemetryError);
          }
        }
      } catch (error) {
        if (isCliCancelError(error)) {
          p.outro(highlight(error.message));
          process.exit(0);
        }

        handleCliError(error, {
          defaultMessage: "seed-design.json 파일 생성에 실패했어요.",
          defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
          verbose,
        });
        process.exit(1);
      }
    });
};
