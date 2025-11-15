import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { z } from "zod";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";

import type { Config } from "@/src/utils/get-config";

import type { CAC } from "cac";
import dedent from "dedent";

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean().optional(),
});

export const initCommand = (cli: CAC) => {
  cli
    .command("init", "seed-design.json 파일 생성")
    .option("-c, --cwd <cwd>", "작업 디렉토리. 기본값은 현재 디렉토리.", {
      default: process.cwd(),
    })
    .option("-y, --yes", "모든 질문에 대해 기본값으로 답변합니다.")
    .action(async (opts) => {
      const startTime = Date.now();
      p.intro("seed-design.json 파일 생성");

      const options = initOptionsSchema.parse(opts);
      const isYesOption = options.yes;
      let config: Config = {
        rsc: false,
        tsx: true,
        path: "./seed-design",
        telemetry: true,
      };

      if (!isYesOption) {
        const group = await p.group(
          {
            tsx: () =>
              p.confirm({
                message: `${highlight("TypeScript")}를 사용중이신가요?`,
                initialValue: true,
              }),
            rsc: () =>
              p.confirm({
                message: `${highlight("React Server Components")}를 사용중이신가요?`,
                initialValue: false,
              }),
            path: () =>
              p.text({
                message: `${highlight("seed-design 폴더")} 경로를 입력해주세요. (기본값은 프로젝트 루트에 생성됩니다.)`,
                initialValue: "./seed-design",
                defaultValue: "./seed-design",
                placeholder: "./seed-design",
              }),
            telemetry: () =>
              p.confirm({
                message: `개선을 위해 ${highlight("익명 사용 데이터")}를 수집할까요?`,
                initialValue: true,
              }),
          },
          {
            onCancel: () => {
              p.cancel("작업이 취소됐어요.");
              process.exit(0);
            },
          },
        );

        config = {
          ...group,
        };
      }

      try {
        const { start, stop } = p.spinner();
        start("seed-design.json 파일 생성중...");
        const targetPath = path.resolve(options.cwd, "seed-design.json");
        await fs.writeFile(targetPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
        const relativePath = path.relative(process.cwd(), targetPath);
        stop(`seed-design.json 파일이 ${highlight(relativePath)}에 생성됐어요.`);

        // init 성공 이벤트 추적
        const duration = Date.now() - startTime;
        await analytics.track(options.cwd, {
          event: "init",
          properties: {
            tsx: config.tsx,
            rsc: config.rsc,
            telemetry: config.telemetry,
            yes_option: isYesOption,
            duration_ms: duration,
          },
        });

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
      } catch (error) {
        // 실패 이벤트 추적
        await analytics.track(options.cwd, {
          event: "command-failed",
          properties: {
            command: "init",
            error_type: error instanceof Error ? error.name : "Unknown",
            error_message: error instanceof Error ? error.message : String(error),
          },
        });

        p.log.error(`seed-design.json 파일 생성에 실패했어요. ${error}`);
        p.outro(highlight("작업이 취소됐어요."));
        process.exit(1);
      }
    });
};
